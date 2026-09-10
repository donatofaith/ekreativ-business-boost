import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MAX_FILES = 20;
const MAX_TEXT_LENGTH = 5000;

const ALLOWED_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "pdf",
  "mp4",
  "mov",
  "webm",
  "doc",
  "docx",
]);

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function safeText(value: FormDataEntryValue | null) {
  if (!value) return "";
  return String(value).trim().slice(0, MAX_TEXT_LENGTH);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function fileExtension(name: string) {
  const parts = name.toLowerCase().split(".");
  return parts.length > 1 ? parts.pop() || "" : "";
}

function isAllowedFile(file: File) {
  const extensionAllowed = ALLOWED_EXTENSIONS.has(fileExtension(file.name));
  const mimeAllowed = !file.type || ALLOWED_MIME_TYPES.has(file.type);
  return extensionAllowed && mimeAllowed;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const mainGoalsRaw = safeText(formData.get("mainGoals"));

    let mainGoals: string[] = [];

    try {
      const parsed = mainGoalsRaw ? JSON.parse(mainGoalsRaw) : [];
      mainGoals = Array.isArray(parsed)
        ? parsed
            .filter((item): item is string => typeof item === "string")
            .slice(0, 10)
            .map((item) => item.trim().slice(0, 200))
        : [];
    } catch {
      mainGoals = [];
    }

    const submission = {
      business_name: safeText(formData.get("businessName")),
      business_description: safeText(formData.get("businessDescription")),
      services: safeText(formData.get("services")),
      difference: safeText(formData.get("difference")),
      business_location: safeText(formData.get("businessLocation")),
      social_handles: safeText(formData.get("socialHandles")),
      whatsapp_number: safeText(formData.get("whatsappNumber")),
      website: safeText(formData.get("website")),
      customer_age: safeText(formData.get("customerAge")),
      customer_gender: safeText(formData.get("customerGender")),
      customer_location: safeText(formData.get("customerLocation")),
      customer_problem: safeText(formData.get("customerProblem")),
      customer_decision: safeText(formData.get("customerDecision")),
      main_goals: mainGoals,
      primary_action: safeText(formData.get("primaryAction")),
      video_focus: safeText(formData.get("videoFocus")),
      key_message: safeText(formData.get("keyMessage")),
      offer: safeText(formData.get("offer")),
      video_cta: safeText(formData.get("videoCTA")),
      has_logo: safeText(formData.get("hasLogo")),
      has_brand_colours: safeText(formData.get("hasBrandColours")),
      brand_colours: safeText(formData.get("brandColours")),
      design_style: safeText(formData.get("designStyle")),
      brand_fonts: safeText(formData.get("brandFonts")),
      design_1: safeText(formData.get("design1")),
      design_2: safeText(formData.get("design2")),
      design_3: safeText(formData.get("design3")),
      design_4: safeText(formData.get("design4")),
      design_5: safeText(formData.get("design5")),
      whatsapp_ad_focus: safeText(formData.get("whatsappAdFocus")),
      whatsapp_ad_info: safeText(formData.get("whatsappAdInfo")),
      whatsapp_ad_action: safeText(formData.get("whatsappAdAction")),
      copy_1: safeText(formData.get("copy1")),
      copy_2: safeText(formData.get("copy2")),
      copy_3: safeText(formData.get("copy3")),
      exclusions: safeText(formData.get("exclusions")),
      extra_notes: safeText(formData.get("extraNotes")),
    };

    if (!submission.business_name) {
      return NextResponse.json(
        { success: false, message: "Business name is required." },
        { status: 400 },
      );
    }

    if (!submission.whatsapp_number) {
      return NextResponse.json(
        { success: false, message: "WhatsApp number is required." },
        { status: 400 },
      );
    }

    const fileEntries = formData
      .getAll("files")
      .filter((item): item is File => item instanceof File && item.size > 0);

    if (fileEntries.length > MAX_FILES) {
      return NextResponse.json(
        { success: false, message: `You can upload a maximum of ${MAX_FILES} files.` },
        { status: 400 },
      );
    }

    for (const file of fileEntries) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, message: `${file.name} is larger than 15MB.` },
          { status: 400 },
        );
      }

      if (!isAllowedFile(file)) {
        return NextResponse.json(
          {
            success: false,
            message: `${file.name} is not an allowed file type. Please upload JPG, PNG, WebP, PDF, MP4, MOV, WebM, DOC or DOCX files only.`,
          },
          { status: 400 },
        );
      }
    }

    const { data: createdSubmission, error: insertError } = await supabaseAdmin
      .from("business_boost_submissions")
      .insert(submission)
      .select("id")
      .single();

    if (insertError || !createdSubmission) {
      console.error("Supabase insert error:", insertError);

      return NextResponse.json(
        { success: false, message: "We could not save your submission." },
        { status: 500 },
      );
    }

    const submissionId = createdSubmission.id;
    const uploadedFiles: Array<{
      name: string;
      path: string;
      type: string;
      size: number;
    }> = [];

    for (const item of fileEntries) {
      const cleanName = item.name
        .replace(/[^a-zA-Z0-9._-]/g, "-")
        .toLowerCase();

      const storagePath = `${submissionId}/${crypto.randomUUID()}-${cleanName}`;
      const arrayBuffer = await item.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabaseAdmin.storage
        .from("business-boost-assets")
        .upload(storagePath, buffer, {
          contentType: item.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        console.error("File upload error:", uploadError);
        continue;
      }

      uploadedFiles.push({
        name: item.name,
        path: storagePath,
        type: item.type,
        size: item.size,
      });
    }

    if (uploadedFiles.length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from("business_boost_submissions")
        .update({ uploaded_files: uploadedFiles })
        .eq("id", submissionId);

      if (updateError) {
        console.error("Submission file metadata update failed:", updateError);
      }
    }

    const notificationEmail = process.env.BUSINESS_NOTIFICATION_EMAIL;

    if (process.env.RESEND_API_KEY && notificationEmail) {
      try {
        const businessName = escapeHtml(submission.business_name);
        const whatsappNumber = escapeHtml(submission.whatsapp_number || "Not provided");
        const location = escapeHtml(submission.business_location || "Not provided");
        const description = escapeHtml(submission.business_description || "Not provided");
        const services = escapeHtml(submission.services || "Not provided");
        const goals = escapeHtml(
          submission.main_goals.length
            ? submission.main_goals.join(", ")
            : "Not provided",
        );
        const primaryAction = escapeHtml(submission.primary_action || "Not provided");
        const videoFocus = escapeHtml(submission.video_focus || "Not provided");
        const designStyle = escapeHtml(submission.design_style || "Not provided");
        const brandColours = escapeHtml(submission.brand_colours || "Not provided");

        await resend.emails.send({
          from: "eKreativ Business Boost <onboarding@resend.dev>",
          to: notificationEmail,
          subject: `New Business Boost Submission — ${submission.business_name.replace(/[\r\n]/g, " ")}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#0c1c36;">
              <div style="background:#061b40;padding:28px;border-radius:16px 16px 0 0;color:white;">
                <div style="color:#ffd51f;font-size:12px;font-weight:bold;">AI BUSINESS BOOST</div>
                <h1 style="margin:8px 0 0;font-size:26px;">New Client Submission</h1>
              </div>
              <div style="border:1px solid #e1e7ef;border-top:0;padding:28px;border-radius:0 0 16px 16px;">
                <h2>${businessName}</h2>
                <p><strong>WhatsApp:</strong> ${whatsappNumber}</p>
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Business:</strong><br/>${description}</p>
                <p><strong>Products / Services:</strong><br/>${services}</p>
                <p><strong>Main Goals:</strong><br/>${goals}</p>
                <p><strong>Primary Action:</strong><br/>${primaryAction}</p>
                <p><strong>Video Focus:</strong><br/>${videoFocus}</p>
                <p><strong>Design Style:</strong> ${designStyle}</p>
                <p><strong>Brand Colours:</strong> ${brandColours}</p>
                <p><strong>Files Uploaded:</strong> ${uploadedFiles.length}</p>
                <hr style="border:0;border-top:1px solid #e5eaf0;margin:24px 0;"/>
                <p style="font-size:12px;color:#718096;">Submission ID: ${escapeHtml(submissionId)}</p>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Email error:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      submissionId,
      businessName: submission.business_name,
    });
  } catch (error) {
    console.error("Submission API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while submitting your brief.",
      },
      { status: 500 },
    );
  }
}
