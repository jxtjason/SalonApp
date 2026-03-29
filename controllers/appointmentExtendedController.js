const { Appointment, User } = require('../models');

// Get today's appointments
exports.getTodayAppointments = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const appointments = await Appointment.findAll({
      where: {
        date: {
          [require('sequelize').Op.gte]: startOfDay,
          [require('sequelize').Op.lte]: endOfDay
        }
      },
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'apprentice',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['date', 'ASC']]
    });

    res.json({ 
      success: true, 
      data: appointments 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get upcoming appointments
exports.getUpcomingAppointments = async (req, res) => {
  try {
    const now = new Date();
    
    const appointments = await Appointment.findAll({
      where: {
        date: {
          [require('sequelize').Op.gte]: now
        },
        status: ['pending', 'confirmed']
      },
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'apprentice',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['date', 'ASC']],
      limit: 50
    });

    res.json({ 
      success: true, 
      data: appointments 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
