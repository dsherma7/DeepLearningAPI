
var layers = [
  new InputLayer(name="Input"),
  // new ConvLayer(name="Conv-1"),
  // new OutputLayer(name="Output")
];

var optimizer = newOptimizer('grad');
if (localStorage.optimizer != undefined)
    var optimizer = JSON.parse(localStorage.optimizer);


$(build_list);


$(function() {
  $('submit').bind('click', submit_layers);
});

$(function() {
  $('select#Optimizer').bind('change', function() {

    //delete previous components
    d3.select("td#opts").select("table").remove();
    d3.select("td#opts").select("input").remove();

    var optimizerType = d3.select("select#Optimizer").property('value');
    optimizer = newOptimizer(optimizerType);

    var tbl = d3.select("td#opts")
                .append("p")
                .append("table");

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
             .on('change', function(d) {
                value[param.Var] = +this.checked;
             });
          break;
      }

    });
  }

function build_list() {

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
}

clear_layer = function(layer) {  
  var index = layers.findIndex(function(f) {return f==layer;});
  layers[index] = newLayer(layer.type,+$("#InputSize").val().slice(0,1));
  localStorage.removeItem("all_layers");
  localStorage.removeItem("optimizer");  
  build_list();
}

add_layer = function(layer) {
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
