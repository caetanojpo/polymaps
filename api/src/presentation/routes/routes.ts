import {Request, Response, Router} from 'express';

class Routes {
    public routes: Router;

    constructor() {
        this.routes = Router();
        this.configureUserRoutes();
        this.configureRegionRoutes();
    }

    private configureUserRoutes(): void {
        this.routes.route('/users')
            .get((req: Request, res: Response) => {
                res.send("test");
            })
            .post((req: Request, res: Response) => {
                res.send("test");
            });
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