import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    if (request.method !== "POST") {
        return NextResponse.json({ status: 405, error: "Method Not Allowed" });
    }
    const { email, password } = await request.json();
    const body = {
        email: email,
        password: password,
    };

    try {
        const loginRequest = await fetch(
            `${process.env.NEXT_PUBLIC_DEV_URL}/api/v1/login`,
            {
                body: JSON.stringify(body),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const authResponse = await loginRequest.json();
        const statusCode = loginRequest.status;

        const validStatus = [200, 201];
        const returnResponse = { statusCode, ...authResponse };
        if (!validStatus.includes(returnResponse.statusCode)) {
            return NextResponse.json(returnResponse, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            });
        }

        const cookieStore = await cookies();
        const maxAge = 3 * 24 * 60 * 60;

        const loginData = authResponse;
        cookieStore.set("Authorization", loginData.data.token, {
            secure: true,
            maxAge: maxAge,
        });
        const token = cookieStore.get("Authorization");

        const userRequest = await fetch(
            `${process.env.NEXT_PUBLIC_DEV_URL}/api/v1/users/email/${email}`,
            {
                headers: {
                    Authorization: `Bearer ${token?.value}`,
                },
            }
        );
        const userResponse = await userRequest.json();
        userResponse.data.token = loginData.data.token;

        loginData.statusCode = returnResponse.statusCode;
        cookieStore.set("user", JSON.stringify(userResponse.data), {
            secure: true,
            maxAge: maxAge,
        });
        return NextResponse.json(userResponse, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    } catch (error) {
        console.log(error);
        return NextResponse.next();
    }
}
