
/*****************
* On Load Events *
******************/

var all_layers = (localStorage.all_layers != undefined ? JSON.parse(localStorage.all_layers) : []);
var optimizer = (localStorage.optimizer != undefined ? JSON.parse(localStorage.optimizer) : newOptimizer('grad') );
$(document).ready(LoadNetwork);
var layers = [ newLayer('Input') ];

/*********************************
* Dynamic Layer/Optimizer Events *
**********************************/

$(build_list);
$(function() {
  $('select#Optimizer').bind('change', function() {
    // Delete previous optimizer components
    d3.select("td#opts").select("table").remove();
    d3.select("td#opts").select("input").remove();
    // Build new optimizer
    var optimizerType = d3.select("select#Optimizer").property('value');
    optimizer = newOptimizer(optimizerType);
    // Add to the form
    var tbl = d3.select("td#opts").append("p").append("table");
    Array.prototype.forEach.call(optimizer.attr, function(param) {
        parse_params(tbl.append("tr"),param,optimizer);
    });
  });
});

function parse_params(obj,param,value) {
     /* Parses the request from /_get_params
        Must specify each type of field and 
        the exact components needed.
     */
    obj.append("td").text(param.Name);
    // Could add multiple elements per row
    param.Fields.forEach(function(field){

      switch(field.Field) {
        case "StringField":
          obj.append("td")
             .append("input")
             .attr("type","text")
             .attr("placeholder",field.Placeholder)
             .attr("value",field.Value)
             .on('change', function(d) {
                value[param.Var] = this.value;
             });
          break; 

        case "FilterField":
          var size = +$("#InputSize").val().slice(0,1);
          var row = obj.append("td")
          for (var i=0; i<size; i++){
             row.append("input")
                .attr("type","text")
                .style("width",1/size*180+"px")
                .attr("placeholder",field.Placeholder)
                .attr("value",field.Value[i])
                .attr('idx',i)
                .on('change', function(d,j=i) {
                  value[param.Var][+this.getAttribute('idx')] = +this.value;
                });
             if (i+1 < size)
              row.append("text").text("x");
           }
          break; 

        case "NumberField":
          obj.append("td")
             .append("input")
             .attr("type","text")
             .attr("placeholder",field.Placeholder)
             .attr("value",field.Value)
             .style("width","50%")
             .on('change', function(d) {
                value[param.Var] = +this.value;
             });
          break;

        case "SelectField":
          obj.append("td")
             .append("select")
             .on('change', function() {
                value[param.Var] = this.value;
             })
             .selectAll("option")
             .data(field.Choices)
             .enter()
             .append("option")           
             .text(function(d){return d;});
             
          break;

        case "Text":
          obj.append("td")
             .append("text")
             .text(field.text)
             .on('change', function(d) {
                value[param.Var] = this.value;
             });
          break;

        case "BooleanField":
          obj.append("td")
             .append("input")
             .attr("type","checkbox")
             .property('checked', field.Value)
             .on('change', function(d) {
                value[param.Var] = +this.checked;
             });
          break;
      }

    });
  }

function build_list() {
  /*
    Builds the necessary components for 
    the selected layer based on util.js
  */
  var container = d3.select("td#layers");
  container.selectAll("*").remove();

  Array.prototype.forEach.call(layers, function(layer) {

    var tbl = container.append("p").append("table");

    var obj = tbl.append("tr");
    obj.append("td").text("Type:");
    var select = obj.append("td")
        .append("select")
        .attr('id','layers');        
    select.selectAll("option")
        .data(LayerTypes)
        .enter()
        .append("option")           
        .text(function(d){return d;});
    select.on('change', function(d=layer) {
      var index = layers.findIndex(function(f) {return f==layer;});
      layers[index] = newLayer(this.options[this.selectedIndex].value,+$("#InputSize").val().slice(0,1));
      build_list();
    });

    if (layer!=null) {
      select.property('value',layer.type);

      Array.prototype.forEach.call(layer.attr, function(param) {
        parse_params(tbl.append("tr"),param,layer);
      });                 

      var tr = tbl.append('tr');
          tr.append('td')
            .attr('align','left')
            .append('button')
            .classed('btn-layer',true)
            .attr('type','button')        
            .attr('id','add_layer')
            .text('Add')
            .on('click',d => add_layer(layer));

          tr.append('td')
            .attr('align','left')
            .append('button')  
            .classed('btn-layer',true)      
            .attr('type','button')
            .attr('id','clear_layer')
            .text('Clear')
            .on('click',d => clear_layer(layer));
    }
  });
  reset_height();
}

function clear_layer(layer) {  
  var index = layers.findIndex(function(f) {return f==layer;});
  layers[index] = newLayer(layer.type,+$("#InputSize").val().slice(0,1));
  localStorage.removeItem("all_layers");
  localStorage.removeItem("optimizer");  
  build_list();
}

function add_layer(layer) {
  if (validate(layer)){
    var  new_layer = newLayer(layer.type,+$("#InputSize").val().slice(0,1),layer);
    new_layer['layer'] = all_layers.length+1;
    delete new_layer.Fields;
    all_layers.push(new_layer);
    set_layers('#network-arch',all_layers);
    var index = layers.findIndex(function(f) {return f==layer;});
    layers[index] = newLayer(layer.type,+$("#InputSize").val().slice(0,1));
    build_list();
  }else{
    d3.select('td#layers').select('table')
      .append('tr').append('td').append('td')
      .append("text").classed("txt-err",true)
      .text("Error, check values and try again!")
  }
}

function validate(layer) {
    // Add some validation for a single layer
    var current_layers = $("#network-arch").tabulator("getData");
    if (current_layers.filter(d => d.name == layer.name).length > 0)
        return false;
    return true;
}

/*********************************
* Dynamics components for the UI *
**********************************/

// For the Clear btn
Clear = function() { 
  ClearNetwork(); 
  document.location='/build'; 
}
// "Advanced" job parameters
$("#expand-advanced").bind("click",function(){    
    var display = d3.select("table.expand").style('display')
    d3.select("table.expand").style('display',(display == "none" ? "table": "none"));
    d3.select('#expand-advanced').style('display','none');
    d3.select('#collapse-advanced').style('display','table');
    reset_height();
});
$("#collapse-advanced").bind("click",function(){
    var display = d3.select("table.expand").style('display')
    d3.select("table.expand").style('display',(display == "none" ? "table": "none"));
    d3.select('#expand-advanced').style('display','table');
    d3.select('#collapse-advanced').style('display','none');
    reset_height();
});
function reset_height(){
    // Allows the the height to change when advanced is toggles
    $("#network-arch").tabulator("setHeight",300);
    var newHeight = d3.select("#tbl-col").node().getBoundingClientRect().height-60;
    $("#network-arch").tabulator("setHeight",newHeight);
}