const { Review, User } = require('../models');

const reviewController = {
  // Create a review (for client dashboard)
  create: async (req, res) => {
    try {
      const { apprenticeId, rating, comment } = req.body;
      const clientId = req.user.id;

      // Check if client already reviewed this apprentice
      const existingReview = await Review.findOne({
        where: { clientId, apprenticeId }
      });

      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this apprentice' });
      }

      const review = await Review.create({
        clientId,
        apprenticeId,
        rating,
        comment
      });

      const reviewWithDetails = await Review.findByPk(review.id, {
        include: [
          {
            model: User,
            as: 'client',
            attributes: ['name']
          },
          {
            model: User,
            as: 'apprentice',
            attributes: ['name']
          }
        ]
      });

      res.status(201).json(reviewWithDetails);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get reviews for an apprentice
  getByApprentice: async (req, res) => {
    try {
      const { apprenticeId } = req.params;
      
      const reviews = await Review.findAll({
        where: { apprenticeId },
        include: [
          {
            model: User,
            as: 'client',
            attributes: ['name']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all reviews (admin only)
  getAll: async (req, res) => {
    try {
      const reviews = await Review.findAll({
        include: [
          {
            model: User,
            as: 'client',
            attributes: ['name']
          },
          {
            model: User,
            as: 'apprentice',
            attributes: ['name']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update review (client can update their own)
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      const review = await Review.findByPk(id);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      // Check if user can update this review
      if (userRole !== 'admin' && review.clientId !== userId) {
        return res.status(403).json({ message: 'Not authorized to update this review' });
      }

      await review.update({ rating, comment });
      
      const updatedReview = await Review.findByPk(id, {
        include: [
          {
            model: User,
            as: 'client',
            attributes: ['name']
          },
          {
            model: User,
            as: 'apprentice',
            attributes: ['name']
          }
        ]
      });

      res.json(updatedReview);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete review (admin only)
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      
      const review = await Review.findByPk(id);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      await review.destroy();
      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = reviewController;
