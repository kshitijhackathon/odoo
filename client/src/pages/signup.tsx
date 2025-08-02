import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Building, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToastNotifications } from "@/hooks/use-toast-notifications";
import { useForm } from "react-hook-form";

interface SignupFormData {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function Signup() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToastNotifications();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormData>();

  const password = watch("password");

  const onSubmit = (data: SignupFormData) => {
    // Mock signup logic
    console.log("Signup attempt:", data);
    toast().success("Account created successfully!", "Welcome to CivicTrack. Please verify your email.", 4000);
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-civic-blue rounded-lg flex items-center justify-center">
              <Building className="text-white text-sm" />
            </div>
            <span className="text-xl font-bold text-foreground">CivicTrack</span>
          </Link>
          <Link href="/">
            <Button 
              variant="outline" 
              className="bg-civic-emerald text-white border-civic-emerald hover:bg-civic-emerald/90 px-6"
            >
              Home
            </Button>
          </Link>
        </div>

        {/* Signup Card */}
        <Card className="border-border bg-card shadow-lg">
          <CardHeader className="space-y-1 pb-6">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-foreground">Create Account</h1>
              <p className="text-muted-foreground mt-2">
                Join CivicTrack to report and track civic issues
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">User Name</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  {...register("username", { 
                    required: "Username is required",
                    minLength: { value: 3, message: "Username must be at least 3 characters" },
                    pattern: { 
                      value: /^[a-zA-Z0-9_]+$/, 
                      message: "Username can only contain letters, numbers, and underscores" 
                    }
                  })}
                />
                {errors.username && (
                  <p className="text-civic-red text-sm">{errors.username.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: { 
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                      message: "Please enter a valid email address" 
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-civic-red text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  {...register("phone", { 
                    required: "Phone number is required",
                    pattern: { 
                      value: /^[+]?[\d\s\-()]+$/, 
                      message: "Please enter a valid phone number" 
                    }
                  })}
                />
                {errors.phone && (
                  <p className="text-civic-red text-sm">{errors.phone.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground pr-10"
                    {...register("password", { 
                      required: "Password is required",
                      minLength: { value: 8, message: "Password must be at least 8 characters" },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
                      }
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-civic-red text-sm">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground pr-10"
                    {...register("confirmPassword", { 
                      required: "Please confirm your password",
                      validate: value => value === password || "Passwords do not match"
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-civic-red text-sm">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="pt-2">
                <p className="text-xs text-muted-foreground">
                  By creating an account, you agree to our{" "}
                  <a href="#" className="text-civic-blue hover:underline">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-civic-blue hover:underline">Privacy Policy</a>
                </p>
              </div>

              {/* Signup Button */}
              <Button 
                type="submit" 
                className="w-full bg-civic-emerald hover:bg-civic-emerald/90 text-white font-medium py-2 mt-6"
              >
                Register
              </Button>

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-civic-blue hover:underline font-medium">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}