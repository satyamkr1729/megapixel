var express=require('express');
var thumb=require('image-thumbnail')
var stream=require('stream')

var app=express();
var path="/media/satyam/funplace/megapixels/";

app.use("/thumb",(req,res)=>{
   // console.log("yes");
    var str=req.originalUrl;
    str=str.replace("/thumb","");
    str=decodeURIComponent(str);
    thumb(path+str).then(thumbnail=>{
        var reader= new stream.Readable({read: ()=>{}});
        reader.pipe(res);
        reader.push(thumbnail);
        reader.push(null);
    })
})

app.listen(3001);