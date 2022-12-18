const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const Article = require('../articles/Article')
const Category = require('../categories/Category')

router.get('/admin',(req,res)=>{
  res.render('admin/homeadmin')
})
router.get("/admin/adduser", (req, res) => {
  const admin = true
  res.render("users/create",{admin});
});

router.post("/admin/create", (req, res) => {
  const { email, senha, tipo } = req.body;
  //verificando se o email ja existe ou não no banco de dadso
  User.findOne({
    where: { email: email },
  }).then((user) => {
    if (user == undefined) {
      //criar hash de senha para salvar no banco
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(senha, salt);

      User.create({
        tipo: tipo,
        email: email,
        senha: hash,
      }).then(() => res.redirect("/admin/adduser"));
    } else {
      res.redirect("/admin/adduser");
    }
  });
});
router.get('/user/create',(req,res)=>{
  const admin = false
  Article.findAll({
    order:[
        ['id','desc']
    ],
    limit:4
})
.then((articles)=>{
    Category.findAll()
    .then(categories=>{
        res.render('users/create',{articles,categories,admin})
    })
})
});
router.post('/createuser',(req,res)=>{
  const { email, senha } = req.body;
  //verificando se o email ja existe ou não no banco de dadso
  User.findOne({
    where: { email: email },
  }).then((user) => {
    if (user == undefined) {
      //criar hash de senha para salvar no banco
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(senha, salt);

      User.create({
        tipo: 'usuario',
        email: email,
        senha: hash,
      })
      .then(() => {
        req.session.user={
          email:email,
          tipo:'usuario'
        }  
        res.redirect('/')
        });
    
    
    
    } else {
      res.redirect("/");
    }
  });
})

router.get('/admin/users',(req,res)=>{
    User.findAll()
    .then(users=>{
        res.render('users/listagem',{users})
    })
})

router.get("/user/login",(req, res) => {
  
  Article.findAll({
    order:[
        ['id','desc']
    ],
    limit:4
})
.then((articles)=>{
    Category.findAll()
    .then(categories=>{
        res.render('users/login',{articles,categories})
    })
})

});

router.post("/savelogin", (req, res) => {
  const {email,senha} = req.body
  User.findOne({
    where:{
      email:email
    }
  }).then(user=>{
    if(user!=undefined){

       const compare = bcrypt.compareSync(senha,user.senha)
       if(compare){
           req.session.user = {
          id:user.id,
          tipo:user.tipo,
          email:email,
          senha:senha
        }
        res.redirect('/admin/articles')
      }else{
        res.redirect('/user/login')
       }
    }else{
      res.redirect('/user/login')
    }

  })
});
router.get('/logout',(req,res)=>{
  req.session.user=undefined
  res.redirect('/')
})

module.exports = router;
