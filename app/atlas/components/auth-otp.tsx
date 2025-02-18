import { Image } from "@webstudio-is/sdk-components-react";
import { Form } from "react-router";

export type ActionData = {
  success?: boolean;
  message?: string;
  sessionId?: string;
} | undefined;

export function AuthOTP({ actionData }: { actionData: ActionData }) {
  return (
    <section
      style={{
        maxHeight: "100svh",
        height: "100svh",
        overflow: "hidden",
        margin: "-8px",
      }}
    >
      <Form
        method="post"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2.5rem",
            padding: "2rem",
            backgroundColor: "#0A0A0A",
          }}
        >
          <Image
            src={"/assets/logo_K8oPhIZdT21u2JNqOVJST.jpg"}
            width={500}
            height={500}
            style={{ width: "250px", height: "auto" }}
          />

          {/* Phone Number Section */}
          <div style={{ width: "100%", maxWidth: "36rem" }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                }}
              >
                Enter Your Phone Number
              </h1>
              <p style={{ color: "#666" }}>
                We'll send you a one-time password (OTP) to verify your phone
                number.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <input
                type="tel"
                name="phone"
                required
                placeholder="Enter a phone number"
                style={{
                  width: "100%",
                  padding: "0.75rem 0rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.375rem",
                  fontSize: "1rem",
                }}
              />
              <div style={{ display: "flex", gap: "0.5rem", flexDirection: "row-reverse" }}>

              <button
                style={{
                  width: "100%",
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "var(--brand-500)",
                  color: "black",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                }}
                >
                Get Code →
              </button>
                <a
                  href="/"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    border: "none",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  >
                  Restart Form 🔄
                </a>
                </div>
            </div>
          </div>

          {/* OTP Section */}
          <div style={{ width: "100%", maxWidth: "36rem" }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                }}
              >
                Enter OTP Code
              </h1>
              <p style={{ color: "#666" }}>
                Enter the 6-digit code we sent to your phone, and enter your
                phone number again.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <input
                type="text"
                name={"otp"}
                placeholder="Enter OTP code"
                maxLength={6}
                style={{
                  width: "100%",
                  padding: "0.75rem 0rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.375rem",
                  fontSize: "1rem",
                }}
              />
              <button
                style={{
                  width: "100%",
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "var(--brand-500)",
                  color: "black",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                }}
              >
                Verify Code →
              </button>
            </div>
          </div>
          {actionData?.message && (
            <div
              style={{
                padding: "0.75rem",
                borderRadius: "0.375rem",
                backgroundColor: actionData.success ? "#f0fdf4" : "#fef2f2",
                color: actionData.success ? "#166534" : "#991b1b",
              }}
            >
              {actionData.message}
            </div>
          )}
        </div>
      </Form>
    </section>
  );
}