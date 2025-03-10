import {Request, Response, Router} from 'express';
import {UserController} from "../controllers/user.controller";
import {AuthController} from "../controllers/auth.controller";
import {authMiddleware} from "../../infrastructure/middlewares/auth.middleware";
import {RegionController} from "../controllers/region.controller";

class Routes {
    public routes: Router;
    private readonly userController: UserController;
    private readonly authController: AuthController;
    private readonly regionController: RegionController;

    constructor() {
        this.routes = Router();
        this.userController = new UserController();
        this.authController = new AuthController();
        this.regionController = new RegionController();
        this.configureUserRoutes();
        this.configureAuthRoutes();
        this.configureRegionRoutes();
    }

    private configureUserRoutes(): void {
        this.routes.route('/users')
            .get(authMiddleware, this.userController.findAll.bind(this.userController))
            .post(this.userController.createUser.bind(this.userController));
        this.routes.route('/users/:id')
            .get(authMiddleware, this.userController.findById.bind(this.userController))
            .put(authMiddleware, this.userController.updateUser.bind(this.userController))
            .delete(authMiddleware, this.userController.deleteUser.bind(this.userController))
        this.routes.route('/users/email/:email')
            .get(authMiddleware, this.userController.findByEmail.bind(this.userController))
    }

    private configureAuthRoutes(): void {
        this.routes.route('/login').post(this.authController.login.bind(this.authController));
    }

    private configureRegionRoutes(): void {
        this.routes.route('/regions')
            .post(this.regionController.createRegion.bind(this.regionController))
            .get(this.regionController.findAll.bind(this.regionController));
        this.routes.route('/regions/:id')
            .get(this.regionController.findById.bind(this.regionController))
            .put(this.regionController.updateRegion.bind(this.regionController))
            .delete(this.regionController.deleteRegion.bind(this.regionController))
        this.routes.route('/regions/containing-point')
            .post(this.regionController.listRegionsContainingPoint.bind(this.regionController))
        this.routes.route('/regions/near')
            .post(this.regionController.listRegionsNearPoint.bind(this.regionController))
    }
}

export default new Routes().routes;