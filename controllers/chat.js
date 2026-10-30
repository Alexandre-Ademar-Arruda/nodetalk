var cloudinary = require("cloudinary").v2;

module.exports=function(app){
    var ChatController={
        index: function(req,res){
            if(!req.session.usuario){
                return res.redirect("/")
            }
            var usuarioAtual=req.session.usuario.email
            var outroUsuario=req.params.email
            var chatPrivado=[usuarioAtual,outroUsuario].sort().join("_")
                
            res.render("chat/index",{
                usuario: req.session.usuario,
                sala: chatPrivado,
                destinatario: outroUsuario
            })
        },
        listarContatos: function(req,res){
            if(!req.session.usuario){
                return res.redirect("/")
            }
            var usuarioLogado=req.session.usuario
            res.render("contatos/index",{
                usuario:usuarioLogado,
                contatos: req.app.locals.todosContatos
            })

        },
        upload: function(req,res){
            if(!req.file){
                return res.status(400).json({error: "Selecione uma imagem ou um vídeo."});
            }

            var stream = cloudinary.uploader.upload_stream(
                {resource_type: "auto", folder: "nodetalk"},
                function(error, result){
                    if(error){
                        return res.status(502).json({error: "Não foi possível armazenar o arquivo."});
                    }

                    res.json({
                        url: result.secure_url,
                        resourceType: result.resource_type,
                        format: result.format
                    });
                }
            );

            stream.end(req.file.buffer);
        }
    }
    return ChatController
}