"use client";

import { FormEvent, useState } from "react";

export default function AccessCodesAdminPage() {
  const [adminCode, setAdminCode] = useState("");
  const [clientLabel, setClientLabel] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setGeneratedCode("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/access-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminCode, clientLabel }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Could not generate access code.");
        return;
      }

      setGeneratedCode(result.code);
      setClientLabel("");
    } catch {
      setError("Could not generate an access code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyCode() {
    if (!generatedCode) return;
    await navigator.clipboard.writeText(generatedCode);
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
          width: "min(100%, 520px)",
          padding: "34px",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,.12)",
          background: "rgba(255,255,255,.07)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 30px 80px rgba(0,0,0,.28)",
        }}
      >
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
          EKREATIV ADMIN
        </span>

        <h1 style={{ fontSize: "clamp(30px, 7vw, 42px)", lineHeight: 1.05, marginBottom: "14px" }}>
          Create a client access code.
        </h1>

        <p style={{ marginBottom: "26px", color: "rgba(255,255,255,.68)", lineHeight: 1.7 }}>
          Generate one unique code for each paid client. Once a code is used successfully, it cannot be activated by another person.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: "9px", fontSize: "13px", fontWeight: 800 }}>
            Admin code
          </label>
          <input
            type="password"
            value={adminCode}
            onChange={(event) => setAdminCode(event.target.value)}
            placeholder="Enter admin code"
            required
            style={inputStyle}
          />

          <label style={{ display: "block", margin: "18px 0 9px", fontSize: "13px", fontWeight: 800 }}>
            Client name or label
          </label>
          <input
            type="text"
            value={clientLabel}
            onChange={(event) => setClientLabel(event.target.value)}
            placeholder="e.g. Ada Fashion Store"
            required
            style={inputStyle}
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
            {loading ? "Generating..." : "Generate Unique Code"}
          </button>
        </form>

        {generatedCode ? (
          <div
            style={{
              marginTop: "24px",
              padding: "18px",
              borderRadius: "16px",
              border: "1px solid rgba(255,213,31,.35)",
              background: "rgba(255,213,31,.08)",
            }}
          >
            <small style={{ display: "block", marginBottom: "8px", opacity: 0.62 }}>
              Send this code to the paid client
            </small>
            <strong style={{ display: "block", fontSize: "24px", letterSpacing: "1px" }}>
              {generatedCode}
            </strong>
            <button
              type="button"
              onClick={copyCode}
              style={{
                marginTop: "14px",
                padding: "10px 14px",
                borderRadius: "10px",
                background: "rgba(255,255,255,.12)",
                color: "white",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Copy code
            </button>
          </div>
        ) : null}

        <p style={{ marginTop: "18px", color: "rgba(255,255,255,.48)", fontSize: "12px", lineHeight: 1.6 }}>
          Codes expire after 7 days if unused. After first successful activation, the client keeps access on that browser for 24 hours.
        </p>
      </section>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "54px",
  padding: "0 16px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,.16)",
  outline: "none",
  background: "rgba(255,255,255,.08)",
  color: "white",
};
