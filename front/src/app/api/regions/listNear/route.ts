import {NextResponse} from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    if (request.method !== "POST") {
        return NextResponse.json({status: 405, error: "Method Not Allowed"});
    }
    const {latitude, longitude, token, maxDistance, ownerId} = await request.json();
    const body = {
        latitude: latitude,
        longitude: longitude,
    };


    const url = !ownerId ? `api/v1/regions/near?maxDistance=${maxDistance}` : `api/v1/regions/near?maxDistance=${maxDistance}&ownerId=${ownerId}`;

    try {
        const findAllRequest = await fetch(
            `${process.env.NEXT_PUBLIC_DEV_URL}/${url}`,
            {
                body: JSON.stringify(body),
                method: "POST",
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
