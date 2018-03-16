var users = [];
$(document).ready(function () {
    var client = new HttpClient();
     client.get('/_get_users', function(response) {
        response = JSON.parse(response).users;
        response.forEach(d => users.push(d));
        users = Array.from(new Set(users));
    });
});


$(function(){
    $("#signup").bind('click',End);
})
End = function(){    
    var url  = "/_add_user?user=" + $("#uname").val();
        url += "&params="+get_other_params();
    var client = new HttpClient();
    client.get(url, function(response) {
        // do something with response
        response = JSON.parse(response);
        if (response.status == STATUS_OK){
            SetStorage(d3.select('#remember').property('checked'));
            window.location.href = '/home';
        }else{
            d3.select("#signup-err").style('display','table-cell').text(response.msg);        
        }
    });    
}

get_other_params = function() {
    params = {
        "username":$("#uname").val(),
        "password":$("#uname").val(),
        "email":$("#uname").val()        
    }
    return JSON.stringify(params);
}

$(function(){
    $('#uname').on('change', function () {
        // Make sure username doesn't exist
        var lbl = d3.select("#uname-err");
        if ( users.includes( $("#uname").val() ) ){
            lbl.style('display','table-cell').text("Username already exists!");
            $('#uname').focus();
        }else{
            lbl.style('display','none');
        }
    });
});


dont_match = function(){
    var lbl = d3.select("#cpsw-err");
    if ($("#psw").val() != $("#cpsw").val()){
        lbl.style('display','table-cell').text("Passwords don't match!");        
    }else{
        lbl.style('display','none');
    } 
}
$('#cpsw').on('change',dont_match);
$('#psw' ).on('change',dont_match);


