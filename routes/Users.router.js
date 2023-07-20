import express from 'express';
import { addLikeMovies, changeUserProfile, deleteLikedMovies, deleteUser, deleteUserProfile, getLikeMovies, getUsers, loginUser, registerUser, updateUserProfile } from "../controllers/Users.controllers.js";
import { admin, protect } from '../middlewares/Auth.js';
import multer from "multer";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50000 * 1024 * 1024 // giới hạn dung lượng file là 500MB
      }
});

// **** PUBLIC ROUTES **** 
router.post('/register', registerUser);
router.post('/login', loginUser);

// **** PRIVATE ROUTES ****
router.put('/update', upload.single('file'), updateUserProfile);
router.delete('/delete', protect, deleteUserProfile);
router.put('/password', protect, changeUserProfile);
router.get('/favorites', protect, getLikeMovies);
router.post('/favorites', protect, addLikeMovies);
router.delete('/favorites', protect, deleteLikedMovies);

// **** ADMIN ROUTES ****
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);

export default router;