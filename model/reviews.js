const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    productId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
     },
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
     },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String 
    },
  }

  // averageRating :{
  //   type: Number,
  // }
);

const Review = mongoose.model("Reviews", reviewSchema);

module.exports = Review;
