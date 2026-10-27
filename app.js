
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
    saveUninitialized:true
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

var fs=require("fs")
var path=require("path")

io.sockets.on("connection",function(client){
    client.on("send-server",function(data){
        var resposta={nome:data.nome,msg:data.msg}
        if(data.arquivo){
            var ext=path.extname(data.arquivo.nome)
            var fileName=Date.now()+ext
            var pathName=path.join(__dirname,"public","upload")
            fs.writeFile(pathName, Buffer.from(data.arquivo.dados),(err)=>{
                if(!err){
                    resposta.arquivoUrl=`/uploads/${fileName}`
                    resposta.tipoArquivo=data.arquivo.tipo
                }
                io.emit("send-client",formatarMensagem(resposta))
            })
        }else{
            io.emit("send-client",formatarMensagem(resposta))
        }
    })
    function formatarMensagem(dados){
        var html=`<p><strong>${dados.nome}:</strong> ${dados.msg}</p>`
        if(dados.arquivoUrl){
            if(dados.tipoArquivo.startsWith("image/")){
                html+=`<br><img src="${dados.arquivoUrl}" width="200">`
            }else if(dados.tipoArquivo.startsWith("video/")){
                html+=`<br><video src="${dados.arquivoUrl}" width="300" controls></video>`
            }
        }
        return html
    }
    console.log("Um usuario se conectou ao chat via Socket.io")
})


var error=require("./middleware/error")
app.use(error.notFound)
app.use(error.serverError)

var port=process.env.PORT || 3000
server.listen(port,function(){
    console.log("NodeTalk no ar...uhu!!!");
})