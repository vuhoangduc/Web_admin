const product = require('../models/Product');
const category = require('../models/Category');
const productSchema = require('../models/ProductSchema');
const api_url = require('../public/Api_url');
const { muntipleMongooseToObject } = require('../util/mongoose');
const { mongooseToObject } = require('../util/mongoose');
const fs = require('fs');
class ProductController {
  // [GET] /products
  async show_products(req, res, next) {
    try {
      // if(!req.session.user){
      //   return res.redirect('/');
      // }

      if (req.headers.accept === 'application/json, text/plain, */*') {
        const products = await productSchema.find({});
        return res.status(200).send({ products });
      }
      const PAGE_SIZE = 5; // Số sản phẩm hiển thị trên một trang
      const currentPage = Number(req.query.page) || 1; // Trang hiện tại được yêu cầu

      // Tính tổng số lượng sản phẩm hiện có
      const totalProducts = await productSchema.countDocuments();
      // Tổng số trang
      const totalPages = Math.ceil(totalProducts / PAGE_SIZE);
      // Lấy danh sách sản phẩm theo trang
      const products = await productSchema.find({})
        .populate('_id_category', 'name_category')
        .skip((currentPage - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE);

      const categoryes = await category.find({});

      const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
      const acceptHeader = req.headers.accept;
      if (acceptHeader === 'application/json') {
        // Trả về JSON
        const products = await productSchema.find({})
        return res.json({
          products: muntipleMongooseToObject(products),
        });
      } else {
        // Trả về HTML
        return res.render('products', {
          products: muntipleMongooseToObject(products),
          categoryes: muntipleMongooseToObject(categoryes),
          currentPage: currentPage,
          hasNextPage: PAGE_SIZE * Number(currentPage) < totalProducts,
          hasPreviousPage: Number(currentPage) > 1,
          nextPage: Number(currentPage) + 1,
          previousPage: Number(currentPage) - 1,
          lastPage: Math.ceil(totalProducts / PAGE_SIZE),
          pages,
          value: 'Thứ tự hiển thị'
        });
      }

    } catch (error) {
      next(error);
    }
  }



  // [GET] /products/id_category
  async show_products_category(req, res, next) {
    try {
      const categoryId = req.params.id;
      // if(!req.session.user){
      //     return res.redirect('/');
      //   }
      const PAGE_SIZE = 5; // Số sản phẩm hiển thị trên một trang
      const currentPage = Number(req.query.page) || 1; // Trang hiện tại được yêu cầu
      // Tính tổng số lượng sản phẩm hiện có
      const totalProducts = await productSchema.find({ _id_category: categoryId }).countDocuments();
      // Tổng số trang
      const totalPages = Math.ceil(totalProducts / PAGE_SIZE);
      // Lấy danh sách sản phẩm theo trang
      const products = await productSchema.find({ _id_category: categoryId })
        .populate('_id_category', 'name_category')
        .skip((currentPage - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE);

      const categoryes = await category.find({});
      const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
      console.log(currentPage);
      res.render('products', {

        products: muntipleMongooseToObject(products),
        categoryes: muntipleMongooseToObject(categoryes),
        currentPage: Number(currentPage),
        hasNextPage: PAGE_SIZE * Number(currentPage) < totalProducts,
        hasPreviousPage: Number(currentPage) > 1,
        nextPage: Number(currentPage) + 1,
        previousPage: Number(currentPage) - 1,
        lastPage: Math.ceil(totalProducts / PAGE_SIZE),
        pages,
        PAGE_SIZE
      });
    } catch (error) {
      next(error);
    }
  }
  // [GET] products/sapxep
  async show_products_sapxep(req, res, next) {
    const slug = req.params.slug;
    console.log(slug);
    const PAGE_SIZE = 5; // Số sản phẩm hiển thị trên một trang
    const currentPage = req.query.page || 1;
    const totalProducts = await productSchema.find({}).countDocuments();
    // Tổng số trang
    const totalPages = Math.ceil(totalProducts / PAGE_SIZE);
    // Lấy danh sách sản phẩm theo trang
    const categoryes = await category.find({});
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    switch (slug) {
      case 'high-to-low':
        const products_v1 = await productSchema.find({})
          .sort({ price: -1 })
          .populate('_id_category', 'name_category')
          .skip((currentPage - 1) * PAGE_SIZE)
          .limit(PAGE_SIZE);



        res.render('products', {
          products: muntipleMongooseToObject(products_v1),
          categoryes: muntipleMongooseToObject(categoryes),
          value: 'giá cao đến thấp',
          currentPage: Number(currentPage),
          hasNextPage: PAGE_SIZE * Number(currentPage) < totalProducts,
          hasPreviousPage: Number(currentPage) > 1,
          nextPage: Number(currentPage) + 1,
          previousPage: Number(currentPage) - 1,
          lastPage: Math.ceil(totalProducts / PAGE_SIZE),
          pages,
          PAGE_SIZE
        })
        break;
      case 'newest':

        res.render('products');
        break;
      case 'low-to-high':
        const products_v2 = await productSchema.find({})
          .sort({ price: 1 })
          .populate('_id_category', 'name_category')
          .skip((currentPage - 1) * PAGE_SIZE)
          .limit(PAGE_SIZE);
        res.render('products', {
          products: muntipleMongooseToObject(products_v2),
          categoryes: muntipleMongooseToObject(categoryes),
          value: 'giá thấp đến cao',
          currentPage: Number(currentPage),
          hasNextPage: PAGE_SIZE * Number(currentPage) < totalProducts,
          hasPreviousPage: Number(currentPage) > 1,
          nextPage: Number(currentPage) + 1,
          previousPage: Number(currentPage) - 1,
          lastPage: Math.ceil(totalProducts / PAGE_SIZE),
          pages,
          PAGE_SIZE
        })
        break;
      default:
        break;
    }
  }


  // [POST] /products/addNew
  add_new(req, res, next) {
    const data_v1 = req.body;
    fs.rename(req.file.path, 'uploads/' + req.file.originalname, function (err) {
      const link = '/uploads/' + req.file.originalname;
      const url = api_url.API_URL + link;
      const data = {
        name_product: data_v1.name,
        _id_category: data_v1.group,
        img_url: url,
        content: data_v1.content,
        price: data_v1.price,
        status: data_v1.status,
        quantity: data_v1.quantity
      }
      const product_v1 = new productSchema(data);
      product_v1.save()
        .then(() => res.redirect('/products'));

    })
  }
  // [PUT] /products/update
  update(req, res, next) {
    const data_v1 = req.body;
    if (req.file === undefined) {
      const data = {
        name_product: data_v1.name,
        _id_category: data_v1.group,
        content: data_v1.content,
        price: data_v1.price,
        status: data_v1.status,
        quantity: data_v1.quantity
      }
      productSchema.updateOne({ _id: req.params.id }, { $set: data })
        .then(() => res.redirect('back'));
    } else {
      fs.rename(req.file.path, 'uploads/' + req.file.originalname, function (err) {
        const link = '/uploads/' + req.file.originalname;
        const url = api_url.API_URL + link;
        const data = {
          name_product: data_v1.name,
          _id_category: data_v1.group,
          img_url: url,
          content: data_v1.content,
          price: data_v1.price,
          status: data_v1.status,
          quantity: data_v1.quantity
        }
        console.log(data);
        productSchema.updateOne({ _id: req.params.id }, { $set: data })
          .then(() => res.redirect('back'));
      })
    }


  }
  // [DELETE] /products/delete
  delete(req, res, next) {
    const data = req.body;
    productSchema.delete({ _id: req.params.id })
      .then(() => res.redirect('back'));
  }

  // [GET] /products/bins
  getBins(req, res, next) {
    productSchema.findDeleted({})
      .populate('_id_category', 'name_category') // thêm populate() để kết hợp thông tin từ bảng category vào kết quả truy vấn của product
      .then(function (products) {
        category.find({})
          .then(function (categoryes) {
            res.render('bins', {
              products: muntipleMongooseToObject(products),
              categoryes: muntipleMongooseToObject(categoryes)
            });
          });
      })
      .catch(next);
  }


  // [PATCH] /products/bins/restore
  Restore(req, res, next) {
    const productId = req.params.id;
    productSchema.restore({ _id: productId })
      .then(() => res.redirect('back'))
      .catch(next);
  }
  RealDelete(req, res, next) {
    const productId = req.params.id;
    productSchema.deleteOne({ _id: productId })
      .then(() => res.redirect('back'))
      .catch(next);
  }

  async show_products_chitiet(req, res, next) {
    const productId = req.params.id;
    const products = await productSchema.findOne({ _id: productId })
    res.render('xemchitiet', {
      name: products.name_product,
      img: products.img_url,
      content: products.content,
      price: products.price
    });
  }
}



module.exports = new ProductController;