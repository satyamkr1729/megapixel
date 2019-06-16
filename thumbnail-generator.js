var fs=require('fs');
var thumb=require('image-thumbnail');
var stream=require('stream')

function generate(path){
    fs.readdir(path,(err,files)=>{
        fs.readdir(path+".thumb",(err)=>{
            if(err){
                try{
                    fs.mkdirSync(path+".thumb");
                }
                catch(err)
                {
                   // console.log(err)
                }
            }

            (async function(){
                for(var val of files){
                    if(val[0]=='.')
                        continue;
                    var writer=fs.createWriteStream(path+".thumb/"+val);
                    console.log(val);
                    let thumbnail=await thumb(path+val);

                    var reader= new stream.Readable({read: ()=>{}});
                    reader.pipe(writer);
                    reader.push(thumbnail);
                    reader.push(null);
                }
            })();
        })
    })
}   
//console.log(process.argv[2])
generate(process.argv[2]);