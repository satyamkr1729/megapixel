var express=require('express');
var fs=require('fs');
var mime=require('mime')
var archive=require('archiver')
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
   // var add=req.query.add || [];
   // var str=path;
   var str= req.originalUrl;
   console.log(str);

   str=str.replace("/megapixel","");
   //  if(Array.isArray(add))
   //  add.forEach((val,num)=>{str+="/"+val});
   //else
   //   str+="/"+add;
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
                    //var mtype=mime.getType(str+"/"+val);
                    //if(mtype && (mtype.split("/")[0]=="image" || mtype.split("/")[0]=="video"))
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
            res.render("page",{files: files,str: str})
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

app.listen(3000);