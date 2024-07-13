import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export  async function GET(
  req: Request
) {
  try {
    console.log(req);
    const cookie = req.headers.getSetCookie();
    console.log(cookie);

    if (!cookie) {
      return NextResponse.json({ message: "Already Logged out" },{status:400});
    }
    const response = NextResponse.json({ message: "Logged out Successfully" },{status:200});
    response.headers.set(
      "Set-Cookie",
      `token=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict;`
    );
    return response;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json({ message: "Internal Server Error" },{status:500});
  }
}
