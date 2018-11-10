var express=require('express');
var fs=require('fs');
var mime=require('mime')
var archive=require('archiver')
var stream=require('stream')
var thumb=require('image-thumbnail')

var app=express();
var getSize=require('get-folder-size');
var path="/media/satyam/funplace/megapixels/";

app.set('view engine','pug')
app.set('views','./views')

app.get("/files/:file",(req,res)=>{
    res.sendFile(__dirname+"/views/"+req.params.file)
})

app.use("/megapixel",function(req,res)
{
   var str= req.originalUrl;
   console.log(str);

   str=str.replace("/megapixel","");
   str=decodeURIComponent(str);
   console.log(str);

    var mtype=mime.getType(path+str);
    if(mtype)
        mtype=mtype.split('/')[0];

    if(mtype=="image")
        res.render("page",{files: [{name: str, type: mtype}], str: str});
    else if(mtype=="video")
        res.render("page",{files: [{name: str, type: mtype}], str: str});
    else
    {
        fs.readdir(path+str, (err,files)=>{
          //   console.log(files)
            var rindex=[];
            files.forEach((val,num)=>{
                if(val[0]=='.')
                    rindex.push(num);
                else
                {
                    var stats=fs.statSync(path+str+"/"+val);
                    if(stats.isFile())
                        files[num]={name: val, type: "folder", fsize: (stats.size/1024/1024).toFixed(2)};
                    else
                        files[num]={name: val, type: "folder", fsize: "--"}
                }
            })
            if(rindex.length!=0)
                files.splice(rindex[0],rindex.length);
            
            //console.log(files);
            res.render("page2",{files: files,str: str})
        })
    }
})

app.use("/download",(req,res)=>{
    var url=req.originalUrl;
    url=url.replace("/download","");
    url=decodeURIComponent(url);
    //console.log(url);
    var mtype=mime.getType(path+url);
    if(mtype && (mtype.split("/")[0]=="image" || mtype.split("/")[0]=="video"))
        res.sendFile(path+url)
    else
    {
        var arch=archive('zip');
        arch.pipe(res);
        arch.directory(path+url,"")
        arch.finalize();
    }
})

app.use("/thumb",(req,res)=>{
    var str=req.originalUrl;
    str=str.replace("/thumb","");
    str=decodeURIComponent(str);
    var mtype=mime.getType(path+str);
    if(mtype)
    {
        thumb(path+str).then(thumbnail=>{
            var reader= new stream.Readable({read: ()=>{}});
            reader.pipe(res);
            reader.push(thumbnail);
            reader.push(null);
        })
    }
    else
        res.sendFile(__dirname+"/images/folder.png")
})

app.listen(3000);