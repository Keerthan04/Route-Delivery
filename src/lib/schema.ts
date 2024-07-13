import { z } from "zod";
export const LoginFormSchema = z.object({
  username: z.string().min(2,{
    message: "Username Should be atleast 2 characters",
  }),
  password: z.string().min(2,{
    message: "Password Should be atleast 2 characters",
  }),
});
