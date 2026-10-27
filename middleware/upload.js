var multer=require("multer")
module.exports=multer({
    storage:multer.memoryStorage(),
    limits:{fileSize:50*1024*1024},
    fileFilter: function(req,file,callback){
        if  (file.mimetype.indexOf("image/")===0||
             file.mimetype.indexOf("video/")===0){
             return callback(null,true)
        }
        callback(new Error("envie uma mensagem ou um arquivo"))
    }
})