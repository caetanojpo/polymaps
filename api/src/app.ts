import express, {Application, Request, Response, NextFunction} from "express";
import cors from "cors";
import {logger} from "./config/logger";
import routes from "./presentation/routes/routes";
import {errorHandler} from "./infrastructure/middlewares/error-handler.middleware";
import STATUS_CODE from "./utils/status-code.utils";

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
    }

    private configureAPIRoutes(): void {
        this.app.use('/api/v1', routes);
    }

    private configureErrorHandling(): void {
        this.app.use(errorHandler);

        this.app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
            logger.error(`Internal Server Error: ${err.message}`);
            res.status(500).json({
                error: 'Internal Server Error',
                message: err.message,
            });
        });

        this.app.use((req: Request, res: Response, next: NextFunction): void => {
            logger.logFormatted("error", "Route {} not found.", req.originalUrl);
            res.status(STATUS_CODE.NOT_FOUND).send(`Route ${req.method} ${req.originalUrl} not found`);
        });
    }
}

export default new App().app;