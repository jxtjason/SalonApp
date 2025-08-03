const { Order, Product, User } = require('../models');

const orderController = {
  // Create an order (for client dashboard)
  create: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const clientId = req.user.id;

      // Get product details
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Check if product is available
      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }

      const totalAmount = product.price * quantity;

      const order = await Order.create({
        clientId,
        productId,
        quantity,
        totalAmount,
        status: 'pending'
      });

      // Update product stock
      await product.update({ stock: product.stock - quantity });

      const orderWithDetails = await Order.findByPk(order.id, {
        include: [
          {
            model: Product,
            attributes: ['name', 'price', 'description']
          },
          {
            model: User,
            as: 'client',
            attributes: ['name', 'email']
          }
        ]
      });

      res.status(201).json(orderWithDetails);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get orders for a client
  getByClient: async (req, res) => {
    try {
      const clientId = req.user.id;
      
      const orders = await Order.findAll({
        where: { clientId },
        include: [
          {
            model: Product,
            attributes: ['name', 'price', 'description', 'image']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all orders (admin only)
  getAll: async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: Product,
            attributes: ['name', 'price', 'description']
          },
          {
            model: User,
            as: 'client',
            attributes: ['name', 'email']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update order status (admin only)
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      await order.update({ status });
      
      const updatedOrder = await Order.findByPk(id, {
        include: [
          {
            model: Product,
            attributes: ['name', 'price', 'description']
          },
          {
            model: User,
            as: 'client',
            attributes: ['name', 'email']
          }
        ]
      });

      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Cancel order (client can cancel their own)
  cancel: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      const order = await Order.findByPk(id, {
        include: [{ model: Product }]
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Check if user can cancel this order
      if (userRole !== 'admin' && order.clientId !== userId) {
        return res.status(403).json({ message: 'Not authorized to cancel this order' });
      }

      // Only allow cancellation if order is pending
      if (order.status !== 'pending') {
        return res.status(400).json({ message: 'Order cannot be cancelled' });
      }

      // Restore product stock
      await order.Product.update({ 
        stock: order.Product.stock + order.quantity 
      });

      await order.update({ status: 'cancelled' });

      res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = orderController;
