// dbConfig.ts
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

export const config = {
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD || "Kumarc@2004",
  server: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "Route_Delay",
  options: {
    trustedconnection: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
  port: 1433,
};
