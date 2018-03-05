var all_layers = [];
if (localStorage.all_layers != undefined)
    var all_layers = JSON.parse(localStorage.all_layers);
 
$("#network-arch").tabulator({
    height:350, 
    layout:"fitColumns", //fit columns to width of table (optional)
    movableColumns:false,
    movableRows:true,
    resizableRows:true,
    initialSort: [
        {column:"layer",dir:"asc"}
    ],
    columns:[ //Define Table Columns
        {title:"", field:"layer", align:"center", width:5},
        {title:"Name", field:"name", align:"left"},
        {title:"Type",field:"type", align:"center"}
        // {title:"Parameters", field:"parmeters", align:"left"}
    ]
});


set_layers = function(id,data){
    $(id).tabulator("setData", data);
}
set_layers("#network-arch",all_layers);

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

validate_form = function() {
    // Validate the rest of the form
    return true;
}

remove_bads = function(str) {
    var bads = {"##":"[num]","#":"num","%":"percent","&":"and"}
    for (var key in bads){
        var re = new RegExp(key,"g");
        str = str.replace(re,bads[key])    
    }       
    return str;
}

get_other_params = function() {
    
    var dict = {
        "name": d3.select("#Name").property('value'),
        "comments": d3.select("#Comments").property('value'),
        "size": d3.select("#InputSize").property('value'),
        "shape": d3.select("#InputShape").property('value'),
        "loss": d3.select("#LossFunct").property('value'),
        "user": localStorage.username
    }
    var url = ""
    for (var key in dict)
        url += "&" + key + "=" + dict[key];
    return url;
}

submit_layers = function() {
    localStorage.all_layers = JSON.stringify(all_layers);
    localStorage.optimizer  = JSON.stringify(optimizer);
    if (validate_form) {        
        var client = new HttpClient();
        var url  = '/_submit_layers?layers='+remove_bads(JSON.stringify(all_layers));
            url += '&optimizer='+remove_bads(JSON.stringify(optimizer));
            url += get_other_params();
        client.get(url, function(response) {
            console.log(url)
            console.log(response)
            response = JSON.parse(response).out
            if (response.status == 200){
                d3.select("div.msg").append("h3").classed("msg-good",true).text("Job submitted as "+response.job)
            }else{
                d3.select("div.msg").append("h3").classed("msg-bad",true).text("Job submission failed!")
            }
        });
    }else{

    }
}



// function handleFileSelect(evt) {
//     var files = evt.target.files; // FileList object

//     // Loop through the FileList and render image files as thumbnails.
//     for (var i = 0, f; f = files[i]; i++) {

//       // Only process image files.
//       if (!f.type.match('image.*')) {
//         continue;
//       }

//       var reader = new FileReader();

//       // Closure to capture the file information.
//       reader.onload = (function(theFile) {
//         return function(e) {
//           // Render thumbnail.
//           var span = document.createElement('span');
//           span.innerHTML = ['<img class="thumb" src="', e.target.result,
//                             '" title="', escape(theFile.name), '"/>'].join('');
//           document.getElementById('list').insertBefore(span, null);
//         };
//       })(f);

//       // Read in the image file as a data URL.
//       console.log(reader.readAsDataURL(f));
//     }
//   }

//   document.getElementById('Files').addEventListener('change', handleFileSelect, false);