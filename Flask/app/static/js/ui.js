var layers = [
  new InputLayer(name="Input"),
  new ConvLayer(name="Conv-1"),
  new OutputLayer(name="Output")
];
var optimizer;

$(build_list);

$(function() {
  $('select#LayerType').bind('change', function() {

    // Delete the previous components
    d3.select("td#layers").select("table").remove();
    d3.select("td#layers").select("input").remove();

    // Calls any flask function preceded by @app.route('/_get_params')
    $.getJSON('/_get_params', {
      // The inputs to the Python function
      layer: $("select#LayerType option:selected").text(),
      size:  $("select#InputSize option:selected").text()
    }, function(params) {
        // params is the output from the python function      
        var tbl = d3.select("td#layers")
                    .append("p")
                    .append("table")
        params["params"].forEach(function(param){
          parse_params(tbl.append("tr"),param);
        });

        // Add "Add Layers" button
        d3.select("td#layers")
          .append("input")
          .attr("type","button")
          .attr("value","Add Layer")
          .on("click",function(){
            var layer_type =  $("select#LayerType option:selected").text();
            add_layer(layer_type);
          })

    });    
    // If failed
    return false;
  });
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

$(function() {
  $('input[type=submit]').click(function() {
    $.post('/submit_extra', {'layers':layers,'optimizer':optimizer}, function(d) {return;}, "json");
  });
});

function build_list() {

  var container = d3.select("td#layers");
  container.selectAll("*").remove();

  Array.prototype.forEach.call(layers, function(layer) {

    var tbl = container.append("p").append("table");

    var obj = tbl.append("tr");
    obj.append("td").text("Type:");
    var select = obj.append("td")
        .append("select");
    select.selectAll("option")
        .data(LayerTypes)
        .enter()
        .append("option")           
        .text(function(d){return d;});
    select.on('change', function(d=layer) {
      var index = layers.findIndex(function(f) {return f==layer;});
      layers[index] = newLayer(this.options[this.selectedIndex].value);
      build_list();
    });

    if (layer!=null) {
      select.property('value',layer.type);

      Array.prototype.forEach.call(layer.attr, function(param) {
        parse_params(tbl.append("tr"),param,layer);
      });
    }

  });
}

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
        var row = 
        obj.append("td")
        for (var i=0; i<field.Size; i++){
           row.append("input")
              .attr("type","text")
              .style("width","25px")
              .on('change', function(d) {
                value[param.Var] = this.value;
              });
           if (i+1 < field.Size)
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
              value[param.Var] = this.checked;
           });
        break;
    }

  });
}