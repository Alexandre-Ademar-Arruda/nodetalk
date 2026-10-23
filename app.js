
var express=require("express")
var http=require("http")


var app=express()
app.set("views",__dirname + "/views");//aqui mostra o path onde estao os files de visualization
app.set("view engine","ejs")//aqui define o motor de visualização

var server=http.createServer(app)

var io=require("socket.io").listen(server)

var cookieParser=require("cookie-parser")
app.use(cookieParser("nodeTalk"))

var session=require("express-session")
app.use(session({
    secret:"nodeTalk",
    resave:true,
    saveUnitialized:true
}))

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static(__dirname + "/public"))

var bodyParser=require("body-parser")
app.use(bodyParser.urlencoded({
    extended:true
}))


var load=require("express-load")
load("models")
.then("controllers")
.then("routes")
.into(app)

io.sockets.on("connection",function(client){
    client.on("send-server",function(data){
        //var msg="<b>"+data.nome+":</b>"+data.msg+"<br>"
        var msg=`<b>${data.nome}:</b> ${data.msg}<br>`
        client.emit("send-client",msg)
        client.broadcast.emit("send-client",msg)
    })
    console.log("Um usuario se conectou ao chat via Socket.io")
})

var error=require("./middleware/error")
app.use(error.notFound)
app.use(error.serverError)

server.listen(3000,function(){
    console.log("NodeTalk no ar...uhu!!!");
})