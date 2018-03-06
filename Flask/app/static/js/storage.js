
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

// Update Local Storage
function SetStorage(bool){
    localStorage.username = ($("#uname").val() != undefined ? $("#uname").val() : $("#nav-uname").val())
    if (bool){
        localStorage.password = ($("#psw").val() != undefined ? $("#psw").val() : $("#nav-psw").val())
        localStorage.email = $("#email").val()         
    }       
}

// Update Local Storage
function ClearStorage(){
    // Parental Information
    localStorage.removeItem("username");    
    localStorage.removeItem("password");
    localStorage.removeItem("email");    
    SetObjects();
}

// Run on Load()
SetObjects();