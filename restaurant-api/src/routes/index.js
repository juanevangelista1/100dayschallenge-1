const { Router } = require('express');
const ProductController = require('../controllers/ProductController');
const TableController = require('../controllers/TableController');
const OrderController = require('../controllers/OrderController');

const routes = Router();

routes.get('/products', ProductController.index);
routes.post('/products', ProductController.create);
routes.put('/products/:id', ProductController.update);
routes.delete('/products/:id', ProductController.delete);

routes.get('/tables', TableController.index);
routes.post('/tables', TableController.create);
routes.put('/tables/:id', TableController.update);
routes.delete('/tables/:id', TableController.delete);

routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.create);
routes.put('/orders/:id/status', OrderController.updateStatus);
routes.get('/orders/:id', OrderController.show);

module.exports = routes;
