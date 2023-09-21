import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
    {
        userName: { type: String, required: true },
        userImage: { type: String },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const moviesSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        movieTitle: {
            type: String,
            // required: true
        },
        movieDescription: {
            type: String,
            // required: true
        },
        movieCategory: {
            type: String,
            // required: true
        },
        imageWithTitleValue: {
            type: String,
            // required: true
        },
        imageWithThumbnailValue: {
            type: String,
            // required: true
        },
        language: {
            type: String,
            // required: true
        },
        year: {
            type: String,
            // required: true
        },
        hours: {
            type: String,
            // required: true
        },
        video: {
            type: String,
            // required: true
        },
        rate: {
            type: String,
            required: true,
            default: 0
        },
        numberOfReviews: {
            type: String,
            required: true,
            default: 0
        },
        ////////////////////////////////////////////////////////
        reviews: {
            type: Array,
            default: [1, 3],
            required: false,
            reviews: [reviewSchema]
        },
        casts: [
            {
                nameCast: {
                    type: String,
                    required: true
                },
                imgCast: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Movies', moviesSchema);