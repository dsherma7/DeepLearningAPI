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

function parse_params(obj,param) {
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
           .attr("type","text");
        break; 

      case "FilterField":
        var row = 
        obj.append("td")
        for (var i=0; i<field.Size; i++){
           row.append("input")
              .attr("type","text")
              .style("width","25px");
           if (i+1 < field.Size)
            row.append("text").text("x");
         }
        break; 

      case "SelectField":
        obj.append("td")
           .append("select")
           .selectAll("option")
           .data(field.Choices)
           .enter()
           .append("option")           
           .text(function(d){return d;})
        break;

      case "Text":
        obj.append("td")
           .append("text")
           .text(field.text)
        break;

    }

  });
}


function add_layer(layer_type) {
  // This should add the layer to a list of current layers
  
  // Remove old list items, but save them for later
  var lis = d3.select("ul#current").selectAll('li'),
      txt = lis.nodes()
  lis.remove()

  // Add current layer on top
  d3.select("ul#current")
    .append('li')
    .text(layer_type)

  // Add the rest back in reverse order
  txt.forEach(function(d){
    d3.select("ul#current")
    .append('li')
    .text(d.innerText)
  })





}