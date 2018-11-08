var ex=require('express');
var fs=require('fs');
var app=ex();
var path="/media/satyam/funplace/megapixels/";

app.set('view engine','pug')
app.set('views','./views')

app.get("/megapixel",function(req,res)
{
    var add=req.query.add || [];
    var str=path;
    if(Array.isArray(add))
        add.forEach((val,num)=>{str+=val+"/"});
    else
        str+=add+"/";
    console.log(str);
    
    fs.readdir(str,(err,files)=>{
       // console.log(files)
            files.forEach((val,num)=>{if(val[0]=='.')files.splice(num,1)})
            res.render("page",{files: files,add: add})
    })
})


app.listen(3000);