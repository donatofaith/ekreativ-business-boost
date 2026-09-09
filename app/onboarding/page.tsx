"use client";

import {
  ChangeEvent,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

type FormDataState = {
  businessName: string;
  businessDescription: string;
  services: string;
  difference: string;
  businessLocation: string;
  socialHandles: string;
  whatsappNumber: string;
  website: string;

  customerAge: string;
  customerGender: string;
  customerLocation: string;
  customerProblem: string;
  customerDecision: string;

  mainGoals: string[];
  primaryAction: string;

  videoFocus: string;
  keyMessage: string;
  offer: string;
  videoCTA: string;

  hasLogo: string;
  hasBrandColours: string;
  brandColours: string;
  designStyle: string;
  brandFonts: string;

  design1: string;
  design2: string;
  design3: string;
  design4: string;
  design5: string;

  whatsappAdFocus: string;
  whatsappAdInfo: string;
  whatsappAdAction: string;

  copy1: string;
  copy2: string;
  copy3: string;

  exclusions: string;
  extraNotes: string;
};

type UploadGroup = {
  logo: File[];
  photos: File[];
  videos: File[];
  catalogue: File[];
  references: File[];
};

const initialData: FormDataState = {
  businessName: "",
  businessDescription: "",
  services: "",
  difference: "",
  businessLocation: "",
  socialHandles: "",
  whatsappNumber: "",
  website: "",

  customerAge: "",
  customerGender: "",
  customerLocation: "",
  customerProblem: "",
  customerDecision: "",

  mainGoals: [],
  primaryAction: "",

  videoFocus: "",
  keyMessage: "",
  offer: "",
  videoCTA: "",

  hasLogo: "",
  hasBrandColours: "",
  brandColours: "",
  designStyle: "",
  brandFonts: "",

  design1: "",
  design2: "",
  design3: "",
  design4: "",
  design5: "",

  whatsappAdFocus: "",
  whatsappAdInfo: "",
  whatsappAdAction: "",

  copy1: "",
  copy2: "",
  copy3: "",

  exclusions: "",
  extraNotes: "",
};

const initialUploads: UploadGroup = {
  logo: [],
  photos: [],
  videos: [],
  catalogue: [],
  references: [],
};

const steps = [
  "Business",
  "Customer",
  "Goal",
  "Video",
  "Brand",
  "Designs",
  "WhatsApp",
  "Copies",
  "Review",
];

const goals = [
  "Get more customers",
  "Increase sales",
  "Promote a specific product/service",
  "Build brand awareness",
  "Get more WhatsApp enquiries",
  "Improve my social media presence",
  "Launch something new",
  "Other",
];

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [direction, setDirection] =
    useState<"next" | "back">("next");

  const [form, setForm] =
    useState<FormDataState>(initialData);

  const [uploads, setUploads] =
    useState<UploadGroup>(initialUploads);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [submissionId, setSubmissionId] =
    useState("");

  const progress = useMemo(
    () => ((step + 1) / steps.length) * 100,
    [step]
  );

  const allFiles = useMemo(
    () =>
      Object.values(uploads).flat(),
    [uploads]
  );

  const updateField = (
    field: keyof FormDataState,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
  };

  const toggleGoal = (goal: string) => {
    setForm((prev) => {
      const selected =
        prev.mainGoals.includes(goal);

      return {
        ...prev,
        mainGoals: selected
          ? prev.mainGoals.filter(
              (item) => item !== goal
            )
          : [...prev.mainGoals, goal],
      };
    });

    setError("");
  };

  const validateStep = () => {
    if (step === 0) {
      if (!form.businessName.trim()) {
        setError(
          "Please enter your business or brand name."
        );
        return false;
      }

      if (!form.whatsappNumber.trim()) {
        setError(
          "Please enter your WhatsApp or phone number."
        );
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;

    if (step >= steps.length - 1) return;

    setDirection("next");
    setError("");
    setStep((current) => current + 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const previousStep = () => {
    if (step <= 0) return;

    setDirection("back");
    setError("");
    setStep((current) => current - 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goToCompletedStep = (
    index: number
  ) => {
    if (index > step) return;

    setDirection(
      index < step ? "back" : "next"
    );

    setError("");
    setStep(index);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleFiles = (
    group: keyof UploadGroup,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selected = Array.from(
      event.target.files || []
    );

    if (!selected.length) return;

    const invalid = selected.find(
      (file) =>
        file.size > 15 * 1024 * 1024
    );

    if (invalid) {
      setError(
        `${invalid.name} is larger than 15MB. Please choose a smaller file.`
      );
      event.target.value = "";
      return;
    }

    setUploads((current) => ({
      ...current,
      [group]: [
        ...current[group],
        ...selected,
      ],
    }));

    setError("");
    event.target.value = "";
  };

  const removeFile = (
    group: keyof UploadGroup,
    index: number
  ) => {
    setUploads((current) => ({
      ...current,
      [group]: current[group].filter(
        (_, fileIndex) =>
          fileIndex !== index
      ),
    }));
  };

  const buildWhatsAppUrl = () => {
    const businessNumber =
      process.env
        .NEXT_PUBLIC_BUSINESS_WHATSAPP;

    if (!businessNumber) return "";

    const message = [
      "Hello eKreativ Solutions,",
      "",
      "I have completed the AI Business Boost onboarding form.",
      "",
      `Business: ${
        form.businessName ||
        "Not provided"
      }`,
      `Main goal: ${
        form.mainGoals.length
          ? form.mainGoals.join(", ")
          : "Not provided"
      }`,
      `Video focus: ${
        form.videoFocus ||
        "Not provided"
      }`,
      `Preferred style: ${
        form.designStyle ||
        "Not provided"
      }`,
      "",
      submissionId
        ? `Submission ID: ${submissionId}`
        : "",
      "",
      "I’m ready to finalize my Business Boost package.",
    ]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/${businessNumber}?text=${encodeURIComponent(
      message
    )}`;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!form.businessName.trim()) {
      setError(
        "Business name is required."
      );
      return;
    }

    if (!form.whatsappNumber.trim()) {
      setError(
        "WhatsApp number is required."
      );
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      const body = new FormData();

      Object.entries(form).forEach(
        ([key, value]) => {
          if (key === "mainGoals") {
            body.append(
              key,
              JSON.stringify(value)
            );
            return;
          }

          body.append(
            key,
            String(value ?? "")
          );
        }
      );

      allFiles.forEach((file) => {
        body.append("files", file);
      });

      const response = await fetch(
        "/api/submit",
        {
          method: "POST",
          body,
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Your submission could not be completed."
        );
      }

      setSubmissionId(
        result?.submissionId || ""
      );

      setSubmitted(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      const businessNumber =
        process.env
          .NEXT_PUBLIC_BUSINESS_WHATSAPP;

      if (businessNumber) {
        setTimeout(() => {
          const message = [
            "Hello eKreativ Solutions,",
            "",
            "I have completed the AI Business Boost onboarding form.",
            "",
            `Business: ${form.businessName}`,
            `Main goal: ${
              form.mainGoals.length
                ? form.mainGoals.join(
                    ", "
                  )
                : "Not provided"
            }`,
            "",
            result?.submissionId
              ? `Submission ID: ${result.submissionId}`
              : "",
            "",
            "I’m ready to finalize my Business Boost package.",
          ]
            .filter(Boolean)
            .join("\n");

          window.location.href =
            `https://wa.me/${businessNumber}?text=${encodeURIComponent(
              message
            )}`;
        }, 2200);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <main className="onboarding-page submission-screen">
        <div className="submission-loader">
          <div className="loader-orbit">
            <span></span>
            <span></span>
            <span></span>

            <div className="loader-core">
              e
            </div>
          </div>

          <span className="submission-kicker">
            AI BUSINESS BOOST
          </span>

          <h1>
            Sending your brief...
          </h1>

          <p>
            We’re securely saving your
            business details and uploaded
            materials.
          </p>

          <div className="submission-progress">
            <span></span>
          </div>
        </div>
      </main>
    );
  }

  if (submitted) {
    const whatsappUrl =
      buildWhatsAppUrl();

    return (
      <main className="onboarding-page success-screen">
        <div className="success-particles">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <section className="success-card">
          <div className="success-check">
            <span>✓</span>
          </div>

          <span className="success-kicker">
            BRIEF RECEIVED
          </span>

          <h1>
            Your Business Boost is
            officially in motion.
          </h1>

          <p>
            Thanks,{" "}
            <strong>
              {form.businessName}
            </strong>
            . Your onboarding details have
            been received successfully.
          </p>

          {submissionId && (
            <div className="submission-reference">
              <span>Submission ID</span>
              <strong>
                {submissionId}
              </strong>
            </div>
          )}

          <div className="success-next">
            <span>01</span>

            <div>
              <strong>
                Continue on WhatsApp
              </strong>

              <p>
                We’ll finalize the project,
                confirm payment and answer
                any remaining questions.
              </p>
            </div>
          </div>

          {whatsappUrl ? (
            <a
              className="whatsapp-button"
              href={whatsappUrl}
            >
              Continue on WhatsApp
              <span>→</span>
            </a>
          ) : (
            <button
              type="button"
              className="whatsapp-button"
              onClick={() =>
                router.push("/")
              }
            >
              Return Home
              <span>→</span>
            </button>
          )}

          {whatsappUrl && (
            <small className="redirect-note">
              Opening WhatsApp
              automatically...
            </small>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="onboarding-page">
      <header className="onboarding-header">
        <div className="container onboarding-header-inner">
          <button
            className="onboarding-brand"
            onClick={() =>
              router.push("/")
            }
            type="button"
          >
            <span className="brand-mark">
              e
            </span>

            <span className="brand-copy">
              <strong>ekreativ</strong>
              <small>SOLUTIONS</small>
            </span>
          </button>

          <div className="onboarding-header-copy">
            <span>
              AI BUSINESS BOOST
            </span>

            <strong>
              Client Onboarding
            </strong>
          </div>
        </div>
      </header>

      <section className="onboarding-shell">
        <div className="container onboarding-layout">
          <aside className="onboarding-sidebar">
            <div className="sidebar-glow"></div>

            <div className="onboarding-sidebar-top">
              <span className="sidebar-label">
                YOUR PROGRESS
              </span>

              <h2>
                Let&apos;s build your
                <br />
                Business Boost.
              </h2>

              <p>
                Tell us about your business,
                goals and visual identity so
                we can create content with a
                clear purpose.
              </p>
            </div>

            <div className="onboarding-steps">
              {steps.map(
                (item, index) => (
                  <button
                    type="button"
                    key={item}
                    className={`step-item ${
                      index === step
                        ? "active"
                        : index < step
                        ? "completed"
                        : ""
                    }`}
                    onClick={() =>
                      goToCompletedStep(
                        index
                      )
                    }
                  >
                    <span>
                      {index < step
                        ? "✓"
                        : index + 1}
                    </span>

                    <div>
                      <small>
                        STEP{" "}
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </small>

                      <strong>
                        {item}
                      </strong>
                    </div>
                  </button>
                )
              )}
            </div>

            <div className="sidebar-offer">
              <span>
                COMPLETE PACKAGE
              </span>

              <strong>₦50,000</strong>

              <small>
                Delivered within 72 hours
              </small>
            </div>
          </aside>

          <section className="onboarding-content">
            <div className="mobile-progress">
              <div>
                <span>
                  Step {step + 1} of{" "}
                  {steps.length}
                </span>

                <strong>
                  {steps[step]}
                </strong>
              </div>

              <span>
                {Math.round(progress)}%
              </span>
            </div>

            <div className="progress-track">
              <span
                style={{
                  width: `${progress}%`,
                }}
              ></span>
            </div>

            <div className="form-panel">
              <div
                key={`${step}-${direction}`}
                className={`form-step ${
                  direction === "next"
                    ? "step-enter-next"
                    : "step-enter-back"
                }`}
              >
                {step === 0 && (
                  <>
                    <FormHeading
                      number="01"
                      label="ABOUT YOUR BUSINESS"
                      title="Tell us about your business."
                      description="Start with the basics. This helps us understand what you do and how to position your brand."
                    />

                    <div className="form-grid">
                      <Field
                        label="Business / Brand Name"
                        value={
                          form.businessName
                        }
                        onChange={(value) =>
                          updateField(
                            "businessName",
                            value
                          )
                        }
                        placeholder="e.g. Donato Foods"
                        required
                      />

                      <Field
                        label="Business Location"
                        value={
                          form.businessLocation
                        }
                        onChange={(value) =>
                          updateField(
                            "businessLocation",
                            value
                          )
                        }
                        placeholder="City / State / Country"
                      />

                      <TextArea
                        label="What does your business do?"
                        value={
                          form.businessDescription
                        }
                        onChange={(value) =>
                          updateField(
                            "businessDescription",
                            value
                          )
                        }
                        placeholder="Briefly describe your business"
                        full
                      />

                      <TextArea
                        label="What products or services do you offer?"
                        value={
                          form.services
                        }
                        onChange={(value) =>
                          updateField(
                            "services",
                            value
                          )
                        }
                        placeholder="List your main products or services"
                        full
                      />

                      <TextArea
                        label="What makes your business different?"
                        value={
                          form.difference
                        }
                        onChange={(value) =>
                          updateField(
                            "difference",
                            value
                          )
                        }
                        placeholder="What makes customers choose you?"
                        full
                      />

                      <Field
                        label="Social Media Handles"
                        value={
                          form.socialHandles
                        }
                        onChange={(value) =>
                          updateField(
                            "socialHandles",
                            value
                          )
                        }
                        placeholder="@yourbusiness"
                      />

                      <Field
                        label="WhatsApp / Phone Number"
                        value={
                          form.whatsappNumber
                        }
                        onChange={(value) =>
                          updateField(
                            "whatsappNumber",
                            value
                          )
                        }
                        placeholder="+234..."
                        required
                      />

                      <Field
                        label="Website"
                        value={form.website}
                        onChange={(value) =>
                          updateField(
                            "website",
                            value
                          )
                        }
                        placeholder="https://..."
                      />
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <FormHeading
                      number="02"
                      label="YOUR IDEAL CUSTOMER"
                      title="Who are you trying to reach?"
                      description="Tell us briefly about the people most likely to buy from your business."
                    />

                    <div className="form-grid">
                      <Field
                        label="Age Range"
                        value={
                          form.customerAge
                        }
                        onChange={(value) =>
                          updateField(
                            "customerAge",
                            value
                          )
                        }
                        placeholder="e.g. 25–45"
                      />

                      <Field
                        label="Gender"
                        value={
                          form.customerGender
                        }
                        onChange={(value) =>
                          updateField(
                            "customerGender",
                            value
                          )
                        }
                        placeholder="All / Male / Female"
                      />

                      <Field
                        label="Location"
                        value={
                          form.customerLocation
                        }
                        onChange={(value) =>
                          updateField(
                            "customerLocation",
                            value
                          )
                        }
                        placeholder="Where are your customers?"
                        full
                      />

                      <TextArea
                        label="What problem do they have that your business solves?"
                        value={
                          form.customerProblem
                        }
                        onChange={(value) =>
                          updateField(
                            "customerProblem",
                            value
                          )
                        }
                        placeholder="Describe their problem or need"
                        full
                      />

                      <TextArea
                        label="What usually makes them choose a business like yours?"
                        value={
                          form.customerDecision
                        }
                        onChange={(value) =>
                          updateField(
                            "customerDecision",
                            value
                          )
                        }
                        placeholder="Trust, price, quality, convenience, speed..."
                        full
                      />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <FormHeading
                      number="03"
                      label="YOUR MAIN GOAL"
                      title="What should this content help you achieve?"
                      description="Choose every goal that applies to your business."
                    />

                    <div className="goal-grid">
                      {goals.map(
                        (goal, index) => (
                          <button
                            type="button"
                            key={goal}
                            style={{
                              animationDelay: `${
                                index * 60
                              }ms`,
                            }}
                            className={`goal-card ${
                              form.mainGoals.includes(
                                goal
                              )
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              toggleGoal(
                                goal
                              )
                            }
                          >
                            <span>
                              {form.mainGoals.includes(
                                goal
                              )
                                ? "✓"
                                : "+"}
                            </span>

                            <strong>
                              {goal}
                            </strong>
                          </button>
                        )
                      )}
                    </div>

                    <div className="single-field">
                      <TextArea
                        label="What is the ONE thing you want people to do after seeing your content?"
                        value={
                          form.primaryAction
                        }
                        onChange={(value) =>
                          updateField(
                            "primaryAction",
                            value
                          )
                        }
                        placeholder="e.g. Send us a WhatsApp message and place an order"
                        full
                      />
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <FormHeading
                      number="04"
                      label="YOUR PROMOTIONAL VIDEO"
                      title="What should your promotional video communicate?"
                      description="Give us the direction. We'll turn it into a strong promotional concept."
                    />

                    <div className="form-grid">
                      <TextArea
                        label="What product or service should the video focus on?"
                        value={
                          form.videoFocus
                        }
                        onChange={(value) =>
                          updateField(
                            "videoFocus",
                            value
                          )
                        }
                        placeholder="Tell us what you want to promote"
                        full
                      />

                      <TextArea
                        label="What key message should people remember?"
                        value={
                          form.keyMessage
                        }
                        onChange={(value) =>
                          updateField(
                            "keyMessage",
                            value
                          )
                        }
                        placeholder="The main idea your audience should remember"
                        full
                      />

                      <TextArea
                        label="What offer or promotion should be featured?"
                        value={form.offer}
                        onChange={(value) =>
                          updateField(
                            "offer",
                            value
                          )
                        }
                        placeholder="Discount, launch offer, special package..."
                        full
                      />

                      <Field
                        label="Call-to-action"
                        value={
                          form.videoCTA
                        }
                        onChange={(value) =>
                          updateField(
                            "videoCTA",
                            value
                          )
                        }
                        placeholder="e.g. Send us a WhatsApp message"
                        full
                      />
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <FormHeading
                      number="05"
                      label="YOUR VISUAL BRAND"
                      title="Help us understand your visual identity."
                      description="Upload the materials we'll use to make your Business Boost feel like your brand."
                    />

                    <div className="form-grid">
                      <SelectField
                        label="Do you have a brand logo?"
                        value={
                          form.hasLogo
                        }
                        onChange={(value) =>
                          updateField(
                            "hasLogo",
                            value
                          )
                        }
                        options={[
                          "Yes",
                          "No",
                        ]}
                      />

                      <SelectField
                        label="Do you have established brand colours?"
                        value={
                          form.hasBrandColours
                        }
                        onChange={(value) =>
                          updateField(
                            "hasBrandColours",
                            value
                          )
                        }
                        options={[
                          "Yes",
                          "No",
                        ]}
                      />

                      <Field
                        label="Brand Colours"
                        value={
                          form.brandColours
                        }
                        onChange={(value) =>
                          updateField(
                            "brandColours",
                            value
                          )
                        }
                        placeholder="e.g. Navy blue, gold and white"
                      />

                      <Field
                        label="Brand Fonts"
                        value={
                          form.brandFonts
                        }
                        onChange={(value) =>
                          updateField(
                            "brandFonts",
                            value
                          )
                        }
                        placeholder="If known"
                      />

                      <SelectField
                        label="Preferred Design Style"
                        value={
                          form.designStyle
                        }
                        onChange={(value) =>
                          updateField(
                            "designStyle",
                            value
                          )
                        }
                        options={[
                          "Modern",
                          "Luxury",
                          "Minimal",
                          "Bold",
                          "Corporate",
                          "Vibrant",
                          "Elegant",
                        ]}
                        full
                      />
                    </div>

                    <div className="upload-section">
                      <div className="upload-heading">
                        <span>
                          CONTENT MATERIALS
                        </span>

                        <h3>
                          Add your brand
                          assets.
                        </h3>

                        <p>
                          Maximum 15MB per
                          file.
                        </p>
                      </div>

                      <div className="upload-grid">
                        <UploadBox
                          title="Logo"
                          description="PNG, JPG, SVG or WEBP"
                          files={
                            uploads.logo
                          }
                          accept="image/*,.svg"
                          onChange={(
                            event
                          ) =>
                            handleFiles(
                              "logo",
                              event
                            )
                          }
                          onRemove={(
                            index
                          ) =>
                            removeFile(
                              "logo",
                              index
                            )
                          }
                        />

                        <UploadBox
                          title="Product / Service Photos"
                          description="Upload multiple images"
                          files={
                            uploads.photos
                          }
                          accept="image/*"
                          multiple
                          onChange={(
                            event
                          ) =>
                            handleFiles(
                              "photos",
                              event
                            )
                          }
                          onRemove={(
                            index
                          ) =>
                            removeFile(
                              "photos",
                              index
                            )
                          }
                        />

                        <UploadBox
                          title="Existing Videos"
                          description="Promotional or product clips"
                          files={
                            uploads.videos
                          }
                          accept="video/*"
                          multiple
                          onChange={(
                            event
                          ) =>
                            handleFiles(
                              "videos",
                              event
                            )
                          }
                          onRemove={(
                            index
                          ) =>
                            removeFile(
                              "videos",
                              index
                            )
                          }
                        />

                        <UploadBox
                          title="Catalogue / Menu / Price List"
                          description="PDF or image files"
                          files={
                            uploads.catalogue
                          }
                          accept="application/pdf,image/*"
                          multiple
                          onChange={(
                            event
                          ) =>
                            handleFiles(
                              "catalogue",
                              event
                            )
                          }
                          onRemove={(
                            index
                          ) =>
                            removeFile(
                              "catalogue",
                              index
                            )
                          }
                        />

                        <UploadBox
                          title="Previous Designs"
                          description="Anything you'd like us to reference"
                          files={
                            uploads.references
                          }
                          accept="image/*,application/pdf"
                          multiple
                          full
                          onChange={(
                            event
                          ) =>
                            handleFiles(
                              "references",
                              event
                            )
                          }
                          onRemove={(
                            index
                          ) =>
                            removeFile(
                              "references",
                              index
                            )
                          }
                        />
                      </div>
                    </div>
                  </>
                )}

                {step === 5 && (
                  <>
                    <FormHeading
                      number="06"
                      label="YOUR FIVE SOCIAL MEDIA DESIGNS"
                      title="What should the five designs promote?"
                      description="You can leave any field blank and allow us to recommend the best content angle."
                    />

                    <div className="design-list">
                      {[
                        "design1",
                        "design2",
                        "design3",
                        "design4",
                        "design5",
                      ].map(
                        (
                          field,
                          index
                        ) => (
                          <TextArea
                            key={field}
                            label={`Design ${
                              index + 1
                            }`}
                            value={
                              form[
                                field as keyof FormDataState
                              ] as string
                            }
                            onChange={(
                              value
                            ) =>
                              updateField(
                                field as keyof FormDataState,
                                value
                              )
                            }
                            placeholder={
                              index === 0
                                ? "Product, service, offer, announcement or educational content..."
                                : "Optional — or let us recommend an angle"
                            }
                            full
                          />
                        )
                      )}
                    </div>
                  </>
                )}

                {step === 6 && (
                  <>
                    <FormHeading
                      number="07"
                      label="WHATSAPP STATUS AD"
                      title="Let's plan your WhatsApp flyer."
                      description="Tell us what should be promoted and what action viewers should take."
                    />

                    <div className="form-grid">
                      <TextArea
                        label="What should the WhatsApp Status flyer promote?"
                        value={
                          form.whatsappAdFocus
                        }
                        onChange={(value) =>
                          updateField(
                            "whatsappAdFocus",
                            value
                          )
                        }
                        placeholder="Product, service, offer..."
                        full
                      />

                      <TextArea
                        label="What information must appear on it?"
                        value={
                          form.whatsappAdInfo
                        }
                        onChange={(value) =>
                          updateField(
                            "whatsappAdInfo",
                            value
                          )
                        }
                        placeholder="Price, phone number, address, offer..."
                        full
                      />

                      <Field
                        label="What action should people take?"
                        value={
                          form.whatsappAdAction
                        }
                        onChange={(value) =>
                          updateField(
                            "whatsappAdAction",
                            value
                          )
                        }
                        placeholder="e.g. Order now"
                        full
                      />
                    </div>
                  </>
                )}

                {step === 7 && (
                  <>
                    <FormHeading
                      number="08"
                      label="MARKETING COPIES"
                      title="What should your marketing captions focus on?"
                      description="You can leave these blank and allow us to recommend the strongest marketing angles."
                    />

                    <div className="design-list">
                      <TextArea
                        label="Copy 1"
                        value={form.copy1}
                        onChange={(value) =>
                          updateField(
                            "copy1",
                            value
                          )
                        }
                        placeholder="What should this caption focus on?"
                        full
                      />

                      <TextArea
                        label="Copy 2"
                        value={form.copy2}
                        onChange={(value) =>
                          updateField(
                            "copy2",
                            value
                          )
                        }
                        placeholder="Optional"
                        full
                      />

                      <TextArea
                        label="Copy 3"
                        value={form.copy3}
                        onChange={(value) =>
                          updateField(
                            "copy3",
                            value
                          )
                        }
                        placeholder="Optional"
                        full
                      />

                      <TextArea
                        label="Anything you DON'T want included?"
                        value={
                          form.exclusions
                        }
                        onChange={(value) =>
                          updateField(
                            "exclusions",
                            value
                          )
                        }
                        placeholder="Optional"
                        full
                      />

                      <TextArea
                        label="Anything else we should know?"
                        value={
                          form.extraNotes
                        }
                        onChange={(value) =>
                          updateField(
                            "extraNotes",
                            value
                          )
                        }
                        placeholder="Final notes"
                        full
                      />
                    </div>
                  </>
                )}

                {step === 8 && (
                  <>
                    <FormHeading
                      number="09"
                      label="REVIEW"
                      title="Your Business Boost brief is ready."
                      description="Check the important details before you send your brief to us."
                    />

                    <div className="review-grid">
                      <ReviewCard
                        title="Business"
                        items={[
                          [
                            "Business Name",
                            form.businessName,
                          ],
                          [
                            "Location",
                            form.businessLocation,
                          ],
                          [
                            "WhatsApp",
                            form.whatsappNumber,
                          ],
                          [
                            "Website",
                            form.website,
                          ],
                        ]}
                      />

                      <ReviewCard
                        title="Audience"
                        items={[
                          [
                            "Age Range",
                            form.customerAge,
                          ],
                          [
                            "Gender",
                            form.customerGender,
                          ],
                          [
                            "Location",
                            form.customerLocation,
                          ],
                          [
                            "Customer Problem",
                            form.customerProblem,
                          ],
                        ]}
                      />

                      <ReviewCard
                        title="Campaign Goal"
                        items={[
                          [
                            "Goals",
                            form.mainGoals
                              .length
                              ? form.mainGoals.join(
                                  ", "
                                )
                              : "",
                          ],
                          [
                            "Main Action",
                            form.primaryAction,
                          ],
                          [
                            "Video Focus",
                            form.videoFocus,
                          ],
                        ]}
                      />

                      <ReviewCard
                        title="Brand"
                        items={[
                          [
                            "Design Style",
                            form.designStyle,
                          ],
                          [
                            "Brand Colours",
                            form.brandColours,
                          ],
                          [
                            "Files",
                            `${allFiles.length} uploaded`,
                          ],
                        ]}
                      />
                    </div>

                    <div className="review-package">
                      <span>
                        YOUR PACKAGE
                      </span>

                      <div>
                        <strong>
                          ₦50,000
                        </strong>

                        <small>
                          Complete AI
                          Business Boost
                        </small>
                      </div>

                      <ul>
                        <li>
                          ✓ AI promotional
                          video
                        </li>

                        <li>
                          ✓ 5 social media
                          designs
                        </li>

                        <li>
                          ✓ WhatsApp status
                          ad
                        </li>

                        <li>
                          ✓ 3 marketing
                          copies
                        </li>
                      </ul>
                    </div>

                    <div className="submission-note">
                      <span>✓</span>

                      <div>
                        <strong>
                          What happens after
                          you submit?
                        </strong>

                        <p>
                          Your complete brief
                          is stored, our team
                          receives your
                          submission, and
                          you&apos;ll continue
                          on WhatsApp to
                          finalize the deal.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {error && (
                  <div className="form-error">
                    <span>!</span>
                    <p>{error}</p>
                  </div>
                )}
              </div>

              <div className="form-navigation">
                <button
                  type="button"
                  className="back-button"
                  onClick={
                    previousStep
                  }
                  disabled={step === 0}
                >
                  ← Back
                </button>

                <div className="navigation-step">
                  <span>
                    {step + 1}
                  </span>
                  /{steps.length}
                </div>

                {step <
                steps.length - 1 ? (
                  <button
                    type="button"
                    className="continue-button"
                    onClick={nextStep}
                  >
                    Continue
                    <span>→</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="continue-button submit-button"
                    onClick={
                      handleSubmit
                    }
                  >
                    Submit My Brief
                    <span>→</span>
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function FormHeading({
  number,
  label,
  title,
  description,
}: {
  number: string;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="form-heading">
      <span>
        {number} — {label}
      </span>

      <h1>{title}</h1>

      <p>{description}</p>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  full?: boolean;
  required?: boolean;
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  full = false,
  required = false,
}: FieldProps) {
  return (
    <label
      className={`field ${
        full ? "field-full" : ""
      }`}
    >
      <span>
        {label}

        {required && (
          <strong className="required-star">
            *
          </strong>
        )}
      </span>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  full = false,
}: FieldProps) {
  return (
    <label
      className={`field ${
        full ? "field-full" : ""
      }`}
    >
      <span>{label}</span>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={4}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  full = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  full?: boolean;
}) {
  return (
    <label
      className={`field ${
        full ? "field-full" : ""
      }`}
    >
      <span>{label}</span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        <option value="">
          Select an option
        </option>

        {options.map((option) => (
          <option
            value={option}
            key={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function UploadBox({
  title,
  description,
  files,
  accept,
  multiple = false,
  full = false,
  onChange,
  onRemove,
}: {
  title: string;
  description: string;
  files: File[];
  accept: string;
  multiple?: boolean;
  full?: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div
      className={`upload-box ${
        full ? "upload-box-full" : ""
      }`}
    >
      <label className="upload-dropzone">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onChange}
        />

        <div className="upload-icon">
          ↑
        </div>

        <strong>{title}</strong>
        <p>{description}</p>

        <span>
          Choose file
          {multiple ? "s" : ""}
        </span>
      </label>

      {files.length > 0 && (
        <div className="uploaded-file-list">
          {files.map(
            (file, index) => (
              <div
                className="uploaded-file"
                key={`${file.name}-${index}`}
              >
                <span className="file-type">
                  {getFileLabel(
                    file
                  )}
                </span>

                <div>
                  <strong>
                    {file.name}
                  </strong>

                  <small>
                    {formatFileSize(
                      file.size
                    )}
                  </small>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onRemove(index)
                  }
                  aria-label={`Remove ${file.name}`}
                >
                  ×
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

function ReviewCard({
  title,
  items,
}: {
  title: string;
  items: [string, string][];
}) {
  return (
    <article className="review-card">
      <span>{title}</span>

      {items.map(
        ([label, value]) => (
          <div key={label}>
            <small>
              {label}
            </small>

            <strong>
              {value ||
                "Not provided"}
            </strong>
          </div>
        )
      )}
    </article>
  );
}

function formatFileSize(
  bytes: number
) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

function getFileLabel(file: File) {
  if (
    file.type.startsWith("image/")
  ) {
    return "IMG";
  }

  if (
    file.type.startsWith("video/")
  ) {
    return "VID";
  }

  if (
    file.type === "application/pdf"
  ) {
    return "PDF";
  }

  return "FILE";
}