import express from 'express';
import multer from "multer";
import {
    createMovie,
    createMovieReview,
    deleteAllMovies,
    deleteMovie,
    getAllMovies,
    getMovieById,
    getMovies,
    getRandomMovies,
    getRelatedMovies,
    getTopRatedMovies,
    importMovies,
    updateMovie
} from '../controllers/Movies.controllers.js';
import { protect, admin } from '../middlewares/Auth.js';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50000 * 1024 * 1024 // giới hạn dung lượng file là 500MB
      }
});

const router = express.Router();

// ********* PUBLIC ROUTER **********
router.post('/import', importMovies);
router.get('/', getMovies);
router.get('/all', getAllMovies);
router.get('/:id', getMovieById);
router.get('/rated/top', getTopRatedMovies);
router.get('/ramdom/all', getRandomMovies);
router.get('/related', getRelatedMovies);

// ******** PRIVATE ROUTER ********* 
router.post('/:id/review', protect, createMovieReview);

// ******** ADMIN ROUTER ********* 
router.put('/:id', protect, admin, updateMovie);
router.delete('/:id', protect, admin, deleteMovie);
router.delete('/', protect, admin, deleteAllMovies);
router.post('/create', protect, admin, upload.any(), createMovie);



export default router;