import {RegionResponseDTO} from "../../src/application/dtos/region/region-response.dto";
import {userResponseMock} from "./user-response.mock";
import {PolygonModelImpl} from "../../src/domain/models/polygon.model";

export const regionResponseMock: RegionResponseDTO = new RegionResponseDTO(
    "region123",
    "Central Park",
    <PolygonModelImpl><unknown>{
        type: "Polygon", coordinates: [
            [
                [-73.965355, 40.782865],
                [-73.96576, 40.783118],
                [-73.96537, 40.783375],
                [-73.965355, 40.782865]
            ]
        ]
    },
    userResponseMock,
    new Date("2023-01-01T00:00:00.000Z"),
    new Date("2023-01-02T00:00:00.000Z")
);

export const regionResponseMockList: RegionResponseDTO[] = [
    new RegionResponseDTO(
        "region1",
        "Region 1",
        <PolygonModelImpl><unknown>{
            type: "Polygon", coordinates: [
                [
                    [10, 20],
                    [20, 20],
                    [30, 20],
                    [10, 20]
                ]
            ]
        },
        userResponseMock,
        new Date("2023-01-01T00:00:00.000Z"),
        new Date("2023-01-02T00:00:00.000Z")
    ),
    new RegionResponseDTO(
        "region2",
        "Region 2",
        <PolygonModelImpl><unknown>{
            type: "Polygon", coordinates: [
                [
                    [-73.965355, 40.782865],
                    [-73.96576, 40.783118],
                    [-73.96537, 40.783375],
                    [-73.965355, 40.782865]
                ]
            ]
        },
        userResponseMock,
        new Date("2023-01-01T00:00:00.000Z"),
        new Date("2023-01-02T00:00:00.000Z")
    )
];
