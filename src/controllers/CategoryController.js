const category = require('../models/Category');
const {muntipleMongooseToObject} = require('../util/mongoose');
const fs = require('fs');
const api_url = require('../public/Api_url');
class CategoryController {

    async get_all_category(req, res, next) {
        if (req.headers.accept === 'application/json, text/plain, */*') {
            const categorys = await category.find({});
            return res.status(200).send({ categorys });
        }
    
        const PAGE_SIZE = 5;
        const currentPage = req.query.page || 1;
        const totalProducts = await category.find({}).countDocuments();
        const totalPages = Math.ceil(totalProducts / PAGE_SIZE);
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    
        category
            .find({})
            .skip((currentPage - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .then(function (categorys) {
                res.render('categorys', {
                    categorys: muntipleMongooseToObject(categorys),
                    currentPage: currentPage,
                    hasNextPage: PAGE_SIZE * Number(currentPage) < totalProducts,
                    hasPreviousPage: Number(currentPage) > 1,
                    nextPage: Number(currentPage) + 1,
                    previousPage: Number(currentPage) - 1,
                    lastPage: Math.ceil(totalProducts / PAGE_SIZE),
                    pages,
                });
            })
            .catch(next); // Handle any errors that might occur
    }

    getBins(req,res,next){
        category.findDeleted({})
        .then(function(categorys) {
            console.log(categorys);
            res.render('binsCategory',{
                categorys:muntipleMongooseToObject(categorys)
            })
        })
    }

    add_new(req,res,next){
        const data_v1 = req.body;

        fs.rename(req.file.path, 'uploads/' + req.file.originalname, function(err) {
            const link = '/uploads/' + req.file.originalname;
            const url = api_url.API_URL + link;
            const data={
                name_category:data_v1.name_category,
                img_url:url,
            }
            const category_v1 = new category(data);
            category_v1.save()
            .then(() => res.redirect('/categorys'));
        })
    }
    update(req,res,next){
        const data_v1 = req.body;
        if(req.file===undefined){
            const data={
                name_category:data_v1.name_category,
            }
            category.updateOne({ _id: req.params.id },{$set:data})
            .then(() => res.redirect('back'));
        }else{
            fs.rename(req.file.path, 'uploads/' + req.file.originalname, function(err) {
                const link = '/uploads/' + req.file.originalname;
                const url = api_url.API_URL + link;
                const data={
                    name_category:data_v1.name_category,
                    img_url:url,
                }
                category.updateOne({ _id: req.params.id },{$set:data})
                .then(() => res.redirect('back'));
            })
        }
    }

    delete(req,res,next){
        const data = req.body;  
        category.delete({ _id: req.params.id })
        .then(() => res.redirect('back'));
    }

    Restore(req,res,next){
        const categoryId = req.params.id;
        category.restore({ _id: categoryId })
        .then(() => res.redirect('back'))
        .catch(next);
    }
    RealDelete(req,res,next){
        const categoryId = req.params.id;
        category.deleteOne({ _id: categoryId })
        .then(() => res.redirect('back'))
        .catch(next);
    }
}


module.exports = new CategoryController;