

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');
const ProductSchema = new Schema({
    name_product: String,
    _id_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'categorys'
    },
    img_url: String,
    content: String,
    price: String,
    quantity:String,
    status: String
  },{
    timestamps:true,
  });
  ProductSchema.plugin(mongooseDelete,{ 
    overrideMethods: 'all',
    deletedAt : true 
 });
  
module.exports = mongoose.model('products',ProductSchema);