var express=require('express');
var fs=require('fs');
var mime=require('mime')
var archive=require('archiver')
var app=express();
var getSize=require('get-folder-size');
var path="/media/satyam/funplace/megapixels";

app.set('view engine','pug')
app.set('views','./views')

app.get("/megapixel",function(req,res)
{
    var add=req.query.add || [];
    var str=path;
    if(Array.isArray(add))
        add.forEach((val,num)=>{str+="/"+val});
    else
        str+="/"+add;
   // console.log(str);

    var mtype=mime.getType(str);
    if(mtype)
        mtype=mtype.split('/')[0];

    if(mtype=="image")
        res.render("page",{files: [{path: str, type: mtype}], add: add});
    else if(mtype=="video")
        res.render("page",{files: [{path: str, type: mtype}], add: add});
    else
    {
        fs.readdir(str,(err,files)=>{
           //  console.log(files)
            var rindex=[];
            files.forEach((val,num)=>{
                if(val[0]=='.')
                    rindex.push(num);
                else
                {
                    var mtype=mime.getType(str+"/"+val);
                    if(mtype && (mtype.split("/")[0]=="image" || mtype.split("/")[0]=="video"))
                    {           
                        var stats=fs.statSync(str+"/"+val);
                        files[num]={path: val, type: "folder", fsize: (stats.size/1024/1024).toFixed(2)};
                    }
                    else
                        files[num]={path: val, type: "folder", fsize: "--"}
                }
            })
            if(rindex.length!=0)
                files.splice(rindex[0],rindex.length);
            
            //console.log(files);
            res.render("page",{files: files,add: add, str: str})
        })
    }
})

app.use("/media",(req,res)=>{
    var url=req.originalUrl;
    var mtype=mime.getType(url);
    if(mtype && (mtype.split("/")[0]=="image" || mtype.split("/")[0]=="video"))
        res.sendFile(decodeURIComponent(req.originalUrl))
    else
    {
        var arch=archive('zip');
        arch.pipe(res);
        arch.directory(url,"")
        arch.finalize();
    }
})
app.listen(3000);