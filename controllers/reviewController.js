const Review = require('../model/reviewModel');

// Submit Review
exports.submitReview = async (req, res) => {
  try {
    const { clothId, rating, comment } = req.body;
    const review = new Review({
      userId: req.user.userId,
      clothId,
      rating,
      comment
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('userId clothId');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Specific Review
exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('userId clothId');
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Review
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findByIdAndUpdate(req.params.id, { rating, comment }, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
