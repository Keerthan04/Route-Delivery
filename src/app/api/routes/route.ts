import { NextResponse } from "next/server";
import sql from "mssql";
import { config } from "@/app/db/dbConfig";
import { NextApiRequest } from "next";

export async function GET(req: Request) {
  try {
    //extracting from searchParams
    const url = new URL(req.url);
    console.log(url);
    const searchParams = new URLSearchParams(url.searchParams);
    console.log(searchParams);
    const unit = searchParams.get('unit');
    // Extract the unit query parameter
    console.log('unit is ',unit);
    // Validate if the unit parameter is provided
    if (!unit) {
      return NextResponse.json(
        { message: "Unit query parameter is required" },
        { status: 400 }
      );
    }

    // Connect to the database
    const pool = await sql.connect(config);

    // Fetch routes based on the provided unit
    const routesResult = await pool
      .request()
      .input("unit", sql.VarChar, unit)
      .query(
        "SELECT route_name, route_sequence FROM route_list WHERE unit = @unit"
      );

    // Map the results to the desired format
    const routeNames = routesResult.recordset.map(
      (route: { route_name: string; route_sequence: number }) => ({
        route_name: route.route_name,
        route_sequence: route.route_sequence,
      })
    );

    // Return the fetched data as JSON
    return NextResponse.json(routeNames, { status: 200 });
  } catch (error: any) {
    // Handle any errors that occur during the process
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
