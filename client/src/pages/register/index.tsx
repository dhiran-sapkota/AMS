import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import CustomInput from "@/components/CustomInput";
import { Form } from "@/components/ui/form";
import { UserPlus } from "lucide-react";
import { registerFormDetails, registerSchema } from "@/data/register-form";
import { registerUser } from "@/service/api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { Response } from "@/types";
import Spinner from "@/components/Spinner";

export default function RegisterPage() {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const navigate = useNavigate();

  const { mutate: mutateCreateUser, isLoading } = useMutation(registerUser, {
    onSuccess: () => {
      navigate("/login");
    },
    onError: (error : AxiosError<Response<null>>) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message ?? "Unable to create user",
      });
    },
  });

  // useEffect(() => {
  //   form.setValue("role", "super_admin");
  // }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src="https://cdn.pixabay.com/photo/2024/09/10/19/08/ai-9037931_1280.png"
            alt="Registration illustration"
            width={800}
            height={800}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
            <h1 className="text-3xl font-bold text-white">Register</h1>
          </div>
        </div>
        <div className="lg:w-1/2 p-8">
          <Card className="w-full ] shadow-none border-0">
            <CardHeader className="space-y-1 px-0">
              <CardTitle className="text-2xl font-bold">
                Create an account
              </CardTitle>
              <CardDescription>
                Enter your details below to create your account and get started
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((data) => mutateCreateUser(data))}
                  className="space-y-4"
                >
                  {registerFormDetails.map((field) => (
                    <CustomInput
                      control={form.control}
                      key={field.name}
                      fielddata={field}
                    />
                  ))}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Spinner />
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <UserPlus className="mr-2 h-4 w-4" /> Create account
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
