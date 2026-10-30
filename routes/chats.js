module.exports=function(app){
    var chat=app.controllers.chat
    app.get("/contatos",chat.listarContatos)
    app.get("/chat/:email",chat.index)
}