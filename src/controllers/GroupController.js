const group = require('../models/Group');
const {muntipleMongooseToObject} = require('../util/mongoose');


class GroupController{
    index(req,res,next){
        group.find({})
        .then(groups =>{
            res.render('groups',{
                groups:muntipleMongooseToObject(groups)
            });
        })
        .catch(next)
    }

    addNew(req,res,next){
        const data_v1 = req.body;
        console.log(data_v1.name_group);
        const group_v1 = new group(data_v1);
        group_v1.save()
        .then(() => res.redirect('/groups'));
    }
}


module.exports = new GroupController;