const mongoose = require('mongoose');

async function connet() {
    try {
        await mongoose.connect('mongodb://localhost:27017/ASM_Nodejs',{
            useNewUrlParser:true,
        });
        console.log('Connet successfully1111s !!!');
    } catch (error) {
        console.log('Fail!!!');
    }
}

module.exports = {connet};