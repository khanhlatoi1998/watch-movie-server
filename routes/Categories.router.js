import express from 'express';
import {
    getCategories,
    createCategories,
    updateCategory,
    deleteCategory
} from '../controllers/Categories.controllers.js';
import { protect, admin } from '../middlewares/Auth.js';

const router = express.Router();

// ************ PUBLIC ROUTES ************
router.get("/", getCategories);

// ************ ADMIN ROUTES ************
router.post("/", protect, admin, createCategories);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

export default router;