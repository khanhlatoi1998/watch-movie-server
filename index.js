import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

// dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;
const jsonPaser = bodyParser.json();

// limit required use 3000md
app.use(bodyParser.json({ limit: '3000mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '3000mb' }));
app.use(cors());

// connectDB();

// app.use(errorHandler);

// app.use('/api/users', userRouter);
// app.use('/api/movies', movieRouter);
// app.use('/api/categories', categoryRouter);
// app.use('/api/upload', UploadRouter);


app.get('/', (req, res) => {
    res.send('server start')
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});