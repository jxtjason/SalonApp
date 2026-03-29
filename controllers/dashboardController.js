const { User, Appointment, Order, Product } = require('../models');

// Get dashboard stats
exports.getStats = async (req, res) => {
  try {
    const stats = {
      totalAppointments: await Appointment.count(),
      todayAppointments: await Appointment.count({
        where: {
          date: {
            [require('sequelize').Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
            [require('sequelize').Op.lt]: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }),
      totalUsers: await User.count(),
      totalApprentices: await User.count({ where: { role: 'apprentice' } }),
      totalClients: await User.count({ where: { role: 'client' } }),
      totalOrders: await Order.count(),
      pendingAppointments: await Appointment.count({ where: { status: 'pending' } }),
      confirmedAppointments: await Appointment.count({ where: { status: 'confirmed' } }),
    };

    res.json({ 
      success: true, 
      data: stats 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get revenue stats
exports.getRevenueStats = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    let startDate;
    const endDate = new Date();
    
    switch (period) {
      case 'day':
        startDate = new Date(new Date().setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(new Date().setDate(new Date().getDate() - 7));
        break;
      case 'month':
        startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
        break;
      default:
        startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    }

    const orders = await Order.findAll({
      where: {
        createdAt: {
          [require('sequelize').Op.gte]: startDate,
          [require('sequelize').Op.lte]: endDate
        }
      },
      include: [{ model: Product, attributes: ['price'] }]
    });

    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (order.Product ? order.Product.price : 0);
    }, 0);

    res.json({ 
      success: true, 
      data: {
        period,
        totalRevenue,
        orderCount: orders.length,
        startDate,
        endDate
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
