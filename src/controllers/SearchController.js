const user = require('../models/User');
const group = require('../models/Group');
const category = require('../models/Category');
const productSchema = require('../models/ProductSchema');
const { muntipleMongooseToObject } = require('../util/mongoose');

class SearchController {
    async index(req, res, next) {
        const products = await productSchema.find({})
        const groups = await group.find({})
        const categorys = await category.find({})
        const users = await user.find({})
        return res.json({
            products: muntipleMongooseToObject(products),
            groups: muntipleMongooseToObject(groups),
            categorys: muntipleMongooseToObject(categorys),
            users: muntipleMongooseToObject(users),
        });
    }

    async xemchitiet(req, res, next) {
        const _id = req.params.id;
        console.log(_id);
        const users = await user.findOne({ _id: _id })
        const products = await productSchema.findOne({ _id: _id })
        if (!users) {
            console.log(products);
            res.render('xemchitiet', {
                name: products.name_product,
                img: products.img_url,
                content: products.content,
                price: products.price
            });
        } else {
            console.log(users);
            res.render('xemchitiet_user', {
                name: users.user_name,
                img: users.img_url,
            });
        }
    }
}

module.exports = new SearchController;