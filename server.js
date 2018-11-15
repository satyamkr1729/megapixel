var express=require('express');
var fs=require('fs');
var mime=require('mime')
var archive=require('archiver')
var forward=require('./http-forward');
var stream=require('stream')

var app=express();
var getSize=require('get-folder-size');
var path="/media/satyam/funplace/megapixels";

app.set('view engine','pug')
app.set('views','./views')

app.use("/files",express.static(__dirname+"/views"));
app.use("/images",express.static(__dirname+"/images"));

app.use("/megapixel/",(req,res)=>{
    var address=address_resolver(req);
    var str=address.str;
    var add=address.add;
    var mode= req.query.mode || "3";
    str=decodeURIComponent(str);
  //  console.log(path+str);

    var mtype=mime.getType(path+str);
    if(mtype)
        mtype=mtype.split('/')[0];

    if(mtype=="image" || mtype=="video")
        res.send({add: add,type: mtype})        
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
                        files[num]={name: val, type: "file", fsize: (stats.size/1024/1024).toFixed(2)};
                    else
                        files[num]={name: val, type: "folder", fsize: "--"}
                }
            })
            if(rindex.length!=0)
                files.splice(rindex[0],rindex.length);
            
           // console.log(mode);
            if(mode=="3" || mode=="2")
                res.render("page2",{files: files,add: add,mode: mode})
            else
            res.render("page",{files: files,add: add, mode: mode})
        })
    }
})

app.use("/download",(req,res)=>{
    var address=address_resolver(req);
    var url=address.str;
    url=decodeURIComponent(url);
    //console.log(url);
    var mtype=mime.getType(path+url);
    if(mtype && (mtype.split("/")[0]=="image" || mtype.split("/")[0]=="video"))
        res.download(path+url)
    else
    {
        var arch=archive('zip');
        arch.pipe(res);
        arch.directory(path+url,"")
        arch.finalize();
    }
})

app.use("/thumb",(req,res)=>{
    var address=address_resolver(req);
    var str=address.str;
    var add=address.add;
    str=decodeURIComponent(str);
    //console.log(path+str);
    var mtype=mime.getType(path+str);
    if(mtype)
    {
        if(mtype.split("/")[0]=="image")
        {
            str=str.replace("/"+add[add.length-1],"");
            fs.readFile(path+str+"/.thumb/"+add[add.length-1],(err,data)=>{
                if(err)
                {
                    req.forward={target: "http://localhost:3001/thumb"}
                    forward(req,res);        
                }
                else
                {
                    var reader=new stream.Readable({read: ()=>{}})
                    reader.pipe(res);
                    reader.push(data);
                    reader.push(null);
                }
            })
        }
        else
            res.sendFile(__dirname+"/images/video.png")
    }
    else
        res.sendFile(__dirname+"/images/folder.png")
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
app.listen(3000);