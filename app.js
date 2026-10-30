
var express=require("express")
var http=require("http")
var app=express()
var server=http.createServer(app)
var io=require("socket.io").listen(server)
var cookieParser=require("cookie-parser")
var session=require("express-session")
var bodyParser=require("body-parser")
var load=require("express-load")
var fs=require("fs")
var path=require("path")
var error=require("./middleware/error")
var port=process.env.PORT || 3000

app.set("views",__dirname + "/views");//aqui mostra o path onde estao os files de visualization
app.set("view engine","ejs")//aqui define o motor de visualização

app.use(cookieParser("nodeTalk"))

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static(__dirname + "/public"))

app.use(session({
    secret:"nodeTalk",
    resave:true,
    saveUninitialized:true
}))


app.use(bodyParser.urlencoded({
    extended:true
}))


load("models")
.then("controllers")
.then("routes")
.into(app)


io.sockets.on("connection",function(client){
    client.on("entrar-sala",function(sala){
        client.join(sala)
        console.log(`Usuario entrou na sala: ${sala}`)
    })
    client.on("send-server",function(data){
        var resposta={nome:data.nome,msg:data.msg}
        if(data.arquivo){
            var ext=path.extname(data.arquivo.nome)
            var fileName=Date.now()+ext
            var uploadsDir=path.join(__dirname,"public","upload")
            if(!fs.existsSync(uploadsDir)){
                fs.mkdirSync(uploadsDir,{recursive:true})
            }
            var filePath=path.join(uploadsDir,fileName)
            fs.writeFile(filePath, Buffer.from(data.arquivo.dados),function(err){
                if(err){
                    console.error("Erro ao salvar file enviado:",err)
                }
                resposta.arquivoUrl=`/upload/${fileName}`
                resposta.tipoArquivo=data.arquivo.tipo
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


app.use(error.notFound)
app.use(error.serverError)

server.listen(port,function(){
    console.log("NodeTalk no ar...uhu!!!");
})