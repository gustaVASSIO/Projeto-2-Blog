const sequelize = require('sequelize')
const connection = require('../database/db')
const CategoryModel = require('../categories/Category')
const ArticleModel = connection.define('articles',{
    tltle:{
        type:sequelize.STRING,
        allowNull:false
    },
    slug:{
        type: sequelize.STRING,
        allowNull:false
    },
    body:{
        type:sequelize.TEXT,
        allowNull:false
    }
})
//definindo relacionamento entre tabelas
CategoryModel.hasMany(ArticleModel)//relacionamento (1,n): Uma categoria possui varios artigos
ArticleModel.belongsTo(CategoryModel)//relacionamento (1,1): Um Artigo possui uma categoria 
//após criar os models pela primeira vez deve-se removelos a fim de evitar que a aplicação tente criar as tabelas novamente
//ArticleModel.sync({force:true})
module.exports = ArticleModel