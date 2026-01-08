import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import * as Sentry from '@sentry/node';
import authRoutes from './routes/auth';
import resumeRoutes from './routes/resume';
import interviewRoutes from './routes/interview';
import coverLetterRoutes from './routes/coverLetter';
import workshopRoutes from './routes/workshop';
import speechRoutes from './routes/speech';
import chatRoutes from './routes/chat';
import metricsRoutes from './routes/metrics';
import { setupWorkshopSockets } from './sockets/workshop';

/* CONFIGURATIONS */
// @ts-ignore
dotenv.config();
const app = express();

// Initialize Sentry
Sentry.init({
    dsn: process.env.SENTRY_BACKEND_DSN,
    tracesSampleRate: 1.0,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// Cache headers middleware for static assets
const setCacheHeaders = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ext = path.extname(req.url).toLowerCase();

    // Set cache headers based on file type
    if (ext === '.js' || ext === '.css') {
        // JavaScript and CSS files - cache for 1 year
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
    } else if (
        ext === '.png' ||
        ext === '.jpg' ||
        ext === '.jpeg' ||
        ext === '.gif' ||
        ext === '.webp' ||
        ext === '.svg' ||
        ext === '.ico'
    ) {
        // Images - cache for 1 month
        res.setHeader('Cache-Control', 'public, max-age=2592000');
        res.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString());
    } else if (ext === '.woff' || ext === '.woff2' || ext === '.ttf' || ext === '.eot') {
        // Fonts - cache for 1 year
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
    } else if (ext === '.pdf' || ext === '.doc' || ext === '.docx') {
        // Documents - cache for 1 week
        res.setHeader('Cache-Control', 'public, max-age=604800');
        res.setHeader('Expires', new Date(Date.now() + 604800000).toUTCString());
    } else {
        // Other static files - cache for 1 day
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('Expires', new Date(Date.now() + 86400000).toUTCString());
    }

    next();
};

// Parse JSON requests
app.use(express.json());
app.use(bodyParser.raw({ type: 'application/json' }));
// @ts-ignore
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));

// Set up Cross Origin Resource Sharing (should only be receiving from frontend)
const corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://resumegpt-client-dev.fly.dev",
        "https://www.resumetitan.com",
    ]
}

app.use(cors(corsOptions));

// Apply cache headers to static assets
app.use('/assets', setCacheHeaders, express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

/* ROUTES */
app.use('/auth', authRoutes);
app.use('/resume', resumeRoutes);
app.use('/interview', interviewRoutes);
app.use('/cover-letter', coverLetterRoutes);
app.use('/workshop', workshopRoutes);
app.use('/speech', speechRoutes);
app.use('/chat', chatRoutes);
app.use('/metrics', metricsRoutes);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(`Internal Server Error: ${err.message}\n`);
});

/* SOCKET.IO SETUP */
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: corsOptions
});

// Set up workshop socket handlers
setupWorkshopSockets(io);

/* MONGOOSE SETUP */
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3001;

mongoose
    .connect(process.env.MONGO_URL as string)
    .then(() => {
        httpServer.listen(PORT as number, HOST, () => {
            console.log(`Server is running on: http://${HOST}:${PORT}`);
            console.log(`WebSocket server is ready`);
        });
    })
    .catch(error => {
        console.log(`${error} did not connect`);
        Sentry.captureException(error);
    });
