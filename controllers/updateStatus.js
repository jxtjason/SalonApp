// Update appointment status (admin)
const { Appointment, User } = require('../models');

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'declined', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const appointment = await Appointment.findByPk(id, {
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

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Update the status
    appointment.status = status;
    await appointment.save();

    // TODO: Send notification to client about status change

    res.json({
      message: `Appointment ${status} successfully`,
      appointment
    });
  } catch (err) {
    console.error('Error updating appointment status:', err);
    res.status(500).json({ error: 'Failed to update appointment status' });
  }
};
