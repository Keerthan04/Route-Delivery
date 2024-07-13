import { z } from "zod";
export const LoginFormSchema = z.object({
  username: z.string().min(2,{
    message: "Username Should be atleast 2 characters",
  }),
  password: z.string().min(2,{
    message: "Password Should be atleast 2 characters",
  }),
});

export const EntryFormSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  unit: z.string().min(1, { message: "Unit Is Required" }),
  route_name: z.string().min(1, { message: "Route Name Is Required" }),
  route_sequence: z.string().min(1, { message: "Route Sequence Is Required" }),
  schedule_time: z.string().min(1, { message: "Schedule Time Is Required" }),
  actual_time: z.string().min(1, { message: "actual time Is Required" }),
  reason_for_delay: z.string().optional(),
  difference_time:z.string(),
  status: z.string( {
    message: "Please select the status",
  }),
});

export const ReportFormSchema = z.object({
  date: z.string().min(2, { message: "Date is required" }),
  unit: z.string().min(2, { message: "Unit is required" }),
});