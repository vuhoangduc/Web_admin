const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const route = require('./routes/index');
const session = require('express-session');
const methodOverride = require('method-override');
const db = require('./config/db/index');
const app = express();

const port = 3000
const path = require('path');
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers:{
        sum:(a,b) => a+b,
        stt: function(currentPage, productsPerPage, index) {
            return (currentPage - 1) * productsPerPage + index + 1;
          },
        ifEqual:(arg1,arg2,options) =>(arg1 == arg2) ? options.fn(this) : options.inverse(this)
    }
});

app.use(morgan('combined'));
app.use(methodOverride('_method'));
app.engine('hbs', hbs.engine);
app.set('view engine','hbs');
app.set('views',path.join(__dirname, 'res\\views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({
    extended:true
}));

app.use(express.json());

app.use(session({
    secret: 'mySecretKey', // Thay thế bằng key bảo mật của bạn
    resave: false,
    saveUninitialized: true
  }));

  
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

route(app);
db.connet();
app.use('/uploads', express.static('uploads'));


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})