const { User, Review, Vote } = require('../models');

const apprenticeController = {
  // Get all apprentices (for client dashboard)
  getAll: async (req, res) => {
    try {
      const apprentices = await User.findAll({
        where: { role: 'apprentice' },
        attributes: ['id', 'name', 'email', 'createdAt'],
        include: [
          {
            model: Review,
            attributes: ['rating', 'comment', 'createdAt'],
            include: [
              {
                model: User,
                as: 'client',
                attributes: ['name']
              }
            ]
          },
          {
            model: Vote,
            attributes: ['id']
          }
        ]
      });

      // Calculate average ratings and vote counts
      const apprenticesWithStats = apprentices.map(apprentice => {
        const reviews = apprentice.Reviews || [];
        const votes = apprentice.Votes || [];
        
        const avgRating = reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
          : 0;
        
        return {
          ...apprentice.toJSON(),
          avgRating: Math.round(avgRating * 10) / 10,
          totalReviews: reviews.length,
          totalVotes: votes.length,
          specialties: ['Hair Washing', 'Hair Styling', 'Hair Dyeing'] // Mock data
        };
      });

      res.json(apprenticesWithStats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get apprentice ratings
  getRatings: async (req, res) => {
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

      const ratings = reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        clientName: review.client.name,
        date: review.createdAt
      }));

      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;

      res.json({
        ratings,
        avgRating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get apprentice votes
  getVotes: async (req, res) => {
    try {
      const { apprenticeId } = req.params;
      
      const votes = await Vote.findAll({
        where: { apprenticeId },
        include: [
          {
            model: User,
            as: 'client',
            attributes: ['name']
          }
        ]
      });

      res.json({
        votes: votes.length,
        voters: votes.map(vote => vote.client.name)
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create apprentice (admin only)
  create: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      const apprentice = await User.create({
        name,
        email,
        password,
        role: 'apprentice'
      });

      res.status(201).json({
        id: apprentice.id,
        name: apprentice.name,
        email: apprentice.email,
        role: apprentice.role
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update apprentice (admin only)
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email } = req.body;
      
      const apprentice = await User.findByPk(id);
      if (!apprentice || apprentice.role !== 'apprentice') {
        return res.status(404).json({ message: 'Apprentice not found' });
      }

      await apprentice.update({ name, email });
      
      res.json({
        id: apprentice.id,
        name: apprentice.name,
        email: apprentice.email,
        role: apprentice.role
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete apprentice (admin only)
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      
      const apprentice = await User.findByPk(id);
      if (!apprentice || apprentice.role !== 'apprentice') {
        return res.status(404).json({ message: 'Apprentice not found' });
      }

      await apprentice.destroy();
      res.json({ message: 'Apprentice deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = apprenticeController;
