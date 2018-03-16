
if (localStorage.username != undefined)
	window.location.href = "/home";

$(function(){
	$("#login").bind("click",login)
});

login = function(){
	localStorage.username = $("#Login").val();	
	// Fancy text
	d3.select("h3").transition().duration(400).ease(d3.easeSin).style("font-size","95px")
	
	// Make Opacity = 0
  	d3.select("#Login").transition().duration(500).ease(d3.easeCircle).style("opacity",0)
  	  .on('end',function(){ d3.select(this).remove();});
  	d3.select(".header > p").transition().duration(500).ease(d3.easeSin).style("opacity",0)
  	  .on('end',function(){ d3.select(this).remove();});
	d3.select(".signup").transition().duration(500).ease(d3.easeCircle).style('opacity',0)
	  .on('end',function(){ d3.select(this).remove();});
	d3.select("#login").transition().duration(500).ease(d3.easeCircle).style('opacity',0)
	  .on('end',function(){ d3.select(this).remove(); });
  	
	// Slide screeen up
	d3.select('div.main-img').transition().delay(500).duration(1500).ease(d3.easeCircle)
	  .style('opacity',1).style('transform','translate(0px,-1000px)')
	d3.select('body').transition().delay(1300).on('end',function(){
		window.location.href = "/home";
	})
}

