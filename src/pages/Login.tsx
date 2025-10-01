import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";
import collegeIllustration from "@/assets/college-illustration.png";

const Login = () => {
  const navigate = useNavigate();
  const [htNo, setHtNo] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, any credentials will work
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Title */}
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="h-10 w-10 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              Vasavi College of Engineering
            </h1>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Welcome back
              </h2>
              <p className="text-muted-foreground">Please enter your details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="htno" className="text-base">Hall Ticket No.</Label>
                <Input
                  id="htno"
                  type="text"
                  placeholder="Enter your Hall Ticket Number"
                  value={htNo}
                  onChange={(e) => setHtNo(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Remember for 30 days
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Forgot password
                </button>
              </div>

              <Button type="submit" className="w-full h-12" size="lg">
                Sign in
              </Button>
            </form>

            <div className="text-center pt-4">
              <span className="text-sm text-muted-foreground">
                Don't have an account?{" "}
              </span>
              <button
                type="button"
                className="text-sm text-primary hover:underline font-medium"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary items-center justify-center p-12 relative overflow-hidden">
        <div className="max-w-lg z-10">
          <img
            src={collegeIllustration}
            alt="College Education"
            className="w-full h-auto drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
