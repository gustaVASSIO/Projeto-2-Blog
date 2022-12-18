
function adminAuth(req,res,next){
    if(req.session.user!= undefined){
    if(req.session.user.tipo == 'admin'){
        next()
    }else{
        res.redirect('/homeadmin')
    }
    }
}


module.exports = adminAuth
