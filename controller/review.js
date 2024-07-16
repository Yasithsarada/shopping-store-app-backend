const mongoose = require('mongoose');
const Product = require('../model/product.model');
const Review = require('../model/reviews');
const User = require('../model/user.model');

// Function to create a new review
exports.createReview = async (req, res) => {
  const { productId, userId, rating, comment } = req.body;

  try {
    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }

    // Create the review
    const newReview = new Review({
      productId: productId,
      userId: userId,
      rating: rating,
      comment: comment
    });

    // Save the review
    await newReview.save();

    // Calculate new average rating for the product
    const reviews = await Review.find({ productId: productId });
    reviews.map((review) => console.log("review.rating : " , review.rating));

   
    const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
    let averageRating = (totalRatings +  5.0) / (reviews.length + 1);

    if(averageRating > 5.0) averageRating = 5.0;
    console.log("average rating: " , averageRating)

    // Update the product's averageRating
    product.averageRating = averageRating;
    await product.save();

    // Respond with success message or updated review
    res.status(201).json({ message: 'Review created successfully', review: newReview });
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ error: 'Server error' });
  }
};