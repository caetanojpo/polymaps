import {cookies} from "next/headers";
import {NextResponse} from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    if (request.method !== "POST") {
        return NextResponse.json({status: 405, error: "Method Not Allowed"});
    }
    const {name, email, password} = await request.json();
    const body = {
        name: name,
        email: email,
        password: password,
        //FIXED ADDRESS JUST TO TEST THE SIGNUP FLOW
        address: "Rio Brilhante, Região Geográfica Imediata de Dourados, Região Geográfica Intermediária de Dourados, Mato Grosso do Sul, Região Centro-Oeste, Brasil"
    };

    try {
        const registerRequest = await fetch(
            `${process.env.NEXT_PUBLIC_DEV_URL}/api/v1/users`,
            {
                body: JSON.stringify(body),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const registerResponse = await registerRequest.json();
        const statusCode = registerRequest.status;

        const returnResponse = {statusCode, ...registerResponse};
        return NextResponse.json(returnResponse, {
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
