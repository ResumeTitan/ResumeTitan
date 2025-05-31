import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import authRoutes from './routes/auth';
import resumeRoutes from './routes/resume';
import interviewRoutes from './routes/interview';
// import stripeRoutes from './routes/stripe';
import coverLetterRoutes from './routes/coverLetter';
import speechRoutes from './routes/speech';
import chatRoutes from './routes/chat';

/* CONFIGURATIONS */
// @ts-ignore
dotenv.config();
const app = express();

// Cache headers middleware for static assets
const setCacheHeaders = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ext = path.extname(req.url).toLowerCase();
  
  // Set cache headers based on file type
  if (ext === '.js' || ext === '.css') {
    // JavaScript and CSS files - cache for 1 year
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
  } else if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif' || ext === '.webp' || ext === '.svg' || ext === '.ico') {
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

app.use(express.json());
app.use(bodyParser.raw({ type: 'application/json' }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
// @ts-ignore
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

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

/* ROUTES WITH FILES */
// app.post('/posts', verifyToken, upload.single('picture'), createPost);

/* ROUTES */
app.use('/auth', authRoutes);
app.use('/resume', resumeRoutes);
app.use('/interview', interviewRoutes);
// app.use('/checkout', stripeRoutes);
app.use('/cover-letter', coverLetterRoutes);
app.use('/speech', speechRoutes);
app.use('/chat', chatRoutes);

/* MONGOOSE SETUP */
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => {
    const server = app.listen(PORT as number, HOST, () => {
      const { address, port } = server.address() as any;
      console.log(`Server is running on: http://${address}:${port}`);
    });
  })
  .catch((error) => console.log(`${error} did not connect`));
