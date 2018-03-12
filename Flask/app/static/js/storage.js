
// Set default values using localStorage
function SetObjects(){             
    // Login/Signup Fields
    $("#uname").val(localStorage.username)
    $("#email").val(localStorage.email) 
    $("#psw").val(localStorage.password) 
    // Navbar fields
    $("#nav-uname").val(localStorage.username)
    $("#nav-email").val(localStorage.email) 
    $("#nav-psw").val(localStorage.password) 
    // Update Login Field
    var login = (localStorage.username != undefined ? localStorage.username : "Login ")
    d3.select("#dd-login").text(login)
}    

$("#btn-login").bind('click',function(){
    var bool = $("#remember").val() != undefined ? d3.select("#remember").property("checked") : d3.select("#nav-remember").property("checked")
    SetStorage(bool);
    SetObjects();
});

// Update Local Storage
function SetStorage(bool){
    localStorage.username = ($("#uname").val() != undefined ? $("#uname").val() : $("#nav-uname").val())
    if (bool){
        localStorage.password = ($("#psw").val() != undefined ? $("#psw").val() : $("#nav-psw").val())
        if ($("#email").val() != undefined)
            localStorage.email = $("#email").val()         
    }       
}
$(document).ready(SetObjects);

// Update Local Storage
function ClearStorage(){
    // Parental Information
    localStorage.removeItem("username");    
    localStorage.removeItem("password");
    localStorage.removeItem("email");    
    SetObjects();
}

// For network builder
StoreNetwork = function() {
  localStorage.all_layers = JSON.stringify(all_layers);
  localStorage.optimizer  = JSON.stringify(optimizer);
  localStorage.project    = $("#Name").val();
  localStorage.comments   = $("#Comments").val();
  localStorage.input_sz   = $("#InputSize").val();
  localStorage.loss       = $("#LossFunct").val();
  localStorage.batchsz    = $("#Batch_Size").val();  
  localStorage.steps      = $("#Train_Steps").val();
  localStorage.shuffle    = $("#Shuffle").is(":checked");
}
LoadNetwork = function() {
  $("#Name").val(localStorage.project);
  $("#Comments").val(localStorage.comments);
  $("#InputSize").val(localStorage.input_sz ? localStorage.input_sz : '2D');
  $("#LossFunct").val(localStorage.loss ? localStorage.loss : 'softmax');
  $("#Batch_Size").val(localStorage.batchsz ? localStorage.batchsz : 100);  
  $("#Train_Steps").val(localStorage.steps ? localStorage.steps : 1 );
  $("#Shuffle").prop("checked",(localStorage.shuffle ? JSON.parse(localStorage.shuffle) : true));
}
