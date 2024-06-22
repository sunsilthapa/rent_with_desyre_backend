const Favorite = require('../model/favoriteModel');

// Add to Favorites
exports.addToFavorites = async (req, res) => {
  try {
    const favorite = new Favorite({
      userId: req.user.userId,
      clothId: req.body.clothId
    });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User Favorites
exports.getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.userId }).populate('clothId');
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove from Favorites
exports.removeFromFavorites = async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ userId: req.user.userId, clothId: req.params.clothId });
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
