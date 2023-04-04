const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const Category = new Schema({
    name_category:{type:String},
    img_url:{type:String},
},{
    timestamps:true,
})

Category.plugin(mongooseDelete,{ 
    overrideMethods: 'all',
    deletedAt : true 
 });

module.exports = mongoose.model('categorys',Category);