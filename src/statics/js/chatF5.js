//ajax隔2秒刷新一次
var xmlHttp;
function reThis() {
    xmlHttp = createXMLHttp();
    xmlHttp.open("GET","/admin/test",true);
    xmlHttp.onreadystatechange = function callback() {
        if(xmlHttp.readyState == 4){
            document.getElementById("infoDiv").innerHTML = xmlHttp.responseText;
        }
    }
    xmlHttp.send();
}

function createXMLHttp(){
    var xmlHttp;
    if(window.XMLHttpRequest){
        xmlHttp = new XMLHttpRequest();
    }
    if(window.ActiveXObject){
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        if(!xmlHttp){
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        }
    }
    return xmlHttp;
}
var t1 =window.setInterval("reThis()",2000);