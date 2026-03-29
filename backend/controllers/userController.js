const User = require('../models/User');
const Appointment = require('../models/Appointment');

exports.getApprentices = async (req, res) => {
  try {
    const apprentices = await User.findAll({ where: { role: 'apprentice' } });
    res.json(apprentices);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.assignBooking = async (req, res) => {
  try {
    const { appointmentId, apprenticeId } = req.body;
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    appointment.apprenticeId = apprenticeId;
    await appointment.save();
    res.json({ message: 'Booking assigned', appointment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 