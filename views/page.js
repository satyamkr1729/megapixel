var prev;
var next;
$(document).ready(function(){
    $('#left').click(function(e){
        setarrow(prev);
    });

    $('#right').click(function(e){
        setarrow(next);        
    })

    $('#close').click(function(e){
        close();
    })

    $('.file-list').click(function(e){
        e.preventDefault();
       // var cl=e.currentTarget.id;
        //console.log(e);
        next=e.currentTarget.parentNode.parentNode.nextElementSibling;
        prev=e.currentTarget.parentNode.parentNode.previousElementSibling;
        $.ajax({
             url: e.currentTarget.href,
             type: "GET",//type of posting the data
             success: function (data) {
                //console.log("recieved")
                var str=resolve_address(data).str;            
                //console.log(str);
                $('#file-view').css("visibility","visible");
                if(data.type=="video")
                    $('#file').html("<video height=95% width=100% controls><source src=\"/download/?"+str+"\"></video>")
                else
                {
                    $("#file").html("<img id=file-image src=\"/download/?"+str+"\">")
                    if(prev.id!="theader")
                        $('#left').css("visibility","visible");
                    if(next)
                        $('#right').css("visibility","visible");
                }
            },
             error: function(xhr, ajaxOptions, thrownError){
                //what to do in error
             },
        });
    
    })
})

function close(){
    //console.log("close");
    $('#file').html("");
    $('#file-view').css("visibility","hidden");
    $('#left').css("visibility","hidden");
    $('#right').css("visibility","hidden");

}

function setarrow(elem){
    if(elem && elem.id!='theader')
    {
        var elem_url=elem.childNodes[0].childNodes[0].href;
   // console.log(k++)
    //console.log(elem_url)
        prev=elem.previousElementSibling;
        next=elem.nextElementSibling;
        $.ajax({
            url: elem_url,
            type: "GET",
            success: function (data) {
                // console.log("recieved")
                //console.log(str);
                var str=resolve_address(data).str;
               $('#file-view').css("visibility","visible");
               if(data.type=="video")
                   $('#file').html("<video height=100% width=80% controls><source src=\"/download/?"+str+"\"></video>")
               else
               {
                    $("#file").html("<img id=file-image src=\"/download/?"+str+"\">")
               }
                $('#close').click(close);
                $('#left').css("visibility","visible");
                $('#right').css("visibility","visible");
                if(prev.id=="theader")
                    $('#left').css("visibility","hidden");
                if(!next)
                    $('#right').css("visibility","hidden");
           },
            error: function(xhr, ajaxOptions, thrownError){
               //what to do in error
            },
        });
    }
}

function resolve_address(data)
{
    var add=data.add;
    var str="";
    add.forEach((val,num)=>{
        if(num==0)
            str+="add="+val;
        else
           str+="&add="+val;
   })
   return {str: str}
}