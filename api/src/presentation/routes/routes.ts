import {Router} from 'express';
import {UserController} from "../controllers/user.controller";
import {AuthController} from "../controllers/auth.controller";
import {authMiddleware} from "../../infrastructure/middlewares/auth.middleware";
import {RegionController} from "../controllers/region.controller";
import {cacheMiddleware} from "../../infrastructure/middlewares/cache.middleware";

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
            .get(authMiddleware, cacheMiddleware, this.userController.findAll.bind(this.userController))
            .post(this.userController.createUser.bind(this.userController));
        this.routes.route('/users/:id')
            .get(authMiddleware, cacheMiddleware, this.userController.findById.bind(this.userController))
            .put(authMiddleware, this.userController.updateUser.bind(this.userController))
            .delete(authMiddleware, this.userController.deleteUser.bind(this.userController))
        this.routes.route('/users/email/:email')
            .get(authMiddleware, cacheMiddleware, this.userController.findByEmail.bind(this.userController))
    }

    private configureAuthRoutes(): void {
        this.routes.route('/login').post(this.authController.login.bind(this.authController));
    }

    private configureRegionRoutes(): void {
        this.routes.route('/regions')
            .post(authMiddleware, this.regionController.createRegion.bind(this.regionController))
            .get(authMiddleware, cacheMiddleware, this.regionController.findAll.bind(this.regionController));
        this.routes.route('/regions/:id')
            .get(authMiddleware, cacheMiddleware, this.regionController.findById.bind(this.regionController))
            .put(authMiddleware, this.regionController.updateRegion.bind(this.regionController))
            .delete(authMiddleware, this.regionController.deleteRegion.bind(this.regionController))
        this.routes.route('/regions/containing-point')
            .post(authMiddleware, this.regionController.listRegionsContainingPoint.bind(this.regionController))
        this.routes.route('/regions/near')
            .post(authMiddleware, this.regionController.listRegionsNearPoint.bind(this.regionController))
    }
}

export default new Routes().routes;