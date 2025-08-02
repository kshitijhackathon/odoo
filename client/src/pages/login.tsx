import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Building, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToastNotifications } from "@/hooks/use-toast-notifications";
import { useForm } from "react-hook-form";

interface LoginFormData {
  username: string;
  password: string;
}

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToastNotifications();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    // Mock login logic
    console.log("Login attempt:", data);
    toast().success("Login successful!", "Welcome back to CivicTrack.", 3000);
    setLocation("/");
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

        {/* Login Card */}
        <Card className="border-border bg-card shadow-lg">
          <CardHeader className="space-y-1 pb-6">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-foreground">Sign In</h1>
              <p className="text-muted-foreground mt-2">
                Enter your credentials to access your account
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
                  placeholder="Enter your username"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  {...register("username", { 
                    required: "Username is required",
                    minLength: { value: 3, message: "Username must be at least 3 characters" }
                  })}
                />
                {errors.username && (
                  <p className="text-civic-red text-sm">{errors.username.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground pr-10"
                    {...register("password", { 
                      required: "Password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" }
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

              {/* Login Button */}
              <Button 
                type="submit" 
                className="w-full bg-civic-emerald hover:bg-civic-emerald/90 text-white font-medium py-2 mt-6"
              >
                Login
              </Button>

              {/* Register Link */}
              <div className="text-center pt-4">
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-civic-blue hover:underline font-medium">
                    Register here
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