function  getMoreContents() {
    //获得用户输入
    $.ajax({
        data:"keyword="+$("#keyword").val(),
        type:"GET",
        dataType: 'json',
        url:"/admin/search/send",
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
            alert('读取超时，请检查网络连接');
        },
        success:function(data){
            var Data = data;
            if(data.msg=="为空"){
                $("#result").html("暂无查询结果") ;
                clearContent();
            }else{
                clearContent();
                setLocation();
                for(var key in Data){
                    var tr = document.createElement("tr");
                    var td = document.createElement("td");
                    var text=document.createTextNode(Data[key]);
                    td.setAttribute("border","0");
                    td.setAttribute("bgcolor","#FFFAFA");
                    td.onmouseover=function() {
                        this.className='mouseOver';
                    }
                    td.onmouseout=function () {
                        this.className = 'mouseOut';
                    }
                    td.onmousedown=function () {
                        document.getElementById("keyword").value=this.innerHTML;
                        clearContent();
                    }
                    td.appendChild(text);
                    tr.appendChild(td);
                    document.getElementById("content_table_body").appendChild(tr);
                }
            }

            // $("#result").html(data) ;
        }
    });
}
function clearContent() {
    var contentTableBody = document.getElementById("content_table_body");
    var size = contentTableBody.childNodes.length;
    for(var i=size-1;i>=0;i--){
        contentTableBody.removeChild(contentTableBody.childNodes[i]);
    }
    document.getElementById("popDiv").style.border="none";

}
function setLocation() {
    var content = document.getElementById("keyword");
    var width = content.offsetWidth;
    var left = content["offsetLeft"];//距离左边框的距离
    var top = content["offsetTop"]+content.offsetHeight;//距离顶部的距离
    var popDiv = document.getElementById("popDiv");
    popDiv.style.border = "black 1px solid";
    popDiv.style.left = left +"px";
    popDiv.style.top = top+"px";
    popDiv.style.width = width +"px";
    document.getElementById("content_table").style.width = width +"px";
}