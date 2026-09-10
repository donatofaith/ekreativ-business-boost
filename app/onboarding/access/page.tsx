"use client";

import { FormEvent, useState } from "react";

export default function OnboardingAccessPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/onboarding-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Invalid access code.");
        return;
      }

      window.location.href = "/onboarding";
    } catch {
      setError("We could not verify your code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background:
          "radial-gradient(circle at 75% 20%, rgba(8,117,245,.18), transparent 28%), linear-gradient(135deg, #04152f 0%, #06265d 50%, #081a3c 100%)",
        color: "white",
      }}
    >
      <section
        style={{
          width: "min(100%, 460px)",
          padding: "34px",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,.12)",
          background: "rgba(255,255,255,.07)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 30px 80px rgba(0,0,0,.28)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "26px" }}>
          <span
            style={{
              width: "42px",
              height: "42px",
              display: "grid",
              placeItems: "center",
              borderRadius: "13px",
              background: "linear-gradient(145deg, #27a5ff, #0875f5)",
              fontSize: "28px",
              fontWeight: 900,
              fontStyle: "italic",
            }}
          >
            e
          </span>
          <div>
            <strong style={{ display: "block", fontSize: "20px" }}>ekreativ</strong>
            <span style={{ fontSize: "9px", letterSpacing: "3px", opacity: 0.65 }}>SOLUTIONS</span>
          </div>
        </div>

        <span
          style={{
            display: "inline-block",
            marginBottom: "12px",
            color: "#8fc3ff",
            fontSize: "11px",
            fontWeight: 900,
            letterSpacing: "2px",
          }}
        >
          CLIENT ONBOARDING
        </span>

        <h1 style={{ fontSize: "clamp(30px, 7vw, 42px)", lineHeight: 1.05, marginBottom: "14px" }}>
          Enter your access code.
        </h1>

        <p style={{ marginBottom: "26px", color: "rgba(255,255,255,.68)", lineHeight: 1.7 }}>
          This onboarding form is reserved for confirmed Business Boost clients. Use the code sent to you after payment.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="access-code" style={{ display: "block", marginBottom: "9px", fontSize: "13px", fontWeight: 800 }}>
            Access code
          </label>

          <input
            id="access-code"
            type="password"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Enter client access code"
            autoComplete="one-time-code"
            required
            style={{
              width: "100%",
              minHeight: "54px",
              padding: "0 16px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,.16)",
              outline: "none",
              background: "rgba(255,255,255,.08)",
              color: "white",
            }}
          />

          {error ? (
            <p style={{ marginTop: "12px", color: "#ffb4b4", fontSize: "13px", lineHeight: 1.5 }}>{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              minHeight: "54px",
              marginTop: "18px",
              borderRadius: "12px",
              background: "#ffd51f",
              color: "#061b40",
              fontWeight: 900,
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Checking access..." : "Continue to Onboarding →"}
          </button>
        </form>

        <p style={{ marginTop: "18px", textAlign: "center", color: "rgba(255,255,255,.48)", fontSize: "12px" }}>
          Need access? Contact eKreativ Solutions through the payment conversation.
        </p>
      </section>
    </main>
  );
}
