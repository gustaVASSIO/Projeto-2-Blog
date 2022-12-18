const sequelize = require('sequelize')
const connection = require('../database/db')

const User = connection.define('users',{
    tipo:{
        type:sequelize.STRING,
        allowNull:false
    },
    email:{
        type:sequelize.STRING,
        allowNull:false
    },
    senha:{
        type:sequelize.STRING,
        allowNull:false
    },
});
User.sync({force:false})
module.exports = User