
const contatos = require("../routes/contatos");

module.exports = function(app){
    var fs = require("fs");
    var Usuarios = app.models.usuario;
    
    var ContatoController = {
        index: function(req, res) {
            var usuario = req.session.usuario;
            var contatos = usuario.contatos || [];
            var params = {usuario: usuario, contatos: contatos};
            console.log(JSON.stringify(Usuarios, null, 4));
            res.render('contatos/index', params);
        },

        create: function(req, res) {
            var usuario = req.session.usuario;
            var contato = req.body.contato;
            usuario.contatos.push(contato);
            var usuarioLogadoId = usuario.id;
            Usuarios.forEach(function(u){
                if(u.id === usuarioLogadoId){
                    u.contatos = usuario.contatos;
                }
            });
            console.log(JSON.stringify(Usuarios, null, 4));
            fs.writeFileSync("./models/usuario.json", JSON.stringify(Usuarios, null, 4));
            res.redirect('/contatos');
        }
    }; // <--- Fecha o objeto ContatoController corretamente

    return ContatoController;
}; // <--- Fecha a função principal do module.exports