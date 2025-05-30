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

/* CONFIGURATIONS */
// @ts-ignore
dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.raw({ type: 'application/json' }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
// @ts-ignore
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

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
