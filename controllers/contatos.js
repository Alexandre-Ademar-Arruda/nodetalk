const contatos = require("../routes/contatos");

module.exports = function(app){
    var fs = require("fs");
    var Usuarios = app.models.usuario;
    var ContatoController = {
        index: function(req, res) {
            var usuario = req.session.usuario;
            if(!usuario) return res.redirect("/");
            
            var contatos = usuario.contatos || [];
            var params = {usuario: usuario, contatos: contatos, termo: ""};
            
            res.render("contatos/index", params);
        },

        create: function(req, res) {
            var usuario = req.session.usuario;
            if(!usuario) return res.redirect("/");

            var contato = req.body.contato;
            if(contato.nome) contato.nome = contato.nome.toLowerCase();
            if(contato.email) contato.email = contato.email.toLowerCase();

            // Garante que o array de contatos existe
            if(!usuario.contatos) usuario.contatos = [];
            usuario.contatos.push(contato);

            var usuarioLogadoId = usuario.id;
            
            // Atualiza no array global e mantém a referência na sessão sincronizada
            Usuarios.forEach(function(u, index){
                if(u.id == usuarioLogadoId){
                    Usuarios[index].contatos = usuario.contatos;
                    req.session.usuario = Usuarios[index]; // Sincroniza a sessão com o array global
                }
            });

            fs.writeFileSync("./models/usuario.json", JSON.stringify(Usuarios, null, 4));
            res.redirect('/contatos');
        },

        update: function(req, res){
            var id = parseInt(req.params.id, 10);
            var contato = req.body.contato;
            var usuario = req.session.usuario;
            if(!usuario) return res.redirect("/");

            if (contato.nome) contato.nome = contato.nome.toLowerCase();
            if (contato.email) contato.email = contato.email.toLowerCase();

            usuario.contatos[id] = contato;
            var usuarioLogadoId = usuario.id;
            
            Usuarios.forEach(function(u, index){
                if(u.id === usuarioLogadoId){
                    Usuarios[index].contatos = usuario.contatos;
                    req.session.usuario = Usuarios[index]; // Sincroniza a sessão com o array global
                }
            });

            fs.writeFileSync("./models/usuario.json", JSON.stringify(Usuarios, null, 4));
            res.redirect("/contatos");
        },

        destroy: function(req, res) {
            var id = parseInt(req.params.id, 10);
            var usuario = req.session.usuario;
            if(!usuario) return res.redirect("/");

            usuario.contatos.splice(id, 1);
            var usuarioLogadoId = usuario.id;
            
            Usuarios.forEach(function(u, index) {
                if (u.id === usuarioLogadoId) {
                    Usuarios[index].contatos = usuario.contatos;
                    req.session.usuario = Usuarios[index];
                }
            });

            fs.writeFileSync("./models/usuario.json", JSON.stringify(Usuarios, null, 4));
            res.redirect('/contatos');
        },

        edit: function(req, res){
            var id = parseInt(req.params.id, 10);
            var usuario = req.session.usuario;
            if(!usuario) return res.redirect("/");

            var contato = usuario.contatos[id];
            var params = {usuario: usuario, contato: contato, id: id};
            
            res.render("contatos/edit", params);
        },
    
        buscar: function(req, res){
            var usuario = req.session.usuario;
            if(!usuario) return res.redirect("/");

            var termo = (req.query.termo || "").toLowerCase();
            var contatos = usuario.contatos || [];

            var contatosFiltrados = contatos.filter(function(contato){
                return contato.nome.toLowerCase().includes(termo);
            });
            
            var params = {
                usuario: usuario,
                contatos: contatosFiltrados,
                termo: termo
            };

            res.render("contatos/index", params);
        }
    };
            
    return ContatoController;
};