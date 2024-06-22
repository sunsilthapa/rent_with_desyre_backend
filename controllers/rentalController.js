
const Rental = require('../model/rentalModel');
const Cloth = require('../model/clothModel');

// Create Rental Request
exports.createRental = async (req, res) => {
  try {
    const { clothId, startDate, endDate } = req.body;
    const cloth = await Cloth.findById(clothId);
    if (!cloth) return res.status(404).json({ message: 'Cloth not found' });

    const rental = new Rental({
      clothId,
      renterId: req.user.userId,
      ownerId: cloth.ownerId,
      startDate,
      endDate
    });
    await rental.save();
    res.status(201).json(rental);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Rentals
exports.getRentals = async (req, res) => {
  try {
    const rentals = await Rental.find().populate('clothId renterId ownerId');
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Specific Rental
exports.getRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id).populate('clothId renterId ownerId');
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    res.json(rental);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Rental Status
exports.updateRental = async (req, res) => {
  try {
    const { status } = req.body;
    const rental = await Rental.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    res.json(rental);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Rental
exports.deleteRental = async (req, res) => {
  try {
    const rental = await Rental.findByIdAndDelete(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    res.json({ message: 'Rental deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
