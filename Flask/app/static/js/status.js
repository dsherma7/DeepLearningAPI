// Re-build table on username change
var oldVal = "";
function Observe(){
    if($("#dd-login").text() != oldVal){
     $("#dd-login").trigger('change');
    }
    oldVal = $("#dd-login").text();
}
$(function(){ setInterval(Observe,500);})
$("#dd-login").change(function () {
    $(this).change(function () {
        update();
    });
});
function update(){
    SetStorage(d3.select('#nav-remember').property('checked'));
    user = localStorage.username;
    var client = new HttpClient();
    client.get('/_get_jobs?user='+user, function(response) {
        $("#example-table").tabulator("setData", JSON.parse(response));
    });    
    $("#username").val(localStorage.username);
    $("#example-table").tabulator("setFilter", "status", "!=", "archived");
}

// Archive a job
archive = function(){
    var data = $("#example-table").tabulator("getSelectedData")[0];
    if (!data){ return NoJob(); }
    var user = data.user, job = data.job;
    var client = new HttpClient();
    var url = "_archive?user=" + user + "&job=" + job;
    client.get(url, function(response) { 
        response = JSON.parse(response);
        $("#dd-login").trigger('change');
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

Attach_Data = function(user,job,type,selectVal) {
    $.confirm({
        theme: "modern",
        title: 'Confirm '+type,
        content: 'Are you sure you want to '+ type + " Job "+ job + "?",
        type: 'blue',
        typeAnimated: true,
        buttons: {
            confirm:{
                text: type,
                btnClass: 'btn-blue',
                action:function(){                                        
                    var url = "/_"+type.toLowerCase()+"?user=" + user + "&job=" + job +"&datatype=" + selectVal;                                        
                    var client = new HttpClient();
                    AddLoadingBar();                    
                    client.get(url, function(response) { 
                        response = JSON.parse(response);
                        if (response.status == STATUS_OK){
                            if (type == 'Train'){
                                $.alert({
                                    theme:"modern",                                
                                    title: 'Training Complete',
                                    content: response.msg,
                                    buttons: {
                                        ok: {
                                            keys: ['enter', 'esc']
                                        }
                                    } 
                                });
                                Kill_Loading();
                            }else if (type == 'Test'){                            
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
                                SaveCSV(csvContent,job+"_"+selectVal+".csv");                                                                                      
                                Kill_Loading();
                            }else if (type == 'Evaluate'){
                                var evals = response.evals;
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
                                Kill_Loading();
                                
                            }else {
                                $.alert({
                                    theme:"modern",
                                    type:"red",
                                    title:"Error!",
                                    content:"Bad Type specifed!",
                                    buttons: {
                                        ok: {
                                            keys: ['enter', 'esc']
                                        }
                                    } 
                                });
                                Kill_Loading();
                            }
                            $("#dd-login").trigger('change');                                                   
                        }else{
                            $.alert({
                                theme:"modern",
                                type:"red",
                                title:"Error!",
                                content:response.msg,
                                buttons: {
                                    ok: {
                                        keys: ['enter', 'esc']
                                    }
                                } 
                            });
                            Kill_Loading();
                        }                             
                    });                       
                }
            },
            close: function () {                                                    
            }    
        }
    });
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
                                    Attach_Data(user,job,type,selectVal);
                                }else{
                                    d3.select("div.jconfirm-box").append("text")
                                      .classed("jconfirm-err",true).text("Error, please select a dataset!");
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
    initialSort: [
    	{column:"job",dir:"asc"}
    ],
    index:"job",
    columns:[ //Define Table Columns
        {title:"Job",        field:"job",     align:"center", width:80,    minWidth:80, frozen:true,response:0},
        {title:"Project",    field:"project", align:"left",   width:"30%", minWidth:200,response:2},
        {title:"Date",       field:"date",    align:"center", width:"10%", minWidth:120,sorter:"date",response:4},
        {title:"Progress",   field:"progress",align:"left",   width:"12%", minWidth:80, formatter:"progress",formatterParams:{color:"#48A7F1"},response:3},
        {title:"Status",     field:"status",  align:"center", width:"10%", minWidth:50, sorter:status_sorter,response:1},
        {title:"Comment",    field:"comment", align:"left",                minWidth:80, cellEdited:chg_comment,editor:true,response:5}        
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
    $("#submit").on("mouseover focus",function(){ 
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


