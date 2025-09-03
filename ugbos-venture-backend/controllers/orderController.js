const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;
    
    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    
    res.status(200).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};