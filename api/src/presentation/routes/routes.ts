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
            .get((req: Request, res: Response) => {
                res.send("test");
            })
            .post(this.userController.createUser.bind(this.userController));
        this.routes.route('/user/:id')
            .get((req: Request, res: Response) => {
                res.send("test");
            })
            .put((req: Request, res: Response) => {
                res.send("test");
            })
            .delete((req: Request, res: Response) => {
                res.send("test");
            });
    }

    private configureRegionRoutes(): void {
        this.routes.route('/regions')
            .get((req: Request, res: Response) => {
                res.send("test");
            });
    }
}

export default new Routes().routes;