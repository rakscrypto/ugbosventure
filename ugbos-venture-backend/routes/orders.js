const express = require('express');
const { createOrder, getUserOrders, getOrder } = require('../controllers/orderController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.route('/')
  .post(createOrder)
  .get(getUserOrders);

router.route('/:id')
  .get(getOrder);

module.exports = router;