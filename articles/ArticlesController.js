const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require('../middlewares/adminAuth')
                                //midleware
router.get("/admin/articles/new",adminAuth, (req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/articles/new", { categories: categories });
  });
});

router.post("/article/save",(req, res) => {
  const { title, textarticle, categories } = req.body;
  Article.create({
    tltle: title,
    slug: slugify(title),
    body: textarticle,
    categoryId: categories,
  }).then(() => {
    res.redirect("/");
  });
});
router.get("/admin/articles", (req, res) => {
  Article.findAll({
    include:[{model:Category}]
  })
  .then((articles) => {
    console.log(articles)
    res.render("admin/articles/index",{articles});
  });
});

router.post("/article/delete", (req, res) => {
  const { id } = req.body;
  if (id != undefined) {
    if (!isNaN(id)) {
      Article.destroy({
        where: {
          id: id,
        },
      }).then(res.redirect("/admin/articles"));
    } else {
      res.redirect("/admin/articles");
    }
  } else {
    res.redirect("/admin/articles");
  }
});

router.get('/admin/article/edit/:id',(req,res)=>{
  const {id} = req.params
  Article.findOne({
    
    where:{id:id},
    include:[{model:Category}]
})
  .then(article=>{
    Category.findAll()
    .then(categories=>{
      res.render('admin/articles/edit',{article,categories})
    })
  })
  
})

router.post('/article/saveedit',(req,res)=>{
  const {id,title,textarticle,categories} = req.body
  Article.update({
    tltle:title,
    body:textarticle,
    slug:slugify(title),
    categoryId:categories
  },{
    where:{id:id}
  }).then(()=>res.redirect('/admin/articles'))
})

router.get('/admin/articles/page/:num',(req,res)=>{//Logica de paginação para sites
  const page = parseInt(req.params.num)
  var limit =2
  let offset = 0 
  if(isNaN(page)||page==1){
    offset = 0 
  }else{
    offset = limit*(page-1)
  }
  Article.findAndCountAll({
    limit:limit,//define o numero limite de elementos que aparecerão na pagina
    offset:offset,
    order:[
      ['id','desc']
  ]
  }) //retorna todos os elementos da tabela de artigos e a quantidade de elementos
  .then(articles=>{
    //verificando se há uma proxima pagina para ser exibida
    let next
    (offset+limit)>=articles.count?next=false:next=true

    Category.findAll()
    .then(categories=>{
      res.render('admin/articles/page',{//transforma os dados da tabela em formato json
        categories,
        next,
        articles,
        page
      })
    })
  })
})

module.exports = router;
