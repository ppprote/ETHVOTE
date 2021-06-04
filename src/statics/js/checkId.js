// 用户名合法性的判断
function isEmpty(form3){
    //form1是form中的name属性
    if(form3.content.value==""){
        alert("发送内容不能为空!");
        return false;
    }
    return true;
}