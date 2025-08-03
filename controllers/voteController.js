const { Vote, User } = require('../models');

const voteController = {
  // Vote for best apprentice (for client dashboard)
  create: async (req, res) => {
    try {
      const { apprenticeId } = req.body;
      const clientId = req.user.id;

      // Check if client already voted for this apprentice
      const existingVote = await Vote.findOne({
        where: { clientId, apprenticeId }
      });

      if (existingVote) {
        return res.status(400).json({ message: 'You have already voted for this apprentice' });
      }

      const vote = await Vote.create({
        clientId,
        apprenticeId
      });

      const voteWithDetails = await Vote.findByPk(vote.id, {
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

      res.status(201).json(voteWithDetails);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get votes for an apprentice
  getByApprentice: async (req, res) => {
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
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json({
        totalVotes: votes.length,
        votes: votes.map(vote => ({
          id: vote.id,
          clientName: vote.client.name,
          date: vote.createdAt
        }))
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all votes (admin only)
  getAll: async (req, res) => {
    try {
      const votes = await Vote.findAll({
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

      res.json(votes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update vote (client can update their own)
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { apprenticeId } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      const vote = await Vote.findByPk(id);
      if (!vote) {
        return res.status(404).json({ message: 'Vote not found' });
      }

      // Check if user can update this vote
      if (userRole !== 'admin' && vote.clientId !== userId) {
        return res.status(403).json({ message: 'Not authorized to update this vote' });
      }

      await vote.update({ apprenticeId });
      
      const updatedVote = await Vote.findByPk(id, {
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

      res.json(updatedVote);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete vote (admin only)
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      
      const vote = await Vote.findByPk(id);
      if (!vote) {
        return res.status(404).json({ message: 'Vote not found' });
      }

      await vote.destroy();
      res.json({ message: 'Vote deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = voteController;
