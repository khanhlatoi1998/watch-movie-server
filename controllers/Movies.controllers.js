import asyncHandler from 'express-async-handler';
import Movies from '../models/Movies.models.js';
import path from "path";
import { v4 as uuidv4 } from "uuid";
import storage from "../config/firebaseStorage.js";

const Movie = {
    name: "My Favorite Person",
    desc: "Lorem ipsum dolor",
    titleImage: "33.jpg",
    image: "3.jpg",
    category: "Adventure",
    language: "Korean",
    year: "2000",
    time: 11,
    video: "",
    rate: 2.5,
}
    ;
const MoviesData = [];

const importMovies = asyncHandler(async (req, res) => {
    try {
        await Movies.deleteMany({});
        for (let i = 0; i < 20; i++) {
            MoviesData.push({
                movieTitle: `movie title ${i}`,
                hours: Number(i),
                language: '',
                year: 2002,
                movieDescription: '',
                movieCategory: '',
                casts: [],
                rate: Number(i),
                numberOfReviews: Number(i),
                imageWithTitle: '',
                imageWithThumbnail: '',
                video: '',
            })
        }
        const movies = await Movies.insertMany(MoviesData);
        res.status(200).json(movies);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

const getMovies = asyncHandler(async (req, res) => {
    try {
        const { category, language, time, year, search, rate } = req.query;
        let query = {
            ... (category && { category }),
            ...(time && { time }),
            ...(language && { language }),
            ...(rate && { rate }),
            ... (year && { year }),
            ...(search && { name: { $regex: search, $options: "i" } }),
        };

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 2;
        const skip = (page - 1) * limit;
        const count = await Movies.countDocuments(query);

        const movies = await Movies.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            movies,
            page,
            limit,
            pages: Math.ceil(count / limit),
            totalMovie: count
        });
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: error.message })
    }
});

const getAllMovies = asyncHandler(async (req, res) => {
    try {

        const movies = await Movies.find({})

        res.status(200).json(movies);
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: error.message })
    }
});

const getMovieById = asyncHandler(async (req, res) => {
    try {
        console.log(req.params.id)
        const movie = await Movies.findById(req.params.id);
        if (movie) {
            res.json(movie);
            console.log(movie)
        }
        else {
            res.status(404);
            throw new Error("Movie not found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const getTopRatedMovies = asyncHandler(async (req, res) => {
    try {
        // find top rated movies
        const movies = await Movies.find({}).sort({ rate: -1 });
        // send top rated movies to the client
        res.json(movies);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const getRandomMovies = asyncHandler(async (req, res) => {
    try {
        // find random movies
        console.log('getRandomMovies');
        const movies = await Movies.aggregate([{ $sample: { size: 8 } }]);
        res.json(movies);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const getRelatedMovies = asyncHandler(async (req, res) => {
    try {
        // find random movies
        console.log('getRandomMovies');
        const movies = await Movies.aggregate([{ $sample: { size: 8 } }]);
        res.json(movies);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const createMovieReview = asyncHandler(async (req, res) => {
    const { rating, message } = req.body;
    console.log(req.params.id)
    try {
        const movie = await Movies.findById(req.params.id);
        console.log(req.user);
        if (movie) {
            // const alreadyReviewed = movie.reviews.find(
            //     (r) => r.userId.toString() === req.user._id.toString()
            // );

            // if (alreadyReviewed) {
            //     // res.status(400);
            //     // throw new Error('You already reviewed this movie');
            // }

            const review = {
                userName: req.user.fullName,
                userImage: req.user.image,
                userId: req.user._id,
                rating: Number(rating),
                message: message
            }

            movie.reviews.push(review);
            movie.numberOfReviews = movie.reviews.length;
            movie.rate = movie.reviews.reduce((acc, item) => item.rating + acc, 0) / movie.reviews.length;

            await movie.save();
            res.status(201).json(movie.reviews);
        } else {
            res.status(400);
            throw new Error('Movie not found');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const updateMovie = asyncHandler(async (req, res) => {
    try {
        const {
            name,
            desc,
            image,
            titleImage,
            rate,
            numberOfReviews,
            category,
            time,
            language,
            year,
            video,
            casts,
        } = req.body;

        const movie = await Movies.findById(req.params.id);

        if (movie) {
            movie.name = name || movie.name;
            movie.desc = desc || movie.desc;
            movie.image = image || movie.image;
            movie.titleImage = titleImage || movie.titleImage;
            movie.rate = rate || movie.rate;
            movie.numberOfReviews = numberOfReviews || movie.numberOfReviews;
            movie.category = category || movie.category;
            movie.time = time || movie.time;
            movie.language = language || movie.language;
            movie.year = year || movie.year;
            movie.video = video || movie.video;
            movie.casts = casts || movie.casts;

            const updateMovie = await movie.save();
            res.status(201).json(updateMovie);
        } else {
            res.status(404);
            throw new Error('Movie not found');
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

const deleteMovie = asyncHandler(async (req, res) => {
    try {
        const movie = await Movies.findById(req.params.id);
        if (movie) {
            await movie.deleteOne();
            res.json({ message: "Movie removed" });
        }
        else {
            res.status(404);
            throw new Error("Movie not found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const deleteAllMovies = asyncHandler(async (req, res) => {
    try {
        // delete all movies
        await Movies.deleteMany({});
        res.json({ message: "All movies removed" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const createMovie = asyncHandler(async (req, res) => {
    try {
        const {
            movieTitle,
            hours,
            language,
            year,
            movieDescription,
            movieCategory,
            rate,
            reviews,
            numberOfReviews,
            imageWithTitleValue,
            imageWithThumbnailValue,
        } = req.body;
        const casts = JSON.parse(req.body.casts);
        const file = req.files[0];
        console.log(req.body);
        if (file) {
            const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
            const folderName = 'videos';
            const blob = storage.file(`${folderName}/${fileName}`);

            const blobStream = blob.createWriteStream({
                // resumable: false,
                metadata: {
                    contentType: file.mimetype,
                },
            });

            blobStream.on('error', (error) => {
                res.status(400).json({ message: error.message });
            })
            blobStream.on('finish', () => {
                blob.getSignedUrl({
                    action: 'read',
                    expires: '03-17-2125'
                }).then(async (signedUrls) => {
                    const video = signedUrls[0];
                    const movie = new Movies({
                        movieTitle,
                        hours,
                        language,
                        year,
                        movieDescription,
                        movieCategory,
                        rate,
                        numberOfReviews,
                        imageWithTitleValue,
                        imageWithThumbnailValue,
                        reviews,
                        casts,
                        video,
                        userId: req.user._id
                    });
                    if (movie) {
                        const createMovie = await movie.save();
                        res.status(201).json(createMovie)
                    } else {
                        res.status(400);
                        throw new Error("Invalid movie data");
                    }
                });
            });
            blobStream.end(file.buffer);
        } else {
            res.status(400).json({ message: "Please upload a file" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


export {
    importMovies,
    getMovies,
    getAllMovies,
    getMovieById,
    getTopRatedMovies,
    getRandomMovies,
    getRelatedMovies,
    createMovieReview,
    updateMovie,
    deleteMovie,
    deleteAllMovies,
    createMovie
}