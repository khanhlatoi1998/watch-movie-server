import express from 'express';
import {
    createMovie,
    createMovieReview,
    deleteAllMovies,
    deleteMovie,
    getMovieById,
    getMovies,
    getRandomMovies,
    getTopRatedMovies,
    importMovies,
    updateMovie
} from '../controllers/Movies.controllers.js';
import { protect, admin } from '../middlewares/Auth.js';

const router = express.Router();

// ********* PUBLIC ROUTER **********
router.post('/import', importMovies);
router.get('/', getMovies);
router.get('/:id', getMovieById);
router.get('/rated/top', getTopRatedMovies);
router.get('/ramdom/all', getRandomMovies);

// ******** PRIVATE ROUTER ********* 
router.post('/:id/review', protect, createMovieReview);

// ******** ADMIN ROUTER ********* 
router.put('/:id', protect, admin, updateMovie);
router.delete('/:id', protect, admin, deleteMovie);
router.delete('/', protect, admin, deleteAllMovies);
router.post('/', protect, admin, createMovie);



export default router;