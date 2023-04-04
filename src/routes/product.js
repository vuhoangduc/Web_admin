const express = require('express');
const route = express.Router();
const upload = require('../util/upload_file');
const productController = require('../controllers/ProductController');
route.post('/addNew',upload.single('img_file'),productController.add_new);
route.put('/update/:id',upload.single('img_file'),productController.update);
route.delete('/delete/:id',upload.single('img_file'),productController.delete);
route.get('/bins',productController.getBins);
route.patch('/bins/restore/:id',productController.Restore);
route.delete('/bins/realDelete/:id',productController.RealDelete);


route.get('/xemchitiet/:id',productController.show_products_chitiet);
route.get('/sapxep/:slug',productController.show_products_sapxep);
route.get('/:id',productController.show_products_category);
route.get('/',productController.show_products);
module.exports = route;
