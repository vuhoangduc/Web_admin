const user = require('./users');
const product = require('./product');
const category = require('./category');
const group = require('./groups');
const search = require('./search');
const { show_products } = require('../controllers/ProductController');
function route(app) {

    app.use('/',user);
    app.use('/products',product);
    app.use('/categorys',category);
    app.use('/groups',group);
    app.use('/search',search);
    app.get('/home',(req,res)=>{
        res.render('home');
    })


}

module.exports = route;