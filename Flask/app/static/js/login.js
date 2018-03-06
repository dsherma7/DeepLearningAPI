var login = (localStorage.username != undefined ? localStorage.username : "Login ")
d3.select("#dd-login").text(login)

// Set default values using localStorage
function SetObjects(){             
    // Parental Information
    $("#uname").val(localStorage.username)
    $("#psw").val(localStorage.password) 
}    

// Update Local Storage
function SetStorage(bool){
    // Parental Information
    if (bool){
        localStorage.username = $("#uname").val()
        localStorage.password = $("#psw").val()
    }
       
}

// Update Local Storage
function ClearStorage(){
    // Parental Information
    localStorage.removeItem("username");    
    localStorage.removeItem("password");    
    SetObjects();
}

// Run on Load()
SetObjects();

