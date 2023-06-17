import Categories from '../models/Categories.models.js';
import asyncHandler from 'express-async-handler';

const getCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Categories.find({});
        res.json(categories);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const createCategories = asyncHandler(async (req, res) => {
    try {
        const { title } = req.body;
        const category = new Categories({
            title
        });
        const createCategories = await category.save();
        res.status(201).json(createCategories);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const updateCategory = asyncHandler(async (req, res) => {
    try {
        // get category id from request params
        const category = await Categories.findById(req.params.id);
        if (category) {
            // update category title
            category.title = req.body.title || category.title;
            // save the updated category in database
            const updatedCategory = await category.save();
            // send the updated category to the client
            res.json(updatedCategory);
        } else {
            res.status(404).json({ message: "Category not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const deleteCategory = asyncHandler(async (req, res) => {
    try {
        // get category id from request params
        const category = await Categories.findById(req.params.id);
        if (category) {
            // delete the category from database
            await category.deleteOne();
            // send success message to the client
            res.json({ message: "Category removed" });
        } else {
            res.status(404).json({ message: "Category not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export {
    getCategories,
    createCategories,
    updateCategory,
    deleteCategory
}