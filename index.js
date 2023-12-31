import bodyParser from 'body-parser';
import { connectDB } from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/Error.middlewares.js';
import express from 'express';
import userRouter from './routes/Users.router.js';
import movieRouter from './routes/Movies.router.js';
import categoryRouter from './routes/Categories.router.js';
import UploadRouter from './controllers/UploadFile.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// limit required use 3000md
app.use(bodyParser.json({ limit: '3000mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '3000mb' }));
app.use(cors());

// connect DB
connectDB();

app.use(errorHandler);
app.use('/api/users', userRouter);
app.use('/api/movies', movieRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/upload', UploadRouter);

app.get('/', (req, res) => {
    res.send('start server')
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});