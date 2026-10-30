module.exports=function(app){
    var autenticar=require("../middleware/autenticador")
    var contatos=app.controllers.contatos

    app.get ("/contatos",autenticar,contatos.index)
    app.post("/contatos",autenticar,contatos.create)
    app.post("/contatos/:id/remover",autenticar,contatos.destroy)
    app.get ("/contatos/:id/edit",autenticar,contatos.edit)
    app.post("/contatos/:id",autenticar,contatos.update)
    app.get ("/contatos/buscar",autenticar,contatos.buscar)
}