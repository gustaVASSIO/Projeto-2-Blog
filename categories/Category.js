const sequelize = require('sequelize')
const connection = require('../database/db')

const CategoryModel = connection.define('category',{
    title:{
        type:sequelize.STRING,
        allowNull:false
    },
    slug:{
        type: sequelize.STRING,
        allowNull:false
    }
})
//após criar os models pela primeira vez deve-se removelos a fim de evitar que a aplicação tente criar as tabelas novamente
//CategoryModel.sync({force:true})

module.exports = CategoryModel