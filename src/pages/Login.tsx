import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import collegeIllustration from "@/assets/college-illustration.png";

const Login = () => {
  const navigate = useNavigate();
  const [htNo, setHtNo] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-12" size="lg">
                Sign in
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary items-stretch p-1 relative overflow-hidden">
        <div className="w-full h-full z-10 flex items-center justify-center">
          <img
            src={collegeIllustration}
            alt="College Education"
            className="w-auto h-auto object-cover drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;