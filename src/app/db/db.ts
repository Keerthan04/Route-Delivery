// dbFunctions.ts
import sql from "mssql";
import { config } from "./dbConfig";

// Function to check user ID
export async function checkUserId(
  userId: string
): Promise<{ user_id: string } | null> {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("userId", sql.VarChar, userId)
      .query("SELECT user_id FROM Login WHERE user_id = @userId");
    if (result.recordset.length === 0) {
      return null;
    } else {
      return result.recordset[0];
    }
  } catch (error) {
    console.error("Database Error", error);
    throw new Error("Database Error");
  }
}

// Function to check password
export async function checkPassword(userId: string): Promise<string | null> {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("userId", sql.VarChar, userId)
      .query("SELECT password FROM Login WHERE user_id = @userId");
    if (result.recordset.length === 0) {
      return null;
    } else {
      return result.recordset[0].password;
    }
  } catch (error) {
    console.error("Database Error", error);
    throw new Error("Database Error");
  }
}

// Function to check if user is active
export async function getActive(userId: string): Promise<boolean | null> {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("userId", sql.VarChar, userId)
      .query("SELECT isActive FROM Login WHERE user_id = @userId");
    if (result.recordset.length === 0) {
      return null;
    } else {
      return result.recordset[0].isActive;
    }
  } catch (error) {
    console.error("Database Error", error);
    throw new Error("Database Error");
  }
}
