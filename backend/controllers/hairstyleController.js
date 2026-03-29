const { Hairstyle } = require('../models');

// Get all hairstyles
const getAllHairstyles = async (req, res) => {
  try {
    const hairstyles = await Hairstyle.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });
    res.json(hairstyles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get hairstyle by ID
const getHairstyleById = async (req, res) => {
  try {
    const hairstyle = await Hairstyle.findByPk(req.params.id);
    if (!hairstyle) {
      return res.status(404).json({ error: 'Hairstyle not found' });
    }
    res.json(hairstyle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new hairstyle (Admin only)
const createHairstyle = async (req, res) => {
  try {
    const { name, description, imageUrl, category, difficulty, estimatedTime } = req.body;
    
    const hairstyle = await Hairstyle.create({
      name,
      description,
      imageUrl,
      category,
      difficulty,
      estimatedTime
    });
    
    res.status(201).json(hairstyle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update hairstyle (Admin only)
const updateHairstyle = async (req, res) => {
  try {
    const hairstyle = await Hairstyle.findByPk(req.params.id);
    if (!hairstyle) {
      return res.status(404).json({ error: 'Hairstyle not found' });
    }
    
    await hairstyle.update(req.body);
    res.json(hairstyle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete hairstyle (Admin only) - soft delete
const deleteHairstyle = async (req, res) => {
  try {
    const hairstyle = await Hairstyle.findByPk(req.params.id);
    if (!hairstyle) {
      return res.status(404).json({ error: 'Hairstyle not found' });
    }
    
    await hairstyle.update({ isActive: false });
    res.json({ message: 'Hairstyle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get hairstyles by category
const getHairstylesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const hairstyles = await Hairstyle.findAll({
      where: { 
        category,
        isActive: true 
      },
      order: [['createdAt', 'DESC']]
    });
    res.json(hairstyles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllHairstyles,
  getHairstyleById,
  createHairstyle,
  updateHairstyle,
  deleteHairstyle,
  getHairstylesByCategory
};
