var express=require('express');
var fs=require('fs');
var mime=require('mime')
var app=express();
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
    console.log(str);

    var mtype=mime.getType(str);
    if(mtype!=null)
        mtype=mtype.split('/')[0];

    if(mtype=="image")
        res.render("page",{files: [{path: str, type: mtype}], add: add});
    else if(mtype=="video")
        res.render("page",{files: [{path: str, type: mtype}], add: add});
    else
    {
        fs.readdir(str,(err,files)=>{
            // console.log(files)
            var rindex=[];
            files.forEach((val,num)=>{
                if(val[0]=='.')
                    rindex.push(num);
                else
                    files[num]={path: val, type: "folder"}            
            })

            rindex.forEach((val,num)=>{
                files.splice(val,1);
            })
           // console.log(files);
            res.render("page",{files: files,add: add})
        })
    }
})

app.use("/media",(req,res)=>{
    res.sendFile(decodeURIComponent(req.originalUrl))
})
app.listen(3000);