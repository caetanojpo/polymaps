import {UserController} from "../../../src/presentation/controllers/user.controller";
import {UserMapper} from "../../../src/infrastructure/mapper/user.mapper";
import STATUS_CODE from "../../../src/utils/status-code";
import {ApiResponse} from "../../../src/utils/api-response";
import {User} from "../../../src/domain/models/user.model";

jest.mock("../../../src/application/use-cases/users/create-user.use-case");
jest.mock("../../../src/application/use-cases/users/find-user.use-case");
jest.mock("../../../src/application/use-cases/users/update-user.use-case");
jest.mock("../../../src/application/use-cases/users/delete-user.use-case");

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

describe("UserController", () => {
    let userController: UserController;
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        userController = new UserController();
        res = mockResponse();
        next = jest.fn();
    });

    describe("createUser", () => {
        it("should create a user successfully", async () => {
            req = {
                body: {
                    name: "Test User",
                    email: "test@test.com",
                    password: "Test123!",
                    coordinates: {
                        latitude: -22.6637,
                        longitude: -50.4116,
                    },
                },
            };
            const mockUser = {_id: "123", ...req.body};
            (userController.create.execute as jest.Mock).mockResolvedValue(mockUser);

            await userController.createUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.CREATED);
        });

        it("should return 400 when validation fails", async () => {
            req = {body: {name: "Test User"}}; // Missing required fields
            const validationErrors = [{constraints: { /* mocked errors */}}];
            jest.spyOn(userController, "validateErrors" as any).mockImplementation(() => {
                return res.status(STATUS_CODE.BAD_REQUEST).json(validationErrors);
            });

            await userController.createUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
        });

        it("should return 400 when location validation fails", async () => {
            req = {
                body: {
                    name: "Test User",
                    email: "test@test.com",
                    password: "123456",
                    address: "ABC 123"
                },
            };
            const validationErrors = [{constraints: { /* mocked errors */}}];
            jest.spyOn(User, "validateLocation").mockImplementation(() => {
                return res.status(STATUS_CODE.BAD_REQUEST).json(validationErrors);
            });

            await userController.createUser(req, res, next);
            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
        });

        it("should return 400 when location validation fails", async () => {
            const validData = {
                name: "Test User",
                email: "test@test.com",
                password: "123456",
                coordinates: {
                    latitude: -22.6637,
                    longitude: -50.4116,
                },
            };
            req.body = {...validData, coordinates: null};
            jest.spyOn(User, "validateLocation").mockImplementation(() => {
                throw new Error("Invalid location");
            });

            await userController.createUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
        });
        it("should pass error to next middleware on unexpected error", async () => {
            req = {
                body: {
                    name: "Test User",
                    email: "test@test.com",
                    password: "123456",
                    coordinates: {
                        latitude: -22.6637,
                        longitude: -50.4116,
                    },
                },
            };
            (userController.create.execute as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

            await userController.createUser(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("findById", () => {
        it("should return user by ID", async () => {
            req = {params: {id: "123"}};
            const mockUser = {
                _id: "123",
                name: "Test User",
                email: "test@test.com",
                hashedPassword: "hashedpassword123",
            };
            (userController.find.executeById as jest.Mock).mockResolvedValue(mockUser);

            await userController.findById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        });

        it("should return 404 when user is not found by ID", async () => {
            req = {params: {id: "123"}};
            (userController.find.executeById as jest.Mock).mockResolvedValue(null);

            await userController.findById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NOT_FOUND);
        });

        it("should exclude password in response", async () => {
            const mockUser = {_id: "123", hashedPassword: "secret", name: "test", email: "test@test.com"};
            (userController.find.executeById as jest.Mock).mockResolvedValue(mockUser);

            await userController.findById(req, res, next);

            const expectedUser = UserMapper.toUserResponseFromDomain(mockUser);
            expect(expectedUser).not.toHaveProperty("hashedPassword");
        });
        it("should pass error to next middleware on unexpected error in findById", async () => {
            req = { params: { id: "123" } };
            (userController.find.executeById as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

            await userController.findById(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("findByEmail", () => {
        it("should return user by email", async () => {
            req = { params: { email: "test@test.com" } };
            const mockUser = {
                _id: "123",
                name: "Test User",
                email: "test@test.com",
                hashedPassword: "hashed123"
            };

            (userController.find.executeByEmail as jest.Mock).mockResolvedValue(mockUser);

            await userController.findByEmail(req, res, next);

            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        });

        it("should return 404 when email not found", async () => {
            req = { params: { email: "missing@example.com" } };
            (userController.find.executeByEmail as jest.Mock).mockResolvedValue(null);

            await userController.findByEmail(req, res, next);

            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NOT_FOUND);
        });
        it("should pass error to next middleware on unexpected error in findByEmail", async () => {
            req = { params: { email: "error@example.com" } };
            (userController.find.executeByEmail as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

            await userController.findByEmail(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("findAll", () => {
        it("should return all users", async () => {
            const mockUsers = [
                { _id: "1", name: "User 1" },
                { _id: "2", name: "User 2" }
            ];

            (userController.find.execute as jest.Mock).mockResolvedValue(mockUsers);

            await userController.findAll(req, res, next);

            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        });

        it("should return empty array when no users exist", async () => {
            (userController.find.execute as jest.Mock).mockResolvedValue([]);
            await userController.findAll(req, res, next);

            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        });

        it("should pass error to next middleware on unexpected error in findAll", async () => {
            (userController.find.execute as jest.Mock).mockRejectedValue(new Error("Unexpected error"));
            await userController.findAll(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("updateUser", () => {
        it("should update a user successfully", async () => {
            req = {
                params: {id: "123"},
                body: {
                    name: "Test User Updated",
                    email: "test.updated@test.com"
                }
            };

            (userController.update.execute as jest.Mock).mockResolvedValue(true);

            await userController.updateUser(req, res, next);

            expect(res.send).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NO_CONTENT);
        });
        it("should pass error to next middleware on unexpected error in updateUser", async () => {
            req = {
                params: { id: "123" },
                body: { name: "Test User Updated", email: "test.updated@test.com" }
            };
            (userController.update.execute as jest.Mock).mockRejectedValue(new Error("Unexpected error"));
            await userController.updateUser(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe("deleteUser", () => {
        it("should perform hard delete when hardDelete=true", async () => {
            req = {params: {id: "123"}, query: {hardDelete: true}};
            (userController.delete.executeHard as jest.Mock).mockResolvedValue(undefined);

            await userController.deleteUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NO_CONTENT);
            expect(res.send).toHaveBeenCalled();
        });

        it("should perform soft delete when hardDelete is false", async () => {
            req = { params: { id: "123" }, query: { hardDelete: false } };
            (userController.delete.execute as jest.Mock).mockResolvedValue(undefined);
            await userController.deleteUser(req, res, next);
            expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NO_CONTENT);
            expect(res.send).toHaveBeenCalled();
        });
        it("should pass error to next middleware on unexpected error in deleteUser", async () => {
            req = { params: { id: "123" }, query: { hardDelete: "true" } };
            (userController.delete.executeHard as jest.Mock).mockRejectedValue(new Error("Unexpected error"));
            await userController.deleteUser(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});
