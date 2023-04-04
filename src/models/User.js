const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const User = new Schema({
    user_name:{type:String},
    email:{type:String},
    pass:{type:String},
    img_url:{type:String},
    _id_group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups'
    },
    group:{type:String},
    status:{type:String}
},{
    timeseries:true
});

User.plugin(mongooseDelete,{ 
    overrideMethods: 'all',
    deletedAt : true 
 });

module.exports = mongoose.model('users',User);