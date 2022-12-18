const express = require('express');
const app = express()
const session = require('express-session')
//controllers
const categories_controller = require('./categories/CategoriesController')
const articles_controller = require('./articles/ArticlesController')
const UserController = require('./users/UserController')
//models
const Category = require('./categories/Category')
const Article = require('./articles/Article')
const User = require('./users/User')
//Sessions
app.use(session({
    secret:'flatron',
    cookie:{
        maxAge: 900 *1000
    }
}))

const connection = require('./database/db')
const bodyParser = require('body-parser');
const adminAuth = require('./middlewares/adminAuth');
//seting view engine
app.set('view engine','ejs')

//static
app.use(express.static('public'))

//body-parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//database
connection
.authenticate()
.catch((erro)=>console.log(erro))

//dizendo para a aplicação usar a rotas de do controller de categories e articles
app.use('/',categories_controller)
app.use('/',articles_controller)
app.use('/',UserController)

app.get('/',(req,res)=>{
    Article.findAll({
        order:[
            ['id','desc']
        ],
        limit:4
    })
    .then((articles)=>{
        Category.findAll()
        .then(categories=>{
            res.render('home',{articles,categories})
        })
    })
});

app.get('/:slug',(req,res)=>{
    const {slug} = req.params
    Article.findOne({
        where:{
            slug:slug,
        }
    })
    .then((article)=>{
        if(article!=undefined){
            Category.findAll()
            .then(categories=>{
                res.render('article',{article,categories})
            })
        }else{
            res.redirect('/')
        }
    })
})

app.get('/category/:slug',(req,res)=>{
    const {slug} = req.params
    console.log(slug)
    Category.findOne({
        where:{
            slug:slug
        },
        include:[{model:Article}]
    })
    .then(category=>{
        Category.findAll().
        then(categories=>{
            
            if(category.article!=undefined){
                res.render('home',{articles:category.articles,categories})
            }else{
                res.render('home',{articles:category.articles,categories})
            }
            })
    })

})

//Manipulando sessions---------------------

// app.get('/criar/session',(req,res)=>{
//     req.session.user={
//         nome :'Gustavo',
//         email:'gustavo@gmail.com',
//         senha:'1234'
//     }
// res.send('gerando session')
// })

// app.get('/leitura/session',(req,res)=>{
//  res.json({
//     user:req.session.user
//  })
// })

//-----------------------------------------

app.listen(5500)