$("#short-tbl").tabulator({
    height:"75%", 
    layout:"fitColumns", 
    movableColumns:true,
    resizableRows:false,
    selectable:1,
    placeholder:"No Current Jobs",
    tooltip: true,
    initialSort: [
        {column:"job",dir:"des"}
    ],
    columns:[ //Define Table Columns
        {title:"Job", field:"job", align:"center", width:80, cellClick:function(e, cell){cellAlert(e,cell)}},        
        {title:"Status", field:"status", align:"center", width:80},
        {title:"Project", field:"project", align:"left"}
        // {title:"Progress", field:"progress", align:"left", formatter:"progress",formatterParams:{color:"#6b3399"}}
    ],
    rowSelected:function(row){
        //row - row component for the selected row        
    }    
});

$(document).ready(function(){
    user = localStorage.username;
    var client = new HttpClient();
    client.get('/_get_jobs?user='+user, function(response) {
        // do something with response
        $("#short-tbl").tabulator("setData", JSON.parse(response));
        $("#short-tbl").tabulator("setFilter", "status", "!=", "archived");
    });
});