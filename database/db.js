const sequelize = require('sequelize')
const connection = new sequelize('blog','root','muzambinho13',{
    host:'localhost',
    port:'3307',
    dialect:'mysql',
    timezone:'-03:00'//definindo o formato do horario
})
module.exports = connection