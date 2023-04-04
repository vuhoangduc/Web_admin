const express = require('express');
const route = express.Router();
const groupController = require('../controllers/GroupController');

route.get('/',groupController.index);
route.post('/addnew',groupController.addNew);

module.exports = route;