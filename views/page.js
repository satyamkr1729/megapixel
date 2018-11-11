$(document).ready(function(){
$('.file').click(function(e){
    e.preventDefault();
    $.ajax({
         url: e.currentTarget.href,
         type: "GET",//type of posting the data
         success: function (data) {
            var add=data.add;
            var str="";
            add.forEach((val,num)=>{
                if(num==0)
                    str+="add="+val;
                else
                    str+="&add="+val;
            })
            console.log(str);
            $('#file-view').css("visibility","visible");
            $('#file-view').append("<video height=50% width=40% controls><source src=\"/download/?"+str+"\"></video>")
        },
         error: function(xhr, ajaxOptions, thrownError){
            //what to do in error
         },
    });
  
  });
})