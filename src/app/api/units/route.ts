import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import sql from "mssql";
import { sendData } from "@/app/db/db";
import { config } from "@/app/db/dbConfig";
export async function GET(req: Request) {
    try{
        const pool = await sql.connect(config);
        const unitsResult = await pool
          .request()
          .query("SELECT distinct unit FROM route_list");
        const unitNames = unitsResult.recordset.map(
          (unit: { unit: string }) => unit.unit
        );
        return NextResponse.json(unitNames,{status:200});
    }catch(error:any){
        return NextResponse.json({message:"Internal Server Error"},{status:500});
    }
}
