const Cloth = require("../model/clothModel");
// const multer = require('multer');

// // Configure Multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });
// const upload = multer({ storage });

// // Upload Cloth
// const uploadCloth = [
//   upload.array('images', 5), // Limit to 5 images
//   async (req, res) => {
//     try {
//       const cloth = new Cloth({
//         ...req.body,
//         ownerId: req.user.userId,
//         images: req.files.map(file => file.path)
//       });
//       await cloth.save();
//       res.status(201).json(cloth);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// ];

// Get All Clothes
const getClothes = async (req, res) => {
  try {
    const clothes = await Cloth.find();
    res.json(clothes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Specific Cloth
const getCloth = async (req, res) => {
  try {
    const cloth = await Cloth.findById(req.params.id);
    if (!cloth) return res.status(404).json({ message: "Cloth not found" });
    res.json(cloth);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Cloth
const updateCloth = async (req, res) => {
  try {
    const cloth = await Cloth.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!cloth) return res.status(404).json({ message: "Cloth not found" });
    res.json(cloth);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Cloth
const deleteCloth = async (req, res) => {
  try {
    const cloth = await Cloth.findByIdAndDelete(req.params.id);
    if (!cloth) return res.status(404).json({ message: "Cloth not found" });
    res.json({ message: "Cloth deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getClothes,
  getCloth,
  updateCloth,
  deleteCloth,
};
