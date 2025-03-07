import {Request, Response, Router} from 'express';
import {UserController} from "../controllers/user.controller";

class Routes {
    public routes: Router;
    private readonly userController: UserController;

    constructor() {
        this.routes = Router();
        this.userController = new UserController();
        this.configureUserRoutes();
        this.configureRegionRoutes();
    }

    private configureUserRoutes(): void {
        this.routes.route('/users')
            .get(this.userController.findAll.bind(this.userController))
            .post(this.userController.createUser.bind(this.userController));
        this.routes.route('/users/:id')
            .get(this.userController.findById.bind(this.userController))
            .put(this.userController.updateUser.bind(this.userController))
            .delete(this.userController.softDeleteUser.bind(this.userController))
        this.routes.route('/users/email/:email')
            .get(this.userController.findByEmail.bind(this.userController))
        this.routes.route('/users/delete/:id')
            .delete(this.userController.hardDeleteUser.bind(this.userController))
    }

    private configureRegionRoutes(): void {
        this.routes.route('/regions')
            .get((req: Request, res: Response) => {
                res.send("test");
            });
    }
}

export default new Routes().routes;