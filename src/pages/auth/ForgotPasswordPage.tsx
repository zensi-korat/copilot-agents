import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../utils/apiClient";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      // API always returns success — navigate regardless
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-sm border border-border p-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Forgot password
        </h1>
        <p className="text-sm text-muted mb-6">
          Enter your email and we'll send you a reset code.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="you@example.com"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:opacity-90 disabled:opacity-60 text-primary-foreground font-medium py-2 rounded-lg transition-colors"
          >
            {loading ? "Sending…" : "Send reset code"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          <Link to="/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
