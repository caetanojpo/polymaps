import {Region} from "../../../src/domain/models/region.model";
import {userMock} from "../user/userMock";
import {CreateRegionDto} from "../../../src/application/dtos/region/create-region.dto";

export const regionMock: Region = {
    name: "Test Region",
    owner: userMock,
    location: {
        type: "Polygon",
        coordinates: [
            [
                [-122.431297, 37.773972],
                [-122.431300, 37.773975],
                [-122.431305, 37.773980],
                [-122.431297, 37.773972]
            ]
        ]
    },
    isActive: true
}

export const createRegionDTOMock: CreateRegionDto = {
    name: "Test Region",
    owner: "valid-user-id",
    coordinates: [
        [
            [-122.431297, 37.773972],
            [-122.431300, 37.773975],
            [-122.431305, 37.773980],
            [-122.431297, 37.773972]
        ]
    ],
};