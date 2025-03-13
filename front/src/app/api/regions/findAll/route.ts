import {NextResponse} from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    if (request.method !== "POST") {
        return NextResponse.json({status: 405, error: "Method Not Allowed"});
    }
    const {userId, token} = await request.json();

    try {
        const findAllRequest = await fetch(
            `${process.env.NEXT_PUBLIC_DEV_URL}/api/v1/regions?ownerId=${userId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const findAllResponse = await findAllRequest.json();
        return NextResponse.json(findAllResponse, {
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
