import {Request, Response, Router} from 'express';
import {UserController} from "../controllers/user.controller";
import {AuthController} from "../controllers/auth.controller";
import {authMiddleware} from "../../infrastructure/middlewares/auth.middleware";

class Routes {
    public routes: Router;
    private readonly userController: UserController;
    private readonly authController: AuthController;

    constructor() {
        this.routes = Router();
        this.userController = new UserController();
        this.authController = new AuthController();
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
            .delete(authMiddleware, this.userController.softDeleteUser.bind(this.userController))
        this.routes.route('/users/email/:email')
            .get(authMiddleware, this.userController.findByEmail.bind(this.userController))
        this.routes.route('/users/delete/:id')
            .delete(authMiddleware, this.userController.hardDeleteUser.bind(this.userController))
    }

    private configureAuthRoutes(): void {
        this.routes.route('/login').post(this.authController.login.bind(this.authController));
    }

    private configureRegionRoutes(): void {
        this.routes.route('/regions')
            .get((req: Request, res: Response) => {
                res.send("test");
            });
    }
}

export default new Routes().routes;