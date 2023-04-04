const express = require('express');
const route = express.Router();
const upload = require('../util/upload_file');
const userController = require('../controllers/UserController');
route.post('/check_login',userController.check_login);
route.get('/logout',userController.logout);
route.get('/', userController.index);



route.get('/users',userController.getAllUser);
route.get('/users/:id',userController.getUser);
route.post('/users/addnew',userController.addNew);
route.put('/users/update/:id',upload.single('img_file'),userController.update);
route.delete('/users/delete/:id',userController.delete);



route.get('/users/bins',userController.getBins);
route.patch('/users/bins/restore/:id',userController.restore);
route.delete('/users/bins/realdelete/:id',userController.RealDelete);


route.get('/users/:id',userController.show_users_group);
module.exports = route;