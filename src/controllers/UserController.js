const user = require('../models/User');
const group = require('../models/Group');
const api_url = require('../public/Api_url');
const fs = require('fs');
const { muntipleMongooseToObject } = require('../util/mongoose');
class UserController {

  index(req, res, next) {
    res.render('login');
  }
  check_login(req, res, next) {
    const data = req.body;
    console.log(data);
    user.findOne({ email: data.email })
      .then(result => {
        console.log(result);
        const acceptHeader = req.headers['accept'];
        if (acceptHeader === 'application/json, text/plain, */*') {
          if (!result) {
            res.status(400).send({ message: 'email chưa tồn tại' });
          } else {
            if (result.pass != data.password) {
              res.status(404).send({ message: 'mật khẩu chưa đúng!!' });
            }else{
              res.status(200).send({ message: 'đăng nhập thành công',result});
            }
          }
        }
        else {
          if (!result) {
            console.log('email không tồn tại');
            res.render('login', {
              err: 'email không tồn tại'
            });
          } else {
            if (result.pass === data.pass) {
              if (result.group === "Admin") {
                req.session.user = {
                  email: data.email,
                  isLoggedIn: true
                };
                res.redirect('/home');
              } else {
                console.log('ko co quyen truy cap');
                res.render('login', {
                  err: 'ko co quyen truy cap'
                });
              }
            } else {
              res.render('login', {
                err: 'Sai pass!!!'
              });
            }
          }
        }
      })

  }

  logout(req, res, next) {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  }

  async getAllUser(req, res, next) {

    try {
      const PAGE_SIZE = 5; // Số sản phẩm hiển thị trên một trang
      const currentPage = Number(req.query.page) || 1; // Trang hiện tại được yêu cầu

      // Tính tổng số lượng sản phẩm hiện có
      const totalProducts = await user.countDocuments();
      // Tổng số trang
      const totalPages = Math.ceil(totalProducts / PAGE_SIZE);
      const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
      const users = await user.find({})
        .populate('_id_group', 'name_group')
        .skip((currentPage - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE);

      const groups = await group.find({});
      res.render('users', {
        users: muntipleMongooseToObject(users),
        groups: muntipleMongooseToObject(groups),
        currentPage: currentPage,
        hasNextPage: PAGE_SIZE * Number(currentPage) < totalProducts,
        hasPreviousPage: Number(currentPage) > 1,
        nextPage: Number(currentPage) + 1,
        previousPage: Number(currentPage) - 1,
        lastPage: Math.ceil(totalProducts / PAGE_SIZE),
        pages,
      })
    } catch (error) {
      next(error);
    }
  }

  async getUser(req,res,next){
    const _id = req.params.id;
    const data_user = await user.findOne({_id:_id});
    res.status(200).send({data_user});
  }

  addNew(req, res, next) {
    const data_v1 = req.body;
    console.log(data_v1);
    let url = 'http://192.168.1.4:3000/uploads/avatar_url.png';
    user.findOne({ email: data_v1.email })
      .then(result => {
        if (result) {
          res.status(400).send({ message: 'email đã tồn tại!' });
        } else {
          const acceptHeader = req.headers['accept'];
          if (acceptHeader === 'application/json, text/plain, */*') {
            // Trả về client mobile app
            const data = {
              email: data_v1.email,
              pass: data_v1.password,
              user_name: data_v1.username,
              img_url: url,
              _id_group: '6412c9f2b9e0697f5807c7f2',
            }
            const user_v1 = new user(data);
            user_v1.save()
              .then(result => {
                res.status(200).send({ message: 'tạo tài khoản thành công' });
              })
          } else {
            // Trả về HTML
            const data = {
              email: data_v1.email,
              pass: data_v1.pass,
              user_name: data_v1.username,
              img_url: url,
              _id_group: data_v1.group,
              status: data_v1.status
            }
            const user_v1 = new user(data);
            user_v1.save()
              .then(() => res.redirect('/users'));
          }
        }
      })
  }

  update(req, res, next) {
    const data_v1 = req.body;
    if (req.file === undefined) {
      const data = {
        email: data_v1.email,
        user_name: data_v1.username,
        _id_group: data_v1.group,
        status: data_v1.status
      }
      user.updateOne({ _id: req.params.id }, { $set: data })
        .then(() => res.redirect('back'));
    } else {
      fs.rename(req.file.path, 'uploads/' + req.file.originalname, function (err) {
        const link = '/uploads/' + req.file.originalname;
        const url = api_url.API_URL + link;
        const data = {
          email: data_v1.email,
          user_name: data_v1.username,
          img_url: url,
          _id_group: data_v1.group,
          status: data_v1.status
        }
        user.updateOne({ _id: req.params.id }, { $set: data })
          .then(() => res.redirect('back'));
      })
    }
  }


  delete(req, res, next) {
    const data = req.body;
    console.log(req.params.id);
    user.delete({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next)
  }



  async getBins(req, res, next) {

    try {
      const users = await user.findDeleted({})
        .populate('_id_group', 'name_group')

      const groups = await group.find({});
      res.render('binsUser', {
        users: muntipleMongooseToObject(users),
        groups: muntipleMongooseToObject(groups)
      })
    } catch (error) {
      next(error);
    }
  }

  restore(req, res, next) {
    const userId = req.params.id;
    user.restore({ _id: userId })
      .then(() => res.redirect('back'))
      .catch(next);
  }
  RealDelete(req, res, next) {
    const userId = req.params.id;
    user.deleteOne({ _id: userId })
      .then(() => res.redirect('back'))
      .catch(next);
  }


  async show_users_group(req, res, next) {

    try {
      const groupId = req.params.id;
      const users = await user.find({ _id_group: groupId })
        .populate('_id_group', 'name_group')

      const groups = await group.find({});
      res.render('users', {
        users: muntipleMongooseToObject(users),
        groups: muntipleMongooseToObject(groups)
      })
    } catch (error) {
      next(error);
    }
  }


}

module.exports = new UserController;