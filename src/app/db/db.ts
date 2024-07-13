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
interface Route {
  route_name: string;
  route_sequence: number;
}

interface UnitRoute {
  unitName: string;
  routes: Route[];
}

export async function sendData(): Promise<UnitRoute[]> {
  try {
    const pool = await sql.connect(config);
    const unitsResult = await pool
      .request()
      .query("SELECT unit FROM route_list");
    const unitNames = unitsResult.recordset.map(
      (unit: { unit: string }) => unit.unit
    );

    const dataPromises = unitNames.map(async (unit) => {
      const routeArray = await pool
        .request()
        .query(
          `SELECT route_name, route_sequence FROM route_list WHERE unit = '${unit}'`
        );
      const routes = routeArray.recordset.map(
        (route: { route_name: string; route_sequence: number }) => ({
          route_name: route.route_name,
          route_sequence: route.route_sequence,
        })
      );
      return { unitName: unit, routes };
    });

    const data: UnitRoute[] = await Promise.all(dataPromises);
    console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error", error);
    throw new Error("Database Error");
  }
}