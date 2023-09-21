import asyncHandler from 'express-async-handler';
import User from '../models/Users.models.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../middlewares/Auth.js';
import path from "path";
import { v4 as uuidv4 } from "uuid";
import storage from "../config/firebaseStorage.js";


const DEFAULT_AVATAR = 'https://firebasestorage.googleapis.com/v0/b/watch-movie-9c15e.appspot.com/o/images%2Fdefault-avatar.png?alt=media&token=29d9da6d-36bd-497d-9b16-5f5aca392c90';


const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, image } = req.body.user;
    try {
        const useExists = await User.findOne({ email });
        if (useExists) {
            res.status(400)
            throw new Error('User already exists!');
        } else {
            const salt = bcrypt.genSalt(10, (err, salt) => {
                if (!err) {
                    bcrypt.hash(password, salt, async (err, hash) => {
                        if (!err) {
                            const user = await User.create({
                                fullName,
                                email,
                                password: hash,
                                image: DEFAULT_AVATAR
                            });

                            if (user) {
                                res.status(201).json({
                                    _id: user._id,
                                    email: user.email,
                                    fullName: user.fullName,
                                    image: user.image,
                                    isAdmin: user.isAdmin,
                                    token: generateToken(user._id)
                                })
                            } else {
                                res.status(400);
                                throw new Error('Invalid user data');
                            }
                        } else { console.log(err) }
                    })
                } else { console.log(err) }
            })
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body.user;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                image: user.image,
                isAdmin: user.isAdmin,
                likedMovies: user.likedMovies,
                token: generateToken(user._id)
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const { email, fullName, image, _id } = req.body;
    const file = req.file;
    try {
        const user = await User.findById(_id); // user is name of Schema created from Users
        if (user) {
            user.fullName = fullName || user.fullName;
            user.email = email || user.email;
            user.image = image || user.image;
            const updateUser = await user.save();
            res.status(200).json({
                _id: updateUser._id,
                fullName: updateUser.fullName,
                email: updateUser.email,
                image: updateUser.image,
                isAdmin: updateUser.isAdmin,
                token: generateToken(updateUser._id)
            });
        } else {
            res.status(401);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

const deleteUserProfile = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            if (user.isAdmin) {
                res.status(400);
                throw new Error("Can't delete admin user");
            } else {
                await User.deleteOne({ _id: user._id });
                res.json({ message: "User deleted successfully" });
            }
        }
        else {
            res.status(404);
            throw new Error("User not found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const changeUserProfile = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body.user;
    try {
        const user = await User.findById(req.user._id);
        if (user && (await bcrypt.compare(oldPassword, user.password))) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;
            const updatePassword = await user.save();
            res.status(200).json({ message: 'Password changed' });
        } else {
            res.status(401);
            throw new Error('Invalid old password');
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

const getLikeMovies = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('likedMovies');
        if (user) {
            res.json(user.likedMovies);
        } else {
            res.status(404);
            throw new Error('Not found user');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const addLikeMovies = asyncHandler(async (req, res) => {
    const { movieId } = req.body.user;
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            if (user.likedMovies.includes(movieId)) {
                res.status(400);
                throw new Error('Movie already liked')
            } else {
            }
            user.likedMovies.push(movieId);
            await user.save();
            res.status(200).json(user.likedMovies);
        } else {
            res.status(400);
            throw new Error('Not found user')
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const deleteLikedMovies = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.likedMovies = [];
            await user.save();
            res.json({ message: "All liked movies deleted successfully" });
        }
        else {
            res.status(404);
            throw new Error("User not found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const getUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({});
        console.log(users);
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    try {
        const user = User.findById(req.params.id);
        if (user) {
            if (user.isAdmin) {
                res.status(400);
                throw new Error('Can not delete admin user')
            }
            await user.deleteOne(user);
            res.status(200).json({ message: 'User deleted successfully' })
        } else {
            res.status(404);
            throw new Error('Not found user');
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

export {
    registerUser,
    loginUser,
    updateUserProfile,
    deleteUserProfile,
    changeUserProfile,
    getLikeMovies,
    addLikeMovies,
    deleteLikedMovies,
    getUsers,
    deleteUser
};