"use client";
import Image from "next/image";
import Link from "next/link";
import img from "../../public/tmg-logo.jpg";
import logo from "../../public/mtl_logo.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { EntryFormSchema } from "@/lib/schema";
import { ChangeEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const initialFormValues = {
  date: "",
  unit: "",
  route_name: "",
  route_sequence: "",
  schedule_time: "",
  actual_time: "",
  reason_for_delay: "",
  status: "active",
  difference_time: "00:00:00",
};

async function fetchData(endpoint: string) {
    console.log(endpoint);
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default function EntryForm() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [showReasonForDelay, setShowReasonForDelay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [units, setUnits] = useState<string[]>([]);
  const [routeNames, setRouteNames] = useState<
    { route_name: string; route_sequence: number }[]
  >([]);

  const form = useForm<z.infer<typeof EntryFormSchema>>({
    resolver: zodResolver(EntryFormSchema),
    defaultValues: initialFormValues,
    mode: "onBlur",
  });

  useEffect(() => {
    fetchData("/api/units").then(setUnits).catch(console.error);
  }, []);

  const handleUnitChange = async (unit: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      unit,
      route_name: "",
      route_sequence: "",
    }));
    form.setValue("unit", unit);
    const data = await fetchData(`/api/routes?unit=${unit}`);
    setRouteNames(data);
  };

  const handleRouteNameChange = (route_name: string) => {
    const route = routeNames.find((route) => route.route_name === route_name);
    const route_sequence = route ? route.route_sequence.toString() : "";
    setFormValues((prevValues) => ({
      ...prevValues,
      route_name,
      route_sequence,
    }));
    form.setValue("route_name", route_name);
    form.setValue("route_sequence", route_sequence);
  };

  const handleScheduledTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormValues((prevValues) => ({
      ...prevValues,
      schedule_time: value,
    }));
    form.setValue("schedule_time", value);
    calculateDifferenceTime(value, formValues.actual_time);
  };

  const handleActualTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormValues((prevValues) => ({
      ...prevValues,
      actual_time: value,
    }));
    form.setValue("actual_time", value);
    calculateDifferenceTime(formValues.schedule_time, value);
  };

  const calculateDifferenceTime = (
    scheduled: string | number | Date,
    actual: string | number | Date
  ) => {
    if (scheduled && actual) {
      const scheduledDate = new Date(scheduled) as Date;
      const actualDate = new Date(actual) as Date;
      const diffMs = actualDate - scheduledDate;

      if (diffMs < 0) {
        setFormValues((prevValues) => ({
          ...prevValues,
          difference_time: "00:00:00",
        }));
        form.setValue("difference_time", "00:00:00");
        setShowReasonForDelay(false);
        return;
      }

      const diffHrs = Math.floor(diffMs / 3600000);
      const diffMins = Math.floor((diffMs % 3600000) / 60000);
      const diffSecs = Math.floor((diffMs % 60000) / 1000);

      const diffTime = `${String(diffHrs).padStart(2, "0")}:${String(
        diffMins
      ).padStart(2, "0")}:${String(diffSecs).padStart(2, "0")}`;
      setFormValues((prevValues) => ({
        ...prevValues,
        difference_time: diffTime,
      }));
      form.setValue("difference_time", diffTime);
      setShowReasonForDelay(diffMs > 0);
    }
  };

  async function onSubmit(values: z.infer<typeof EntryFormSchema>) {
    console.log(values);
    setIsLoading(true);
    try {
      const res = await fetch("/api/entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message);
      } else {
        const data = await res.json();
        toast.success(data.message);
        form.reset();
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <Toaster position="top-right" richColors duration={2000} />
      <h2 className="text-2xl font-bold mb-6 text-center">Route Entry Form</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input
                    id="date"
                    type="date"
                    placeholder="Please Enter Date"
                    {...field}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleUnitChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="route_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Route Name</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleRouteNameChange(value);
                  }}
                  defaultValue={field.value}
                  disabled={routeNames.length === 0}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Route Name" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {routeNames.map((route) => (
                      <SelectItem
                        key={route.route_name}
                        value={route.route_name}
                      >
                        {route.route_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="route_sequence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Route Sequence</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={formValues.route_sequence}
                    readOnly
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="schedule_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schedule Time</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    placeholder="Please enter the scheduled time"
                    step="1"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleScheduledTimeChange(e);
                    }}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="actual_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Actual Time</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    placeholder="Please enter the actual time"
                    step="1"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleActualTimeChange(e);
                    }}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="difference_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difference Time</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={formValues.difference_time}
                    readOnly
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {showReasonForDelay && (
            <FormField
              control={form.control}
              name="reason_for_delay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Delay</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Please enter the reason for delay"
                      {...field}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isLoading}
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
