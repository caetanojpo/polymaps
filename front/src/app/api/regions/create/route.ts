import {NextResponse} from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    if (request.method !== "POST") {
        return NextResponse.json({status: 405, error: "Method Not Allowed"});
    }
    const {name, coordinates, ownerId, token} = await request.json();
    const body = {
        name: name,
        coordinates: coordinates,
        owner: ownerId
    };

    try {
        const createRegionRequest = await fetch(
            `${process.env.NEXT_PUBLIC_DEV_URL}/api/v1/regions`,
            {
                body: JSON.stringify(body),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const createRegionResponse = await createRegionRequest.json();
        const statusCode = createRegionRequest.status;

        const validStatus = [200, 201];
        const returnResponse = {statusCode, ...createRegionResponse};
        if (!validStatus.includes(returnResponse.statusCode)) {
            return NextResponse.json(returnResponse, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            });
        }

        const regionId = createRegionResponse.data.id;

        const findRegionsRequest = await fetch(
            `${process.env.NEXT_PUBLIC_DEV_URL}/api/v1/regions/${regionId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                method: "GET"
            }
        );
        const findRegionsResponse = await findRegionsRequest.json();


        findRegionsResponse.statusCode = returnResponse.statusCode;
        return NextResponse.json(findRegionsResponse, {
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
