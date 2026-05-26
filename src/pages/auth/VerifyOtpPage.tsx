import { useRef, useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { verifyOtp, resendOtp } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../utils/apiClient";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const email = searchParams.get("email") ?? "";
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [resendMsg, setResendMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputs.current[5]?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < 6) {
      setError("Enter the full 6-digit code.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { user, token } = await verifyOtp(email, otp);
      setAuth(user, token);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setResendMsg("");
    try {
      await resendOtp(email);
      setResendMsg("A new OTP has been sent to your email.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not resend OTP.");
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-sm border border-border p-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Check your email
        </h1>
        <p className="text-sm text-muted mb-6">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-11 h-12 text-center text-xl font-semibold border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            ))}
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
          {resendMsg && (
            <p className="text-sm text-success text-center">{resendMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:opacity-90 disabled:opacity-60 text-primary-foreground font-medium py-2 rounded-lg transition-colors"
          >
            {loading ? "Verifying…" : "Verify email"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-muted space-y-2">
          <p>
            Didn't receive it?{" "}
            <button
              onClick={handleResend}
              className="text-primary hover:underline"
            >
              Resend OTP
            </button>
          </p>
          <p>
            <Link to="/login" className="text-primary hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
