import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { checkPassword, checkUserId, getActive } from "@/app/db/db";
export async function POST(request: Request) {
  try {
    console.log(request);
    const { username, password } = await request.json();
    console.log(username, password);
    if (!username || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }
    const user = await checkUserId(username); //check if user exist
    console.log("user is", user);
    if (user === null) {
      return NextResponse.json(
        { message: "Invalid Credentials" },
        { status: 400 }
      );
    } else {
      const pass = await checkPassword(username);
      if (pass != password) {
        return NextResponse.json(
          { message: "Invalid Credentials" },
          { status: 400 }
        );
      } else {
        const active = await getActive(username);
        if (!active) {
          NextResponse.json(
            {
              message: "User is not activated to access the site",
            },
            { status: 400 }
          );
        }
        const login = "true";
        const token = create_jwt(username, password, login);
        const response = NextResponse.json(
          { message: "Login Successful" },
          { status: 200 }
        );
        response.headers.set(
          "Set-Cookie",
          `token=${token}; HttpOnly; Path=/;SameSite=Strict;`
        );
        return response;
      }
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

function create_jwt(user_id: string, password: string, login: string) {
  return jwt.sign({ user_id, password, login }, process.env.JWT_SECRET_KEY!);
}
