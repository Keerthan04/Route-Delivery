"use client";
import Image from "next/image";
import Link from "next/link";
import img from "../../public/tmg-logo.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "../../public/mtl_logo.jpg";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Toaster, toast } from "sonner";
import { useForm } from "react-hook-form";
import { LoginFormSchema } from "@/lib/schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onBlur",
  });
  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    console.log(values);
    setisLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      console.log("response is ", res);
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message);
      } else {
        const data = await res.json();
        toast.success(data.message);
        setTimeout(()=>{
          router.push('/home');
        },1000);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setisLoading(false);
    }
  }
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <Toaster
          position="top-right"
          expand={true}
          richColors
          duration={2000}
        />
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex flex-col items-center">
              <Image src={img} alt="school" className="bg-img-inherit" />
              <h2 className="text-3xl font-bold leading-tight text-center">
                <span className="text-blue-500">MTL</span>
                <span className="text-black">-Delivery</span>
              </h2>
            </div>
            <h1 className="text-xl font-bold">Login</h1>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter Username"
                        {...field}
                        name="username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter Registered Password"
                        {...field}
                        name="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className={isLoading ? "w-full cursor-not-allowed " : "w-full"}
              >
                {isLoading ? "Loading..." : "Login"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src={logo}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
