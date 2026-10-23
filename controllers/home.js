//importando o modulo fyle system
var fs=require("fs")
var path=require("path")
module.exports = function(app){
    var Usuarios=app.models.usuario
    var HomeController = {
        index:function(req,res){
            res.render("home/index")
        },
        login:function(req,res){
            var nome=req.body.usuario.nome
            var email=req.body.usuario.email
            if(nome)nome=nome.toLowerCase()
            if(email)email=email.toLowerCase()
            if(email&&nome){
                var usuarioEncontrado=Usuarios.find(function(u){
                    return u.email===email&&u.nome===nome
                })
                if(usuarioEncontrado){
                    req.session.usuario=usuarioEncontrado
                    res.redirect("/contatos")
                }else{
                    var novoUsuario={
                        id:Usuarios.length+1,
                        nome:nome,
                        email:email,
                        contatos:[]
                    }

                    Usuarios.push(novoUsuario)

                    var infoUsuarios = path.join(__dirname, "..", "models", "usuario.json")
                    
                    fs.writeFileSync(infoUsuarios, JSON.stringify(Usuarios, null, 4), "utf8")

                    // fs.writeFileSync("/models/usuario.json",JSON.stringify(Usuarios,null,4))
                    
                    req.session.usuario=novoUsuario
                    
                    req.session.save(function(err){
                        res.redirect("/contatos")
                    })

                    // res.writeHead(404,{"Content-Type":"text/html;charset=utf-8"})
                    // res.write("<h1>usuario nao encontrado</h1>")
                    // res.end()
                }
            }else{
                res.redirect("/")
            }
        },
        logout:function(req,res){
            req.session.destroy()
            res.redirect("/")
        }
    }
    return HomeController
}