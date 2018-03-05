// create Tabulator on DOM element with id "example-table"
var cellAlert = function(e,cell){
	cell_val = cell.getData()[e.currentTarget.getAttribute('tabulator-field')]
	alert("Cell "+cell_val+' clicked!')
}

var chg_comment = function(cell){
	var data = cell.getData();
	var url = "/_set_comment?user=" + data.user + "&job=" + data.job +"&comment=" + data.comment;
	var client = new HttpClient();
	client.get(url, function(response) {
	    // do something with response
	});
}

$("#example-table").tabulator({
    height:400, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    layout:"fitColumns", //fit columns to width of table (optional)
    movableColumns:true,
    resizableRows:true,
    selectable:true,
    initialSort: [
    	{column:"job",dir:"asc"}
    ],
    columns:[ //Define Table Columns
        {title:"Job", field:"job", align:"center", width:80, cellClick:function(e, cell){cellAlert(e,cell)}},
        {title:"Project", field:"project", align:"left",width:270},
        {title:"Submit Date",field:"date", sorter:"date", align:"center",width:160},
        {title:"Progress", field:"progress", align:"left", formatter:"progress",formatterParams:{color:"#6b3399"},width:170},
        {title:"Status", field:"status", align:"center", width:80, cellClick:function(e, cell){cellAlert(e,cell)}},
        {title:"Comment", field:"comment", editor:true, cellEdited:function(e,cell){chg_comment(e,cell)}}
    ]
});

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


var client = new HttpClient();
client.get('/_get_jobs?user=dsherman', function(response) {
    // do something with response
    $("#example-table").tabulator("setData", JSON.parse(response));
});

//  Allows the user to see other users (just for debugging)
$(function() {
  $('select#users').bind('change', function() {    
    var user = $("select#users option:selected").text();

    client.get('/_get_jobs?user='+user, function(response) {
    	// do something with response
    	$("#example-table").tabulator("setData", JSON.parse(response));
	});

  });
}); 



