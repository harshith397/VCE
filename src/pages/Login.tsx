import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Eye, EyeOff, AlertTriangle } from "lucide-react";
import collegeIllustration from "@/assets/college-illustration.png";
import { useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/config/api";

const fetchDashboard = async (sessionId: string) => {
  const res = await fetch(`${API_URL}/dashboard`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  });
  const data = await res.json();
  if (!res.ok || !data.dashboardData) {
    throw new Error(data.message || "Failed to load dashboard");
  }
  return data.dashboardData;
};

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [htNo, setHtNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaImage, setCaptchaImage] = useState<string | null>(null);
  const [captchaValue, setCaptchaValue] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(true);
  const [initError, setInitError] = useState("");

  // Add timeout ref to prevent infinite loading
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch captcha with timeout
  const loadCaptcha = async () => {
    try {
      setCaptchaLoading(true);
      setInitError("");
      setCaptchaImage(null);

      // Clear any existing timeout
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }

      // Set a timeout for the entire captcha load operation
      loadTimeoutRef.current = setTimeout(() => {
        setCaptchaLoading(false);
        setInitError("Captcha loading timed out. Please try again.");
      }, 10000); // 10 second timeout

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

  const res = await fetch(`${API_URL}/captcha`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error("Failed to fetch captcha");

      const data = await res.json();
      if (data.captcha_image && data.session_id) {
        // Pre-load the image before setting state
        const img = new Image();
        
        img.onload = () => {
          if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
          }
          setCaptchaImage(data.captcha_image);
          setSessionId(data.session_id);
          localStorage.setItem("session_id", data.session_id);
          setCaptchaValue("");
          setCaptchaLoading(false);
        };

        img.onerror = () => {
          if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
          }
          setInitError("Failed to load captcha image");
          setCaptchaLoading(false);
        };

        // Set src to trigger loading
        img.src = data.captcha_image;

      } else {
        throw new Error("Captcha data invalid");
      }
    } catch (err: any) {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      console.error("Captcha load error:", err);
      if (err.name === 'AbortError') {
        setInitError("Request timed out. Please check your connection.");
      } else {
        setInitError(err.message || "Failed to load captcha");
      }
      setCaptchaLoading(false);
    }
  };

  useEffect(() => {
    loadCaptcha();
    
    // Cleanup timeout on unmount
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, []);

  // Handle login submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) {
      alert("Captcha session unavailable. Please refresh.");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
  const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: htNo,
          password,
          captcha: captchaValue,
          session_id: sessionId,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        navigate("/dashboard");
      } else {
        setLoading(false);
        alert(data.message || "Login failed. Please try again.");
        loadCaptcha();
        setCaptchaValue("");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoading(false);
      alert("Server error. Please try again later.");
      loadCaptcha();
    }
  };

  if (initError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="max-w-md text-center p-8 rounded-2xl shadow-lg border">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
          <p className="text-muted-foreground mb-4">{initError}</p>
          <Button onClick={loadCaptcha}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 login-card p-8">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="h-10 w-10 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              Vasavi College of Engineering
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="htno">Hall Ticket No.</Label>
              <Input
                id="htno"
                type="text"
                value={htNo}
                onChange={(e) => setHtNo(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="px-3 py-2 border rounded text-sm bg-muted-foreground/5"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
            <div>
              <Label>Captcha</Label>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="w-48 border rounded p-2 bg-white flex items-center justify-center relative min-h-[80px]">
                    {captchaLoading ? (
                      <div className="flex items-center justify-center">
                        <Spinner size="lg" />
                      </div>
                    ) : captchaImage ? (
                      <img
                        src={captchaImage}
                        alt="captcha"
                        className="max-h-20 max-w-full"
                        style={{ display: 'block' }}
                      />
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No captcha
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      type="button"
                      onClick={loadCaptcha}
                      className="h-10 px-4"
                      disabled={captchaLoading}
                    >
                      {captchaLoading ? (
                        <span className="flex items-center gap-2 text-sm">
                          <Spinner size="sm" />
                          Refreshing
                        </span>
                      ) : (
                        "Refresh"
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="Enter captcha"
                    value={captchaValue}
                    onChange={(e) => setCaptchaValue(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              disabled={
                loading || captchaLoading || !htNo.trim() || !password.trim() || !captchaValue.trim()
              }
              className="w-full"
            >
              {loading ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="sm" />
                    loging in...
                  </span>
                ) : (
                  "Login"
                )}
            </Button>
          </form>
        </div>
      </div>
      <div className="hidden lg:flex lg:w-1/2 bg-secondary p-1">
        <img src={collegeIllustration} alt="Illustration" />
      </div>
    </div>
  );
};

export default Login;