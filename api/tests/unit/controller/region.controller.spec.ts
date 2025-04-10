import { RegionController } from "../../../src/presentation/controllers/region.controller";
import STATUS_CODE from "../../../src/utils/status-code";
import { ApiResponse } from "../../../src/utils/api-response";
import { RegionMapper } from "../../../src/infrastructure/mapper/region.mapper";
import { regionResponseMock, regionResponseMockList } from "../../mocks/region/region-reponse.mock";
import { Region } from "../../../src/domain/models/region.model";

jest.mock("../../../src/application/use-cases/region/create-region.use-case");
jest.mock("../../../src/application/use-cases/region/find-region.use-case");
jest.mock("../../../src/application/use-cases/region/update-region.use-case");
jest.mock("../../../src/application/use-cases/region/delete-region.use-case");

jest.mock("../../../src/config/logger", () => ({
    logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    },
}));

const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

describe("RegionController", () => {
    let regionController: RegionController;
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        regionController = new RegionController();
        res = mockResponse();
        next = jest.fn();
    });

    describe("createRegion", () => {
        it("should create a region successfully", async () => {
            req = {
                body: {
                    name: "Region A",
                    owner: "owner123",
                    coordinates: [
                        [
                            [-122.431297, 37.773972],
                            [-122.431300, 37.773975],
                            [-122.431305, 37.773980],
                            [-122.431297, 37.773972],
                        ],
                    ],
                },
            };
            const mockRegion = { _id: "region123", ...req.body };
            (regionController as any).create.execute = jest.fn().mockResolvedValue(mockRegion);

            await regionController.createRegion(req, res, next);

            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.CREATED);
        });

        it("should return 400 when validation fails", async () => {
            req = { body: { name: "Region A" } };
            jest.spyOn(regionController as any, "validateErrors").mockImplementation(async () => {
                res.status(STATUS_CODE.BAD_REQUEST).json(
                    ApiResponse.error("Validation failed", "VALIDATION_ERROR", [{ error: "Missing fields" }])
                );
                return true;
            });

            await regionController.createRegion(req, res, next);
            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
            expect(res.json).toHaveBeenCalled();
        });

        it("should pass error to next middleware on unexpected error in createRegion", async () => {
            req = {
                body: {
                    name: "Region A",
                    owner: "owner123",
                    coordinates: [
                        [
                            [-122.431297, 37.773972],
                            [-122.431300, 37.773975],
                            [-122.431305, 37.773980],
                            [-122.431297, 37.773972],
                        ],
                    ],
                },
            };
            (regionController.create.execute as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

            await regionController.createRegion(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("findById", () => {
        it("should return region by ID", async () => {
            req = { params: { id: "region123" } };
            const mockRegion = regionResponseMock;
            (regionController as any).find.executeById = jest.fn().mockResolvedValue(mockRegion);

            await regionController.findById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        });

        it("should pass error to next middleware on unexpected error in findById", async () => {
            req = { params: { id: "region123" } };
            (regionController as any).find.executeById = jest.fn().mockRejectedValue(new Error("Unexpected error"));

            await regionController.findById(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("findAll", () => {
        it("should return all regions", async () => {
            req = { query: {} };
            const mockRegions = regionResponseMockList;
            (regionController as any).find.executeAll = jest.fn().mockResolvedValue(mockRegions);

            await regionController.findAll(req, res, next);

            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        });

        it("should pass error to next middleware on unexpected error in findAll", async () => {
            req = { query: {} };
            (regionController as any).find.executeAll = jest.fn().mockRejectedValue(new Error("Unexpected error"));

            await regionController.findAll(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("listRegionsContainingPoint", () => {
        it("should return regions containing a point successfully", async () => {
            req = { body: { latitude: 10, longitude: 20 } };
            jest.spyOn(regionController as any, "validateErrors").mockResolvedValue(false);
            const mockRegions = regionResponseMockList;
            (regionController as any).find.executeRegionsContainingPoint = jest.fn().mockResolvedValue(mockRegions);

            await regionController.listRegionsContainingPoint(req, res, next);

            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        });

        it("should return immediately if validation fails in listRegionsContainingPoint", async () => {
            req = { body: { latitude: 10, longitude: 20 } };
            jest.spyOn(regionController as any, "validateErrors").mockResolvedValue(true);
            const executeSpy = jest.spyOn((regionController as any).find, "executeRegionsContainingPoint");
            await regionController.listRegionsContainingPoint(req, res, next);
            expect(executeSpy).not.toHaveBeenCalled();
        });

        it("should pass error to next middleware on unexpected error in listRegionsContainingPoint", async () => {
            req = { body: { latitude: 10, longitude: 20 } };
            jest.spyOn(regionController as any, "validateErrors").mockResolvedValue(false);
            (regionController as any).find.executeRegionsContainingPoint = jest.fn().mockRejectedValue(new Error("Unexpected error"));
            await regionController.listRegionsContainingPoint(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("listRegionsNearPoint", () => {
        it("should return regions near a point successfully with default values", async () => {
            req = {
                body: { latitude: 10, longitude: 20 },
                query: { maxDistance: 3000 },
            };
            jest.spyOn(regionController as any, "validateErrors").mockResolvedValue(false);
            const mockRegions = regionResponseMockList;
            (regionController as any).find.executeRegionsNearPoint = jest.fn().mockResolvedValue(mockRegions);

            await regionController.listRegionsNearPoint(req, res, next);

            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        });

        it("should return regions near a point successfully with ownerId provided", async () => {
            req = {
                body: { latitude: 10, longitude: 20 },
                query: { maxDistance: 2000, ownerId: "owner123" },
            };
            jest.spyOn(regionController as any, "validateErrors").mockResolvedValue(false);
            const mockRegions = regionResponseMockList;
            (regionController as any).find.executeRegionsNearPoint = jest.fn().mockResolvedValue(mockRegions);

            await regionController.listRegionsNearPoint(req, res, next);

            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        });

        it("should return immediately if validation fails in listRegionsNearPoint", async () => {
            req = { body: { latitude: 10, longitude: 20 }, query: { maxDistance: 2000 } };
            jest.spyOn(regionController as any, "validateErrors").mockResolvedValue(true);
            const executeSpy = jest.spyOn((regionController as any).find, "executeRegionsNearPoint");
            await regionController.listRegionsNearPoint(req, res, next);
            expect(executeSpy).not.toHaveBeenCalled();
        });

        it("should pass error to next middleware on unexpected error in listRegionsNearPoint", async () => {
            req = { body: { latitude: 10, longitude: 20 }, query: {} };
            jest.spyOn(regionController as any, "validateErrors").mockResolvedValue(false);
            (regionController as any).find.executeRegionsNearPoint = jest.fn().mockRejectedValue(new Error("Unexpected error"));
            await regionController.listRegionsNearPoint(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("updateRegion", () => {
        it("should update a region successfully", async () => {
            req = {
                params: { id: "region123" },
                body: { name: "Updated Region" },
            };
            jest.spyOn(regionController as any, "validateErrors").mockResolvedValue(false);
            (regionController as any).update.execute = jest.fn().mockResolvedValue(true);

            await regionController.updateRegion(req, res, next);
            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NO_CONTENT);
            expect(res.send).toHaveBeenCalled();
        });

        it("should return immediately if validation fails in updateRegion", async () => {
            req = { params: { id: "region123" }, body: { name: "Updated Region" } };
            jest.spyOn(regionController as any, "validateErrors").mockResolvedValue(true);
            const executeSpy = jest.spyOn((regionController as any).update, "execute");
            await regionController.updateRegion(req, res, next);
            expect(executeSpy).not.toHaveBeenCalled();
        });

        it("should pass error to next middleware on unexpected error in updateRegion", async () => {
            req = { params: { id: "region123" }, body: { name: "Updated Region" } };
            jest.spyOn(regionController as any, "validateErrors").mockResolvedValue(false);
            (regionController as any).update.execute = jest.fn().mockRejectedValue(new Error("Unexpected error"));
            await regionController.updateRegion(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("deleteRegion", () => {
        it("should perform hard delete when hardDelete is true", async () => {
            req = { params: { id: "region123" }, query: { hardDelete: true } };
            (regionController as any).delete.executeHard = jest.fn().mockResolvedValue(undefined);

            await regionController.deleteRegion(req, res, next);
            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NO_CONTENT);
            expect(res.send).toHaveBeenCalled();
        });

        it("should perform soft delete when hardDelete is false", async () => {
            req = { params: { id: "region123" }, query: { hardDelete: false } };
            (regionController as any).delete.execute = jest.fn().mockResolvedValue(undefined);

            await regionController.deleteRegion(req, res, next);
            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NO_CONTENT);
            expect(res.send).toHaveBeenCalled();
        });

        it("should pass error to next middleware on unexpected error in deleteRegion", async () => {
            req = { params: { id: "region123" }, query: { hardDelete: "true" } };
            (regionController as any).delete.executeHard = jest.fn().mockRejectedValue(new Error("Unexpected error"));

            await regionController.deleteRegion(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});
