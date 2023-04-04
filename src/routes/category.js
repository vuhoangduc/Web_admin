const express = require('express');
const route = express.Router();
const upload = require('../util/upload_file');
const categoryController = require('../controllers/CategoryController');
route.get('/',categoryController.get_all_category);
route.get('/bins',categoryController.getBins);
route.post('/addnew',upload.single('img_file1'),categoryController.add_new);
route.put('/update/:id',upload.single('img_file1'),categoryController.update);
route.delete('/delete/:id',upload.single('img_file'),categoryController.delete);
route.patch('/bins/restore/:id',categoryController.Restore);
route.delete('/bins/realDelete/:id',upload.single('img_file'),categoryController.RealDelete);

module.exports = route;
