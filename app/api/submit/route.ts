import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MAX_FILES = 20;
const MAX_TEXT_LENGTH = 5000;
const SIGNED_URL_SECONDS = 60 * 60 * 24 * 7;

const UPLOAD_GROUPS = {
  logo: "Logo",
  photos: "Photos",
  videos: "Videos",
  catalogue: "Catalogue / Price List",
  references: "Reference Designs",
} as const;

type UploadGroupKey = keyof typeof UPLOAD_GROUPS;

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

function formatValue(value: string | string[]) {
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "Not provided";
  }
  return value?.trim() ? value : "Not provided";
}

function detailRow(label: string, value: string | string[]) {
  return `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e8edf4;font-weight:700;vertical-align:top;width:34%;">${escapeHtml(label)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e8edf4;white-space:pre-wrap;">${escapeHtml(formatValue(value))}</td>
    </tr>
  `;
}

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hasValidAccess(request: NextRequest) {
  const accessCode = process.env.ONBOARDING_ACCESS_CODE?.trim();
  if (!accessCode) return false;

  const cookieValue = request.cookies.get("ekreativ_onboarding_access")?.value;
  if (!cookieValue) return false;

  const parts = cookieValue.split(".");
  if (parts.length !== 2) return false;

  const [expiresAtRaw, signature] = parts;
  const expiresAt = Number(expiresAtRaw);

  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) {
    return false;
  }

  const expectedSignature = await hmac(
    `ekreativ-onboarding-access.${expiresAtRaw}`,
    accessCode,
  );

  return signature === expectedSignature;
}

export async function POST(request: NextRequest) {
  try {
    if (!(await hasValidAccess(request))) {
      return NextResponse.json(
        { success: false, message: "Your onboarding session is not authorized or has expired." },
        { status: 401 },
      );
    }

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

    const groupedFiles: Array<{ group: UploadGroupKey; file: File }> = [];

    for (const group of Object.keys(UPLOAD_GROUPS) as UploadGroupKey[]) {
      const entries = formData
        .getAll(`files_${group}`)
        .filter((item): item is File => item instanceof File && item.size > 0);

      for (const file of entries) {
        groupedFiles.push({ group, file });
      }
    }

    // Backward compatibility with any older form version still posting "files".
    for (const item of formData.getAll("files")) {
      if (item instanceof File && item.size > 0) {
        groupedFiles.push({ group: "references", file: item });
      }
    }

    if (groupedFiles.length > MAX_FILES) {
      return NextResponse.json(
        { success: false, message: `You can upload a maximum of ${MAX_FILES} files.` },
        { status: 400 },
      );
    }

    for (const { file } of groupedFiles) {
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
      category: UploadGroupKey;
      category_label: string;
      view_url?: string;
      download_url?: string;
    }> = [];

    for (const { group, file } of groupedFiles) {
      const cleanName = file.name
        .replace(/[^a-zA-Z0-9._-]/g, "-")
        .toLowerCase();

      const storagePath = `${submissionId}/${group}/${crypto.randomUUID()}-${cleanName}`;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabaseAdmin.storage
        .from("business-boost-assets")
        .upload(storagePath, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        console.error("File upload error:", uploadError);
        continue;
      }

      const [{ data: viewData }, { data: downloadData }] = await Promise.all([
        supabaseAdmin.storage
          .from("business-boost-assets")
          .createSignedUrl(storagePath, SIGNED_URL_SECONDS),
        supabaseAdmin.storage
          .from("business-boost-assets")
          .createSignedUrl(storagePath, SIGNED_URL_SECONDS, { download: file.name }),
      ]);

      uploadedFiles.push({
        name: file.name,
        path: storagePath,
        type: file.type,
        size: file.size,
        category: group,
        category_label: UPLOAD_GROUPS[group],
        view_url: viewData?.signedUrl,
        download_url: downloadData?.signedUrl,
      });
    }

    if (uploadedFiles.length > 0) {
      const dbFileMetadata = uploadedFiles.map(
        ({ view_url: _viewUrl, download_url: _downloadUrl, ...file }) => file,
      );

      const { error: updateError } = await supabaseAdmin
        .from("business_boost_submissions")
        .update({ uploaded_files: dbFileMetadata })
        .eq("id", submissionId);

      if (updateError) {
        console.error("Submission file metadata update failed:", updateError);
      }
    }

    const notificationEmail = process.env.BUSINESS_NOTIFICATION_EMAIL;

    if (process.env.RESEND_API_KEY && notificationEmail) {
      try {
        const sections = [
          {
            title: "Business Information",
            rows: [
              ["Business / Brand Name", submission.business_name],
              ["Business Description", submission.business_description],
              ["Products / Services", submission.services],
              ["What Makes the Business Different", submission.difference],
              ["Business Location", submission.business_location],
              ["Social Handles", submission.social_handles],
              ["WhatsApp / Phone", submission.whatsapp_number],
              ["Website", submission.website],
            ],
          },
          {
            title: "Target Customer",
            rows: [
              ["Customer Age", submission.customer_age],
              ["Customer Gender", submission.customer_gender],
              ["Customer Location", submission.customer_location],
              ["Customer Problem / Need", submission.customer_problem],
              ["What Influences Their Decision", submission.customer_decision],
            ],
          },
          {
            title: "Campaign Goal",
            rows: [
              ["Main Goals", submission.main_goals],
              ["Primary Action", submission.primary_action],
            ],
          },
          {
            title: "Promotional Video",
            rows: [
              ["Video Focus", submission.video_focus],
              ["Key Message", submission.key_message],
              ["Offer / Promotion", submission.offer],
              ["Video Call-to-Action", submission.video_cta],
            ],
          },
          {
            title: "Brand Identity",
            rows: [
              ["Has Logo", submission.has_logo],
              ["Has Brand Colours", submission.has_brand_colours],
              ["Brand Colours", submission.brand_colours],
              ["Preferred Design Style", submission.design_style],
              ["Brand Fonts", submission.brand_fonts],
            ],
          },
          {
            title: "Five Social Media Designs",
            rows: [
              ["Design 1", submission.design_1],
              ["Design 2", submission.design_2],
              ["Design 3", submission.design_3],
              ["Design 4", submission.design_4],
              ["Design 5", submission.design_5],
            ],
          },
          {
            title: "WhatsApp Status Ad",
            rows: [
              ["What the Flyer Should Promote", submission.whatsapp_ad_focus],
              ["Information That Must Appear", submission.whatsapp_ad_info],
              ["Action People Should Take", submission.whatsapp_ad_action],
            ],
          },
          {
            title: "Marketing Copies & Final Notes",
            rows: [
              ["Copy 1", submission.copy_1],
              ["Copy 2", submission.copy_2],
              ["Copy 3", submission.copy_3],
              ["Do Not Include", submission.exclusions],
              ["Extra Notes", submission.extra_notes],
            ],
          },
        ];

        const sectionsHtml = sections
          .map(
            (section) => `
              <div style="margin-top:26px;">
                <h3 style="margin:0 0 10px;color:#061b40;font-size:18px;">${escapeHtml(section.title)}</h3>
                <table role="presentation" style="width:100%;border-collapse:collapse;border:1px solid #e8edf4;border-radius:10px;overflow:hidden;">
                  <tbody>
                    ${section.rows.map(([label, value]) => detailRow(label as string, value as string | string[])).join("")}
                  </tbody>
                </table>
              </div>
            `,
          )
          .join("");

        const fileGroupsHtml = (Object.keys(UPLOAD_GROUPS) as UploadGroupKey[])
          .map((group) => {
            const files = uploadedFiles.filter((file) => file.category === group);
            if (!files.length) return "";

            return `
              <div style="margin-top:18px;">
                <h4 style="margin:0 0 10px;color:#0c1c36;">${escapeHtml(UPLOAD_GROUPS[group])}</h4>
                ${files
                  .map((file) => {
                    const viewButton = file.view_url
                      ? `<a href="${escapeHtml(file.view_url)}" style="display:inline-block;margin-right:8px;padding:9px 14px;border-radius:8px;background:#0a78ff;color:#fff;text-decoration:none;font-weight:700;">View</a>`
                      : "";

                    const downloadButton = file.download_url
                      ? `<a href="${escapeHtml(file.download_url)}" style="display:inline-block;padding:9px 14px;border-radius:8px;background:#061b40;color:#fff;text-decoration:none;font-weight:700;">Download</a>`
                      : "";

                    return `
                      <div style="padding:14px;border:1px solid #e8edf4;border-radius:10px;margin-bottom:10px;background:#f9fbfd;">
                        <div style="font-weight:700;margin-bottom:8px;">${escapeHtml(file.name)}</div>
                        <div style="font-size:12px;color:#667085;margin-bottom:10px;">${escapeHtml(file.type || "file")} • ${Math.max(1, Math.round(file.size / 1024))} KB</div>
                        ${viewButton}${downloadButton}
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            `;
          })
          .join("");

        await resend.emails.send({
          from: "eKreativ Business Boost <onboarding@resend.dev>",
          to: notificationEmail,
          subject: `New Business Boost Submission — ${submission.business_name.replace(/[\r\n]/g, " ")}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:760px;margin:auto;color:#0c1c36;">
              <div style="background:#061b40;padding:28px;border-radius:16px 16px 0 0;color:white;">
                <div style="color:#ffd51f;font-size:12px;font-weight:bold;">AI BUSINESS BOOST</div>
                <h1 style="margin:8px 0 0;font-size:26px;">Complete Client Onboarding Submission</h1>
                <p style="margin:10px 0 0;color:#dce8ff;">Every form response and uploaded asset is included below.</p>
              </div>

              <div style="border:1px solid #e1e7ef;border-top:0;padding:28px;border-radius:0 0 16px 16px;">
                <div style="padding:14px 16px;background:#fff8cf;border:1px solid #f4df6a;border-radius:10px;">
                  <strong>Submission ID:</strong> ${escapeHtml(submissionId)}<br/>
                  <span style="font-size:12px;color:#6b7280;">Secure file links expire after 7 days.</span>
                </div>

                ${sectionsHtml}

                <div style="margin-top:30px;">
                  <h3 style="margin:0 0 6px;color:#061b40;font-size:18px;">Uploaded Files</h3>
                  <p style="margin:0 0 12px;color:#667085;">${uploadedFiles.length} file(s) uploaded. Use View to open a file or Download to save it.</p>
                  ${fileGroupsHtml || '<p style="color:#667085;">No files were uploaded.</p>'}
                </div>
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
      uploadedFiles: uploadedFiles.map((file) => ({
        name: file.name,
        category: file.category_label,
      })),
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
