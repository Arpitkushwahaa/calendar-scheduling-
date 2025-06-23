import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import passport from "passport";

import { config } from "./config/app.config";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { asyncHandler } from "./middlewares/asyncHandler.middeware";
import { BadRequestException } from "./utils/app-error";
import { initializeDatabase } from "./database/database";

// Import routes
import authRoutes from "./routes/auth.route";
import eventRoutes from "./routes/event.route";
import availabilityRoutes from "./routes/availability.route";
import integrationRoutes from "./routes/integration.route";
import meetingRoutes from "./routes/meeting.route";
import zoomIntegrationRouter from "./routes/zoom.integration"; // Added Zoom router

// Passport config needs to be imported after entities might be needed by it, but before routes that use it.
// However, if it directly or indirectly causes User entity to be accessed before DB init, this is an issue.
// For now, keeping it here, but the DB init order change is key.
import "./config/passport.config";

const BASE_PATH = config.BASE_PATH;

async function startServer() {
  // Initialize database first
  await initializeDatabase();
  console.log("Database initialized successfully.");

  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize Passport
  app.use(passport.initialize());
  
  // Explicit preflight handling for all routes - This is now handled by the cors package
  // app.options('*', cors()); 
  
  // Custom middleware to ensure CORS headers are set properly - This is also handled by the cors package
  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', 'https://calendar-scheduling-6rhl.vercel.app');
  //   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  //   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  //   res.header('Access-Control-Allow-Credentials', 'true');
    
  //   // Handle preflight requests
  //   if (req.method === 'OPTIONS') {
  //     return res.status(200).end();
  //   }
    
  //   next();
  // });
  
  app.use(
    cors({
      origin: ["https://calendar-scheduling-6rhl.vercel.app", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"], // Allow Vercel and local development
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization", "Origin", "X-Requested-With", "Accept"]
    })
  );

  // Example/Test Route
  app.get(
    "/",
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      // Removed: throw new BadRequestException("throwing async error");
      res.status(HTTPSTATUS.OK).json({
        message: "Hello from Meetly API!",
        status: "ok",
        environment: process.env.NODE_ENV || "development",
        time: new Date().toISOString()
      });
    })
  );
  
  // Health check endpoint
  app.get("/health", (req: Request, res: Response) => {
    res.status(HTTPSTATUS.OK).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // Register API routes
  app.use(`${BASE_PATH}/auth`, authRoutes);
  app.use(`${BASE_PATH}/event`, eventRoutes);
  app.use(`${BASE_PATH}/availability`, availabilityRoutes);
  app.use(`${BASE_PATH}/integration`, integrationRoutes);
  app.use(`${BASE_PATH}/meeting`, meetingRoutes);
  app.use(`${BASE_PATH}`, zoomIntegrationRouter); // Registered Zoom router under /api (e.g. /api/auth/zoom)
  
  // Log all registered routes for debugging
  console.log('Registered API routes:');
  app._router.stack.forEach((middleware: any) => {
    if(middleware.route){
      console.log(`${middleware.route.path} - ${Object.keys(middleware.route.methods)}`);
    } else if(middleware.name === 'router'){
      middleware.handle.stack.forEach((handler: any) => {
        if(handler.route){
          const path = handler.route.path;
          const methods = Object.keys(handler.route.methods);
          console.log(`${middleware.regexp} ${path} - ${methods}`);
        }
      });
    }
  });

  // Global error handler
  app.use(errorHandler);

  const port = parseInt(config.PORT, 10);
  app.listen(port, "0.0.0.0", () => {
    console.log(
      `Server listening on port ${port} in ${config.NODE_ENV} mode`
    );
    console.log(`Server is bound to 0.0.0.0 to accept all incoming connections`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start the server:", error);
  process.exit(1);
});
