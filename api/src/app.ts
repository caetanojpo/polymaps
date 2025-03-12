import express, {Application, Request, Response, NextFunction} from "express";
import cors from "cors";
import {logger} from "./config/logger";
import routes from "./presentation/routes/routes";
import {errorHandler} from "./infrastructure/middlewares/error-handler.middleware";
import STATUS_CODE from "./utils/status-code";
import {swaggerSpec} from "./config/swagger/swagger";
import swaggerUi from "swagger-ui-express";

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.configureMiddlewares();
        this.configureCoreRoutes()
        this.configureAPIRoutes();
        this.configureErrorHandling();
    }

    private configureMiddlewares(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));

    }

    private configureCoreRoutes(): void {
        this.app.get("/", (req: Request, res: Response) => {
            res.send("Welcome to the API!");
        });

        this.app.head("/", (req: Request, res: Response) => {
            res.sendStatus(200);
        });

        this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }

    private configureAPIRoutes(): void {
        this.app.use('/api/v1', routes);
    }

    private configureErrorHandling(): void {

        this.app.use((req: Request, res: Response, next: NextFunction) => {
            logger.error(`Route not found: ${req.method} ${req.originalUrl}`);
            next({
                statusCode: STATUS_CODE.NOT_FOUND,
                message: `Route ${req.method} ${req.originalUrl} not found`,
            });
        });

        this.app.use(errorHandler);
    }
}

export default new App().app;