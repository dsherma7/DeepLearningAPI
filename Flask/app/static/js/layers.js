/**********************************
* Main Tabulator table for layers *
***********************************/

$("#network-arch").tabulator({
    height:300, 
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

function edit_layer(e,cell){
    all_layers = $("#network-arch").tabulator("getData");
    set_layers("#network-arch",all_layers);
}

function set_layers(id,data){
    $(id).tabulator("setData", data);
}
set_layers("#network-arch",all_layers);


/*********************************
* Bottom toolbar for Layer Table *
**********************************/

// Lower toolbar events for table
$(function(){
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
        var dups = all_layers.hard_copy().filter(d => trim_copy(d.name) == trim_copy(selectedData.name))
        new_layer.name = trim_copy(new_layer.name)+"-Copy"+dups.length;
        new_layer.layer = all_layers.length+1
        all_layers.push(new_layer)
        set_layers("#network-arch",all_layers)
    });
    $("#tool-delete").bind("click",function(){
        var selectedData = $("#network-arch").tabulator("getSelectedData")[0];
        all_layers = all_layers.filter(d => d.layer != selectedData.layer);
        var cnt=1; all_layers.forEach(d => d.layer = cnt++);
        set_layers("#network-arch",all_layers);
    });
});

/*****************************
* Sends Job Info to back-end *
******************************/

submit_layers = function() {
    /*
        Main function for sending job information
        to back-end. Pulls the information from the
        layer table and from the remaining form.
    */    
    AddLoadingBar();
    StoreNetwork();    
    if (validate_form) {        
        var client = new HttpClient();        
        client.post('/_submit_layers',get_all_params(),function(response){
            var font = d3.select("#message-row").append("font").attr('class','msg-good').text(response.msg)
            if (response.status != STATUS_OK)
                font.attr('class','msg-bad')
            d3.select("#message-row").selectAll("font").transition().duration(6000).ease(d3.easeBack)
              .style("opacity",0).on("end",function(){ d3.select(this).remove();});            
            Kill_Loading();
        });
    }else{
        // Error message
    }
}

function get_all_params() {
    if (validate_form()){
        var new_layers = all_layers.hard_copy(),
            new_layers = format_layers(new_layers);
          
        var params = {"train":get_other_params()};
        params['layers'] = new_layers;
        params['train']['optimizer'] = optimizer;

        return params;
    }
    return undefined;
}

function validate_form() {
    // Validate the rest of the form
    return true;
}

format_layers = function(layers) {
    layers.filter(d => d.type == "Input").forEach(d => d.shape = [-1].concat(d.shape).concat([d.channels]))
    layers.forEach(d => d.type = LayerMap[d.type]);
    layers.filter(d => d.activation).forEach(d => d.activation = d.activation.toLowerCase())
    // More as needed
    return layers;
}

function remove_bads(str) {
    var bads = {"##":"[num]","#":"num","%":"percent","&":"and"}
    for (var key in bads){
        var re = new RegExp(key,"g");
        str = str.replace(re,bads[key])    
    }       
    return str;
}

get_other_params = function() {
    function val_of(obj){
        switch (obj.type){
            case "checkbox":
                return obj.checked;
            case "number":
                return +obj.value;
            default:
                return obj.value;
        }
    }
    var dict = { "user":localStorage.username }
    d3.select(".main").selectAll('input,select').filter(function(){
        return this.getAttribute('id') != null & 
               this.getAttribute('id') != 'layers' &
               this.getAttribute('id') != 'Optimizer';
    }).each(function(d){
        dict[this.getAttribute("id")] = val_of(this);
    })
    return dict;    
}


