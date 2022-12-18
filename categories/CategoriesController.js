const express = require("express");
const router = express.Router();
const CategoryModel = require("./Category");
const slugify = require("slugify");
router.get("/admin/categories/new", (req, res) => {
  
  res.render("admin/categories/new");
});
router.post("/categories/save", (req, res) => {
  const { title } = req.body;
  if (title != undefined) {
    CategoryModel.create({
      title: title,
      slug: slugify(title),
    }).then(() => {
      res.redirect("/admin/categories");
    });
  } else {
    res.redirect("admin/categories/new");
  }
});

router.get("/admin/categories", async (req, res) => {
  const categories = await CategoryModel.findAll();
  res.render("admin/categories/indexcategories", { categories });
});
//deletando categoria
router.post("/categories/delete", (req, res) => {
  const { id } = req.body;
  if (id != undefined) {
    if (!isNaN(id)) {
      CategoryModel.destroy({
        where: {
          id: id,
        },
      }).then(res.redirect("/admin/categories"));
    } else {
      res.redirect("/admin/categories");
    }
  } else {
    res.redirect("/admin/categories");
  }
});

router.get('/admin/categories/edit/:id',(req,res)=>{
  const id = Number(req.params.id)
  if(id!=undefined){
         CategoryModel.findByPk(id).then((category)=>{
          res.render('admin/categories/edit',{category})
         })  
  }else{
    res.redirect('/admin/categories')
  }
})

router.post('/categories/saveedit',(req,res)=>{//ATUALIZANDO DADOS SEQUELIZE
  const {id,title} = req.body
  console.log(id)
  CategoryModel.update({
    title:title,
    slug:slugify(title)
  },{
    where:{id:id}
  }).then(()=>res.redirect('/admin/categories/'))

})


module.exports = router;
