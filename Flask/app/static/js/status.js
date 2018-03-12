// Re-build table on username change
$("#btn-login").bind("click",function(){
    SetStorage(d3.select('#nav-remember').property('checked'));
    user = localStorage.username;
    var client = new HttpClient();
    client.get('/_get_jobs?user='+user, function(response) {
        $("#example-table").tabulator("setData", JSON.parse(response));
    });    
    $("#username").val(localStorage.username);
    $("#example-table").tabulator("setFilter", "status", "!=", "archived");
});

// Archive a job
archive = function(){
    var data = $("#example-table").tabulator("getSelectedData")[0];
    if (!data){ return NoJob(); }
    var user = data.user, job = data.job;
    var client = new HttpClient();
    var url = "_archive?user=" + user + "&job=" + job;
    client.get(url, function(response) { 
        response = JSON.parse(response);
        if (response.status != STATUS_OK)
            $.alert("Returned error code: "+response.code,"Archive Failed")
    });
}


// Upper Toolbar
check_archived = function(){
    if (d3.select("#ck-archived").node().checked){
        $("#example-table").tabulator("setFilter", "status", "!=", "archived");
    }else{
        $("#example-table").tabulator("setFilter","job","!=","");
    }
}

$("#clear-filter").on('click',function(x){ 
    $("#txt-filter").val(undefined); 
    $("#example-table").tabulator("setFilter","job","!=","");
    check_archived();
});
$("#txt-filter").on('keydown keyup',function(x){
    var job = x.currentTarget.value;
    var selected = $("#example-table").tabulator("getSelectedData")[0];
    if (job){
        $("#example-table").tabulator("setFilter", function(data,filterParams){
            return (data.job.includes(filterParams.job) || (selected && (data.job == selected.job))) 
                    && (!d3.select("#ck-archived").node().checked || data.status!="archived");

        },{'job':job});
    }else{
        $("#example-table").tabulator("setFilter","job","!=","");        
        check_archived();
    }
})
$("#ck-archived").bind("change",check_archived)
$("#btn-train,#btn-test,#btn-eval").on('click',function(x){TrainTestEval(x)});
$("#btn-download").on('click',function(){ $.alert("Coming Soon!"); });
$("#advanced-menu").on('click',function(){ document.getElementById("adv-menu").classList.toggle("show"); });


NoJob = function(){
    $.alert({
        theme:"modern",
        columnClass: 'medium',
        title:"No Job Selected",
        content:"A target job must first be selected!",
        buttons: {
            ok: {
                keys: ['enter', 'esc']
            }
        }        
    })
}

TrainTestEval = function(x){
    var type = x.currentTarget.name;
    var data = $("#example-table").tabulator("getSelectedData")[0];
    if (!data){ return NoJob(); }        
    var user = data.user, job = data.job;
    var client = new HttpClient();
    var url = "_get_dtypes?user=" + user + "&job=" + job;
    client.get(url, function(response) { 
        var dtypes = JSON.parse(response).dtypes;
        if (!dtypes.length){
            $.alert({
                theme:"modern",
                columnClass: 'medium',
                title:"Publish Data",
                content:"No data found for job "+job+'!<br>'+"Use \"Publish Data\" below to publish a dataset.",
                buttons: {
                    ok: {
                        keys: ['enter', 'esc']
                    }
                }
            });
        }else{
            var selectVal;             
            $.confirm({
                theme:"modern",
                columnClass: 'medium',
                title:  type + ' Network',
                content: 'Choose a dataset to ' + type + ' the network for job ' + job +'.',
                type: 'blue',
                backgroundDismiss: 'submit',
                typeAnimated: true,    
                onContentReady: function(){
                    d3.select("div.jconfirm-buttons")              
                      .insert("select",":first-child")
                      .attr("id",'jconfirm-select')              
                      .classed("jconfirm-select",true)
                      .on('change',function(x){
                        selectVal = this.value;
                      }).selectAll("option")
                        .data(['[ Type ]'].concat(dtypes))
                        .enter()
                        .append("option")
                        .text(d=>d);
                },
                buttons: {
                        submit: {
                            text: type,
                            btnClass: 'btn-blue',
                            action: function(){
                                if (selectVal){
                                    $.confirm({
                                        theme: "modern",
                                        title: 'Confirm '+type,
                                        content: 'Are you sure you want to '+ type + " Job "+job + "?",
                                        type: 'blue',
                                        typeAnimated: true,
                                        buttons: {
                                            confirm:{
                                                text: type,
                                                btnClass: 'btn-blue',
                                                action:function(){                                        
                                                    var url = "/_"+type.toLowerCase()+"?user=" + user + "&job=" + job +"&datatype=" + selectVal;                                        
                                                    var client = new HttpClient();
                                                    // Loading bar
                                                    d3.select("#message-row").append("div").classed("loader",true);
                                                    d3.select("#message-row").append("i").classed("loader",true).text("Loading ......");
                                                    d3.select(".loader").transition().duration(60000).style("opacity",0).on("end",function(){ 
                                                        $.alert("Failed"); d3.selectAll(".loader").remove();
                                                    });
                                                    
                                                    client.get(url, function(response) { 
                                                        if (type == 'Train'){
                                                            $.alert(JSON.parse(response).msg);
                                                            d3.selectAll(".loader").remove();
                                                        }else if (type == 'Test'){
                                                            response = JSON.parse(response);
                                                            var csvContent = "";
                                                            var preds = response.probs, classes = response.classes;
                                                            // Build Header
                                                            csvContent += "Prediction,";
                                                            for (var i=0; i<preds[0].length; i++){
                                                                csvContent += "Prob_"+i;
                                                                if (i < preds[0].length-1)
                                                                    csvContent += ",";
                                                            }
                                                            csvContent += "\n";
                                                            // Builds remaining rows
                                                            for (var i=0; i<classes.length; i++){
                                                                csvContent += classes[i]+","+preds[i].join(",")+"\n";
                                                            }
                                                            // Download as CSV                                                            
                                                            csvData = new Blob([csvContent], { type: 'text/csv' }); 
                                                            var csvUrl = URL.createObjectURL(csvData);
                                                            var link = document.createElement("a");
                                                            link.href =  csvUrl;
                                                            link.setAttribute('download', job+"_"+selectVal+".csv");
                                                            link.click(); 
                                                            d3.selectAll(".loader").remove();
                                                        }else if (type == 'Evaluate'){
                                                            var evals = JSON.parse(response).evals;
                                                            var evals_txt = "<div class='evals'>" + "<b>Data:</b>" + selectVal + "<br>"+ 
                                                                            "<b>Accuracy:</b>" + evals.accuracy + "<br>"+
                                                                            "<b>Loss:</b>" + evals.loss + "<br>"+
                                                                            "<b>Global Step:</b>" + evals.global_step + "</div>";
                                                            $.alert({
                                                                theme:"modern",
                                                                title:  "Evaluation of "+job,
                                                                content: evals_txt,
                                                                type: 'blue',
                                                                backgroundDismiss: 'submit',
                                                                buttons: {
                                                                    ok: {
                                                                        keys: ['enter', 'esc']
                                                                    }
                                                                } 
                                                            });
                                                            d3.selectAll(".loader").remove();
                                                        }else {
                                                            $.alert("Bad Type specifed!");
                                                            d3.selectAll(".loader").remove();
                                                        }                                                        
                                                    });
                                                }
                                            },
                                            close: function () {                                                    
                                            }    
                                        }
                                    });
                                }else{
                                    d3.select("div.jconfirm-box")
                                      .append("text")
                                      .classed("jconfirm-err",true)
                                      .text("Error, please select a dataset!")
                                      return false;
                                }
                            }
                        },
                        close: function () {                
                        }
                    }
            });  
        }      
    });
}

chg_comment = function(cell){
	var data = cell.getData();
	var url = "/_set_comment?user=" + data.user + "&job=" + data.job +"&comment=" + data.comment;
	var client = new HttpClient();
	client.get(url, function(response) {
	    // do something with response
	});
}

var status_enum = {'designed':1,'building':1.2,'built':1.5,'training':2,'trained':3,'testing':4,'tested':5,'evaluating':6,'evaluated':7,'downloaded':8};
status_sorter = function(a,b) { return status_enum[a.toLowerCase()]-status_enum[b.toLowerCase()]; }

// Build data Table
$("#example-table").tabulator({
    height:400, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    layout:"fitColumns", //fit columns to width of table (optional)
    movableColumns:true,
    resizableRows:true,
    responsiveLayout:true,
    selectable:1,
    placeholder:"No Jobs For User "+localStorage.username,    
    tooltips:true,
    // pagination:"local", //enable local pagination.
    // paginationSize:12, 
    initialSort: [
    	{column:"job",dir:"asc"}
    ],
    index:"job",
    columns:[ //Define Table Columns
        {title:"Job",        field:"job",     align:"center", minWidth:80, frozen:true,response:0},
        {title:"Project",    field:"project", align:"left",   minWidth:200,response:2},
        {title:"Submit Date",field:"date",    align:"center", minWidth:120,sorter:"date",response:4},
        {title:"Progress",   field:"progress",align:"left",   minWidth:80, formatter:"progress",formatterParams:{color:"#6b3399"},response:3},
        {title:"Status",     field:"status",  align:"center", minWidth:50, sorter:status_sorter,response:1},
        {title:"Comment",    field:"comment", align:"left",   minWidth:80, cellEdited:chg_comment,editor:true,response:5}        
    ],
    rowSelected:function(row){
        $("#selected").val( JSON.stringify(row.getData()))
        // row.freeze();
    },        
    rowDeselected:function(row){
        // row.unfreeze();
    }    
});

// Reads the jobs for a user and sets the data table
on_load = function(){
    get_data();
    // Sets username
    $("#submit").on("mouseover",function(){ 
        $("#username").val(localStorage.username); 
    });
    // Removes flash on image
    d3.select("#messages")
      .selectAll("font")
      .transition().duration(5000).ease(d3.easeBack)
      .style("opacity",0)
      .on("end",function(){
        d3.select(this).remove()
    });
    // Hides any archived jobs
    $("#example-table").tabulator("setFilter", "status", "!=", "archived");
}
get_data = function(){
    var user = localStorage.username;
    var client = new HttpClient();
    client.get('/_get_jobs?user='+user, function(response) {
        $("#example-table").tabulator("setData", JSON.parse(response));   
        check_archived();
    });    
}; 
$(document).ready(on_load);


