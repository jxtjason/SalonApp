const { Appointment, User } = require('../models');

exports.create = async (req, res) => {
  try {
    const { apprenticeId, service, date } = req.body;
    const appointment = await Appointment.create({
      clientId: req.user.id,
      apprenticeId,
      service,
      date,
      status: 'pending'
    });

    const appointmentWithDetails = await Appointment.findByPk(appointment.id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['name', 'email']
        },
        {
          model: User,
          as: 'apprentice',
          attributes: ['name', 'email']
        }
      ]
    });

    res.status(201).json(appointmentWithDetails);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all appointments (admin dashboard)
exports.getAll = async (req, res) => {
  try {
    const { apprenticeId } = req.query;
    
    let whereClause = {};
    if (apprenticeId) {
      whereClause.apprenticeId = apprenticeId;
    }

    const appointments = await Appointment.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['name', 'email']
        },
        {
          model: User,
          as: 'apprentice',
          attributes: ['name', 'email']
        }
      ],
      order: [['date', 'DESC']]
    });

    res.json(appointments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { clientId: req.user.id },
      include: [
        {
          model: User,
          as: 'apprentice',
          attributes: ['name', 'email']
        }
      ],
      order: [['date', 'DESC']]
    });
    res.json(appointments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getByApprentice = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { apprenticeId: req.user.id },
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['name', 'email']
        }
      ],
      order: [['date', 'DESC']]
    });
    res.json(appointments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.cancel = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.clientId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    appointment.status = 'cancelled';
    await appointment.save();
    res.json({ message: 'Appointment cancelled' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update appointment (admin)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, service, date } = req.body;
    
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointment.update({ status, service, date });
    
    const updatedAppointment = await Appointment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['name', 'email']
        },
        {
          model: User,
          as: 'apprentice',
          attributes: ['name', 'email']
        }
      ]
    });

    res.json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};