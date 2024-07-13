import jwt from "jsonwebtoken";
import sql from "mssql";
import { sendData } from "@/app/db/db";
import { config } from "@/app/db/dbConfig";
import { NextResponse } from "next/server";
type report = {
    unit: string;
    date: string;
}
export async function POST(req: Request) {
  try {
    const pool = await sql.connect(config);
    const body:report= await req.json();
    const { unit, date } = body;
    if (!unit || !date) {
      return NextResponse.json({message:"Please fill all the field"},{status:400});
    }

    // Parameterized query to prevent SQL injection
    const query = `
            SELECT 
                CONVERT(varchar, date, 23) AS date,
                unit,
                Route_Name as route_name,
                Route_Sequence as route_sequence,
                CONVERT(varchar, schedule_time, 120) AS schedule_time,
                CONVERT(varchar, actual_time, 120) AS actual_time,
                CONVERT(varchar, difference_time, 8) AS difference_time,
                reason_for_delay as reason_for_delay,
                Status as status
            FROM Route
            WHERE unit = @unit
                AND date = @date`;

    const request = pool.request();
    request.input("unit", sql.VarChar, unit);
    request.input("date", sql.VarChar, date);

    const result = await request.query(query);
    console.log(result.recordset);

    if (result.recordset.length > 0) {
      return NextResponse.json({
        message: "report fetched",
        records: result.recordset,
      },{status:200});
    } else {
      return NextResponse.json({ message: "No records found" },{status:400});
    }
  } catch (error) {
    console.error("Error fetching scheduling report:", error);
    return NextResponse.json({ message: "Internal Server Error" },{status:500});
  }
}
