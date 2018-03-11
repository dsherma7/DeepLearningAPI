$("#example-table").tabulator({
    height:200, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    layout:"fitColumns", //fit columns to width of table (optional)
    movableColumns:true,
    resizableRows:false,
    selectable:1,
    placeholder:"Login to See Current Jobs",
    tooltip: true,
    initialSort: [
        {column:"job",dir:"asc"}
    ],
    columns:[ //Define Table Columns
        {title:"Job", field:"job", align:"center", width:80, cellClick:function(e, cell){cellAlert(e,cell)}},
        {title:"Project", field:"project", align:"left",width:270},
        {title:"Progress", field:"progress", align:"left", formatter:"progress",formatterParams:{color:"#6b3399"},width:170},
        {title:"Status", field:"status", align:"center", width:80}
    ],
    rowSelected:function(row){
        //row - row component for the selected row        
    }    
});


user = localStorage.username;
var client = new HttpClient();
client.get('/_get_jobs?user='+user, function(response) {
    // do something with response
    $("#short-tbl").tabulator("setData", JSON.parse(response));
});