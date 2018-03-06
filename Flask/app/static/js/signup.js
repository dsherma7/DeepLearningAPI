End = function(){
    SetStorage(d3.select('#remember').property('checked'));
    window.location.href = '/status';
}


var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}
var client = new HttpClient();

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


