module.exports=function(app){
    var chat=app.controllers.chat
    app.get("/chat/:email",chat.index)
    // app.post("/chat/upload",upload.single("arquivo"),chat.upload)
}