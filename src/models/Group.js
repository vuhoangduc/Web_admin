const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Group = new Schema({
     name_group:{type:String}
})

module.exports = mongoose.model('groups',Group);