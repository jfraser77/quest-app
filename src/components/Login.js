import React, { useState } from "react";

export default function Login({ signIn }) {
  const [email,   setEmail]   = useState("");
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email.trim());
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
    }}>
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        padding: "40px 36px",
        width: "100%",
        maxWidth: 380,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚔️</div>
        <div style={{
          fontFamily: "'Urbanist', sans-serif",
          fontSize: 24,
          fontWeight: 800,
          color: "var(--text1)",
          marginBottom: 6,
        }}>
          Quest Board
        </div>
        <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 28 }}>
          Enter your email to receive a magic login link
        </div>

        {sent ? (
          <div style={{
            background: "var(--card-d)",
            border: "1px solid #90e8b0",
            borderRadius: 12,
            padding: "16px 18px",
            color: "#18905a",
            fontSize: 14,
            fontWeight: 600,
          }}>
            ✉️ Check your inbox!<br />
            <span style={{ fontWeight: 400, color: "var(--text2)" }}>
              A magic link was sent to <strong>{email}</strong>
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--surface2)",
                color: "var(--text1)",
                fontSize: 14,
                marginBottom: 12,
                boxSizing: "border-box",
                outline: "none",
              }}
            />
            {error && (
              <div style={{ color: "#e05050", fontSize: 12, marginBottom: 10 }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-full"
              style={{ padding: "11px 0", fontSize: 14 }}
            >
              {loading ? "Sending…" : "Send Magic Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
