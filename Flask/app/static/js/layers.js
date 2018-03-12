var all_layers = [];
if (localStorage.all_layers != undefined)
    var all_layers = JSON.parse(localStorage.all_layers);
 
$("#expand-advanced").bind("click",function(){    
    var display = d3.select("table.expand").style('display')
    d3.select("table.expand").style('display',(display == "none" ? "table": "none"));
    d3.select('#expand-advanced').style('display','none');
    d3.select('#collapse-advanced').style('display','table');
});
$("#collapse-advanced").bind("click",function(){
    var display = d3.select("table.expand").style('display')
    d3.select("table.expand").style('display',(display == "none" ? "table": "none"));
    d3.select('#expand-advanced').style('display','table');
    d3.select('#collapse-advanced').style('display','none');
});

$("#network-arch").tabulator({
    height:270, 
    layout:"fitColumns", 
    movableColumns:false,
    movableRows:true,
    resizableRows:true,
    selectable:1,
    placeholder:"Add Layers",
    initialSort: [
        {column:"layer",dir:"asc"}
    ],
    columns:[ //Define Table Columns
        {title:"", field:"layer", align:"center", sorter:"number", width:5},
        {title:"Name", field:"name", align:"left",width:74, editor:true, cellEdited:function(e,cell){edit_layer(e,cell)} },
        {title:"Type",field:"type", align:"left",width:80},
        {title:"Comments",field:"comments", align:"left",editor:true, cellEdited:function(e,cell){edit_layer(e,cell)} }
        // {title:"Parameters", field:"parmeters", align:"left"}
    ],
    rowMoved:function(row){
        //row - row component
        var data = $("#network-arch").tabulator("getData");
        var new_layers = [];
        data.forEach(d => new_layers.push(d));
        var cnt=1; new_layers.forEach(d => d.layer = cnt++);
        all_layers = new_layers;
        set_layers("#network-arch",all_layers);
    }

});

edit_layer = function(e,cell){
    all_layers = $("#network-arch").tabulator("getData");
    set_layers("#network-arch",all_layers);
}

set_layers = function(id,data){
    $(id).tabulator("setData", data);
}
set_layers("#network-arch",all_layers);


function validate(layer) {
    // Add some validation for a single layer
    var current_layers = $("#network-arch").tabulator("getData");
    if (current_layers.filter(d => d.name == layer.name).length > 0)
        return false;
    return true;
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
        "name"    :  d3.select("#Name").property('value'),
        "comments":  d3.select("#Comments").property('value'),
        "input"   :  d3.select("#InputSize").property('value'),
        "loss"    :  d3.select("#LossFunct").property('value'),
        "batchsz" : +d3.select("#Batch_Size").property('value'),
        "shuffle" : +d3.select("#Shuffle").property('checked'),
        "steps"   : +d3.select("#Train_Steps").property('value'),
        "user"    : localStorage.username
    }
    var url = ""
    for (var key in dict)
        url += "&" + key + "=" + dict[key];
    return url;
}

format_layers = function(layers) {
    layers.filter(d => d.type == "Input").forEach(d => d.shape = [-1].concat(d.shape).concat([d.channels]))
    layers.forEach(d => d.type = LayerMap[d.type]);
    layers.filter(d => d.activation).forEach(d => d.activation = d.activation.toLowerCase())

    // More as needed
    return layers;
}

submit_layers = function() {
    localStorage.all_layers = JSON.stringify(all_layers);
    localStorage.optimizer  = JSON.stringify(optimizer);
    new_layers = all_layers.slice();
    new_layers = format_layers(new_layers);    
    if (validate_form) {        
        var client = new HttpClient();
        var url  = '/_submit_layers?layers='+remove_bads(JSON.stringify(new_layers));
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

// Toolbar Events

$("#tool-edit").bind("click",function(){
    var selectedData = $("#network-arch").tabulator("getSelectedData")[0];
    layers = [newLayer(selectedData.type,+$("#InputSize").val().slice(0,1),selectedData)]
    build_list();    
    d3.select("#add_layer").text('Edit').on("click","")
    $("#add_layer").bind("click",function(){        
        layers[0].layer = selectedData.layer;
        all_layers[selectedData.layer-1] = layers[0]
        set_layers("#network-arch",all_layers)
        layers = [newLayer("Select",+$("#InputSize").val().slice(0,1))];
        build_list();
    });
});

$("#tool-copy").bind("click",function(){
    var selectedData = $("#network-arch").tabulator("getSelectedData")[0];
    var new_layer = newLayer(selectedData.type, +$("#InputSize").val().slice(0,1), selectedData)
    trim_copy = function(str){
        if (str.indexOf('-Copy') > 0)
            return str.slice(0,str.indexOf('-Copy'));        
        return str;
    }
    var dups = all_layers.filter(d => trim_copy(d.name) == trim_copy(selectedData.name))
    new_layer.name = trim_copy(new_layer.name)+"-Copy"+dups.length;
    new_layer.layer = all_layers.length+1
    all_layers.push(new_layer)
    set_layers("#network-arch",all_layers)
})
$("#tool-delete").bind("click",function(){
    var selectedData = $("#network-arch").tabulator("getSelectedData")[0];
    all_layers = all_layers.filter(d => d.layer != selectedData.layer);
    var cnt=1; all_layers.forEach(d => d.layer = cnt++);
    set_layers("#network-arch",all_layers);
})


