import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { ReportFormSchema } from "@/lib/schema";// Assume fetchData is a utility function for fetching data
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const initialFormValues = {
  date: "",
  unit: "",
};
async function fetchData(endpoint: string) {
  console.log(endpoint);
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

const ReportForm = () => {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isLoading, setIsLoading] = useState(false);
  const [units, setUnits] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [records, setRecords] = useState<any[]>([]); // Adjust the type based on your API response

  const form = useForm<z.infer<typeof ReportFormSchema>>({
    resolver: zodResolver(ReportFormSchema),
    defaultValues: initialFormValues,
    mode: "onBlur",
  });

  const router = useRouter();

  useEffect(() => {
    fetchData("/api/units")
      .then(setUnits)
      .catch((error) => {
        console.error("Failed to fetch units:", error);
        toast.error("Failed to fetch units");
      });
  }, []);

  const handleUnitChange = async (unit: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      unit,
    }));
    form.setValue("unit", unit);
  };

  const onSubmit = async (values: z.infer<typeof ReportFormSchema>) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/report", {
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
        setRecords(data.records);
        toast.success(data.message);
        form.reset();
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadExcel = () => {
    const headers = [
      "Date",
      "Unit",
      "Route_Name",
      "Route_Sequence",
      "Schedule_Time",
      "Actual_Time",
      "Difference_Time",
      "Reason_for_Delay",
      "Status",
    ];

    const ws = XLSX.utils.json_to_sheet(
      records.map((record) => {
        const formattedRecord = {};
        headers.forEach((header) => {
          formattedRecord[header] = record[header.toLowerCase()] || "N/A";
        });
        return formattedRecord;
      })
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Delivery Report");

    // Generate a unique filename for the downloaded file
    const fileName = `Delivery_Report${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <Toaster position="top-right" richColors duration={2000} />
      <h2 className="text-2xl font-bold mb-6 text-center">Generate Report</h2>
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
          <Button
            disabled={isLoading}
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? "Loading..." : "Generate Report"}
          </Button>
        </form>
      </Form>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
          <div className="relative bg-white p-4 rounded-md shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Download Report</h3>
            <p className="mb-4">Your report is ready for download.</p>
            <Button
              onClick={downloadExcel}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Download Excel
            </Button>
            <Button
              onClick={() => setShowModal(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm ml-4"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportForm;
