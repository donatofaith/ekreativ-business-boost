import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

function safeText(value: FormDataEntryValue | null) {
  if (!value) return "";
  return String(value).trim();
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const mainGoalsRaw = safeText(formData.get("mainGoals"));

    let mainGoals: string[] = [];

    try {
      mainGoals = mainGoalsRaw
        ? JSON.parse(mainGoalsRaw)
        : [];
    } catch {
      mainGoals = [];
    }

    const submission = {
      business_name: safeText(formData.get("businessName")),
      business_description: safeText(
        formData.get("businessDescription")
      ),
      services: safeText(formData.get("services")),
      difference: safeText(formData.get("difference")),
      business_location: safeText(
        formData.get("businessLocation")
      ),
      social_handles: safeText(formData.get("socialHandles")),
      whatsapp_number: safeText(
        formData.get("whatsappNumber")
      ),
      website: safeText(formData.get("website")),

      customer_age: safeText(formData.get("customerAge")),
      customer_gender: safeText(
        formData.get("customerGender")
      ),
      customer_location: safeText(
        formData.get("customerLocation")
      ),
      customer_problem: safeText(
        formData.get("customerProblem")
      ),
      customer_decision: safeText(
        formData.get("customerDecision")
      ),

      main_goals: mainGoals,
      primary_action: safeText(formData.get("primaryAction")),

      video_focus: safeText(formData.get("videoFocus")),
      key_message: safeText(formData.get("keyMessage")),
      offer: safeText(formData.get("offer")),
      video_cta: safeText(formData.get("videoCTA")),

      has_logo: safeText(formData.get("hasLogo")),
      has_brand_colours: safeText(
        formData.get("hasBrandColours")
      ),
      brand_colours: safeText(formData.get("brandColours")),
      design_style: safeText(formData.get("designStyle")),
      brand_fonts: safeText(formData.get("brandFonts")),

      design_1: safeText(formData.get("design1")),
      design_2: safeText(formData.get("design2")),
      design_3: safeText(formData.get("design3")),
      design_4: safeText(formData.get("design4")),
      design_5: safeText(formData.get("design5")),

      whatsapp_ad_focus: safeText(
        formData.get("whatsappAdFocus")
      ),
      whatsapp_ad_info: safeText(
        formData.get("whatsappAdInfo")
      ),
      whatsapp_ad_action: safeText(
        formData.get("whatsappAdAction")
      ),

      copy_1: safeText(formData.get("copy1")),
      copy_2: safeText(formData.get("copy2")),
      copy_3: safeText(formData.get("copy3")),

      exclusions: safeText(formData.get("exclusions")),
      extra_notes: safeText(formData.get("extraNotes")),
    };

    if (!submission.business_name) {
      return NextResponse.json(
        {
          success: false,
          message: "Business name is required.",
        },
        { status: 400 }
      );
    }

    if (!submission.whatsapp_number) {
      return NextResponse.json(
        {
          success: false,
          message: "WhatsApp number is required.",
        },
        { status: 400 }
      );
    }

    /*
      ------------------------------------
      SAVE INITIAL SUBMISSION
      ------------------------------------
    */

    const { data: createdSubmission, error: insertError } =
      await supabaseAdmin
        .from("business_boost_submissions")
        .insert(submission)
        .select("id")
        .single();

    if (insertError || !createdSubmission) {
      console.error("Supabase insert error:", insertError);

      return NextResponse.json(
        {
          success: false,
          message: "We could not save your submission.",
        },
        { status: 500 }
      );
    }

    const submissionId = createdSubmission.id;

    /*
      ------------------------------------
      FILE UPLOADS
      ------------------------------------
    */

    const uploadedFiles: Array<{
      name: string;
      path: string;
      type: string;
      size: number;
    }> = [];

    const files = formData.getAll("files");

    for (const item of files) {
      if (!(item instanceof File)) continue;
      if (item.size === 0) continue;

      if (item.size > 15 * 1024 * 1024) {
        return NextResponse.json(
          {
            success: false,
            message: `${item.name} is larger than 15MB.`,
          },
          { status: 400 }
        );
      }

      const cleanName = item.name
        .replace(/[^a-zA-Z0-9._-]/g, "-")
        .toLowerCase();

      const storagePath =
        `${submissionId}/${Date.now()}-${cleanName}`;

      const arrayBuffer = await item.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } =
        await supabaseAdmin.storage
          .from("business-boost-assets")
          .upload(storagePath, buffer, {
            contentType:
              item.type || "application/octet-stream",
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

    /*
      ------------------------------------
      UPDATE DATABASE WITH FILES
      ------------------------------------
    */

    if (uploadedFiles.length > 0) {
      await supabaseAdmin
        .from("business_boost_submissions")
        .update({
          uploaded_files: uploadedFiles,
        })
        .eq("id", submissionId);
    }

    /*
      ------------------------------------
      EMAIL NOTIFICATION
      ------------------------------------
    */

    const notificationEmail =
      process.env.BUSINESS_NOTIFICATION_EMAIL;

    if (process.env.RESEND_API_KEY && notificationEmail) {
      try {
        await resend.emails.send({
          from: "eKreativ Business Boost <onboarding@resend.dev>",
          to: notificationEmail,
          subject: `New Business Boost Submission — ${submission.business_name}`,

          html: `
            <div style="
              font-family:Arial,sans-serif;
              max-width:680px;
              margin:auto;
              color:#0c1c36;
            ">

              <div style="
                background:#061b40;
                padding:28px;
                border-radius:16px 16px 0 0;
                color:white;
              ">
                <div style="
                  color:#ffd51f;
                  font-size:12px;
                  font-weight:bold;
                ">
                  AI BUSINESS BOOST
                </div>

                <h1 style="
                  margin:8px 0 0;
                  font-size:26px;
                ">
                  New Client Submission
                </h1>
              </div>

              <div style="
                border:1px solid #e1e7ef;
                border-top:0;
                padding:28px;
                border-radius:0 0 16px 16px;
              ">

                <h2>${submission.business_name}</h2>

                <p>
                  <strong>WhatsApp:</strong>
                  ${submission.whatsapp_number || "Not provided"}
                </p>

                <p>
                  <strong>Location:</strong>
                  ${submission.business_location || "Not provided"}
                </p>

                <p>
                  <strong>Business:</strong><br/>
                  ${submission.business_description || "Not provided"}
                </p>

                <p>
                  <strong>Products / Services:</strong><br/>
                  ${submission.services || "Not provided"}
                </p>

                <p>
                  <strong>Main Goals:</strong><br/>
                  ${
                    submission.main_goals.length
                      ? submission.main_goals.join(", ")
                      : "Not provided"
                  }
                </p>

                <p>
                  <strong>Primary Action:</strong><br/>
                  ${submission.primary_action || "Not provided"}
                </p>

                <p>
                  <strong>Video Focus:</strong><br/>
                  ${submission.video_focus || "Not provided"}
                </p>

                <p>
                  <strong>Design Style:</strong>
                  ${submission.design_style || "Not provided"}
                </p>

                <p>
                  <strong>Brand Colours:</strong>
                  ${submission.brand_colours || "Not provided"}
                </p>

                <p>
                  <strong>Files Uploaded:</strong>
                  ${uploadedFiles.length}
                </p>

                <hr style="
                  border:0;
                  border-top:1px solid #e5eaf0;
                  margin:24px 0;
                "/>

                <p style="
                  font-size:12px;
                  color:#718096;
                ">
                  Submission ID: ${submissionId}
                </p>

              </div>
            </div>
          `,
        });
      } catch (emailError) {
        /*
         * Do not destroy the submission just because
         * the notification email failed.
         */
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
        message:
          "Something went wrong while submitting your brief.",
      },
      { status: 500 }
    );
  }
}