var express=require('express');
var thumb=require('image-thumbnail')
var stream=require('stream')
var fs=require('fs');

var app=express();
var path="/media/satyam/funplace/megapixels/";

app.use("/thumb",(req,res)=>{
    console.log("yes");
    var str=req.originalUrl;
    str=str.replace("/thumb","");
    str=decodeURIComponent(str);
    var k=str.split("/");
    str=str.replace("/","");
    str=str.replace(k[k.length-1],"");
    var writer=fs.createWriteStream(path+str+".thumb/"+k[k.length-1]);

    thumb(path+str+k[k.length-1]).then(thumbnail=>{
        var reader= new stream.Readable({read: ()=>{}});
        reader.pipe(writer);
        reader.pipe(res);
        reader.push(thumbnail);
        reader.push(null);
    })
})

app.listen(3001);