import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import sql from "mssql";
import {sendData} from '@/app/db/db';
import { config } from "@/app/db/dbConfig";
type entry ={
    date:string
    unit:string
    route_name:string
    route_sequence:string
    schedule_time:string
    actual_time:string
    reason_for_delay:string
    difference_time:string
    status:string
}
export async function POST(req:Request){
    try{
        const pool = await sql.connect(config);
        const body:entry = await req.json();
        console.log(body);
        const {actual_time,date,difference_time,reason_for_delay,route_name,route_sequence,schedule_time,status,unit} = body;
        if(!actual_time || !date || !difference_time || !route_name || !route_sequence || !schedule_time || !status || !unit){
            return NextResponse.json({message:"All fields are required"},{status:400})
        }
        const delay_required = difference_time !== "00:00:00";
        let query;
        if (delay_required) {
          query = `Insert into route(date,unit,route_name,route_sequence,schedule_time,actual_time,difference_time,reason_for_delay,status) values('${date}','${unit}','${route_name}','${route_sequence}','${schedule_time}','${actual_time}','${difference_time}','${reason_for_delay}','${status}')`;
        } else {
          query = `Insert into route(date,unit,route_name,route_sequence,schedule_time,actual_time,difference_time,reason_for_delay,status) values('${date}','${unit}','${route_name}','${route_sequence}','${schedule_time}','${actual_time}','${difference_time}','NA','${status}')`;
        }
        const result = await pool.request().query(query);
        console.log(result);
        return NextResponse.json({message:"Route Entry Saved"},{status:200})
    }catch(error:any){
        console.error(error);
        if (error.code === "EREQUEST" && error.originalError.info.number === 2627) {
          return NextResponse.json({ message: "Route Entry Already Exists for this Day" }, { status: 400 });
        }
        else{
          return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        }
    }
    
}
export async function GET(req:Request){
    try{
        const Data = sendData();
        console.log(Data);
        return NextResponse.json({Data:Data},{status:200})
    }catch(error:any){
         return NextResponse.json(
           { message: "Internal Server Error" },
           { status: 500 }
         );
    }
}