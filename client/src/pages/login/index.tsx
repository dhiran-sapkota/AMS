import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginFormData } from "@/types";
import { EMAIL_REGEX } from "@/data/constant";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink } from "react-router-dom";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const { login } = useAuth();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(login)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: EMAIL_REGEX,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <NavLink to="/register" className=" text-sm underline">
              Don't have an account? Register
            </NavLink>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
