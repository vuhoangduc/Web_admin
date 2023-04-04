const express = require('express');
const route = express.Router();

const searchController = require('../controllers/SearchController');

route.get('/',searchController.index);
route.get('/timchitiet/:id',searchController.xemchitiet);


module.exports = route;