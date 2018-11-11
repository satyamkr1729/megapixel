var express=require('express');
var thumb=require('image-thumbnail')
var stream=require('stream')
var fs=require('fs');

var app=express();
var path="/media/satyam/funplace/megapixels";

app.use("/thumb",(req,res)=>{
    var address=address_resolver(req);
    var str=address.str;
    var add=address.add;
    str=decodeURIComponent(str);
    str=str.replace(add[add.length-1],"");
   // console.log(path+str);
    fs.readdir(path+str+".thumb",(err,files)=>{
        if(err){
            try{
                fs.mkdirSync(path+str+".thumb");
            }
            catch(err)
            {
               // console.log(err)
            }
        }
        var writer=fs.createWriteStream(path+str+".thumb/"+add[add.length-1]);
        
        thumb(path+str+add[add.length-1]).then(thumbnail=>{
            var reader= new stream.Readable({read: ()=>{}});
            reader.pipe(writer);
            reader.pipe(res);
            reader.push(thumbnail);
            reader.push(null);
        })
    })
})

function address_resolver(request){
    var add=request.query.add || [];
    //console.log(add);
    var str="";
    if(Array.isArray(add))
    {
        add.forEach((val,num)=>{
            str+="/"+val;
        })
    }
    else
    {
        str+="/"+add;
        add=[add];
    }
    return {add: add, str: str};
}

app.listen(3001);