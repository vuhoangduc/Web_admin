const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Group = new Schema({
    title_notification:{type:String},
    img_url:{type:String},
    
})
module.exports = mongoose.model('groups',Group);