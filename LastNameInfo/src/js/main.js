var searchOn = true;
var searchName = "";
var spinner;
var chartsLoaded = 0;
var TOTAL_CHARTS = 3;

// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
//google.setOnLoadCallback(drawChart);

function setSearchStatus(abool, name){
	searchOn = abool;
	if (searchOn){
		spinner.stop();
		$("#allcontent").addClass('allon').removeClass('alloff');
	}
	else{
		console.log("not searching");
		$("#allcontent").addClass('alloff').removeClass('allon');
	}
	searchName = name;
	chartsLoaded = 0;
}

function setSpinnerStatus(){
	chartsLoaded = chartsLoaded + 1;
	if (chartsLoaded == TOTAL_CHARTS){
		spinner.stop();
	}
}

function toProperCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
 
function readyToAddChart(name){
	if (searchOn || searchName.toLowerCase() != name.toLowerCase()){
		return false;
	}
	return true;
}

function addSpinner(){
	var opts = {
		  lines: 13 // The number of lines to draw
		, length: 28 // The length of each line
		, width: 14 // The line thickness
		, radius: 42 // The radius of the inner circle
		, scale: 1 // Scales overall size of the spinner
		, corners: 1 // Corner roundness (0..1)
		, color: '#D8B443' // #rgb or #rrggbb or array of colors
		, opacity: 0.55 // Opacity of the lines
		, rotate: 0 // The rotation offset
		, direction: 1 // 1: clockwise, -1: counterclockwise
		, speed: 1 // Rounds per second
		, trail: 60 // Afterglow percentage
		, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
		, zIndex: 2e9 // The z-index (defaults to 2000000000)
		, className: 'spinner' // The CSS class to assign to the spinner
		, top: '100%' // Top position relative to parent
		, left: '50%' // Left position relative to parent
		, shadow: false // Whether to render a shadow
		, hwaccel: false // Whether to use hardware acceleration
		, position: 'absolute' // Element positioning
	}
	var target = document.getElementById('spinnerdiv');

	spinner = new Spinner(opts).spin(target);
}

function addTextBox(name, data){
	if (readyToAddChart(name)){
		$( "#charts" ).prepend( "<p id='txt' class='chart'></p>" );
		$( "#txt" ).html(data);
	}
}

 
//draws a piechart with the given data 
function drawPieChart(name, rowdata) {
	//console.log(name);
	if (readyToAddChart(name)){
	    // Create the data table.
	    var data = new google.visualization.DataTable();
	    data.addColumn('string', 'Nationality');
	    data.addColumn('number', 'Number');
	    //var d = data;//[["Indian", 1], ["Canadian", 2], ["American", 20], ["English", 6], ["Australian", 3], ["Scottish", 2]];
	    data.addRows(rowdata);
	
	    // Set chart options
	    var title  = 'Famous people with the last name '+name+' by nationality';
	    var options = {'title':title,
	    				'is3D': true,
	    				'fontSize':18,
	                   'width':680,
	                   'height':300};
	
	    // Instantiate and draw our chart, passing in some options.
	    $( "#charts" ).append( "<div id='c1' class='chart'></div>" );
	    var chart = new google.visualization.PieChart(document.getElementById('c1'));
	    chart.draw(data, options);
	}
}
  
function drawTimeline(name, rowdata) {
	if (readyToAddChart(name) && rowdata.length > 0){
		$( "#charts" ).append( "<div id='c2' class='chart'></div>" );
	    var chart = new google.visualization.Timeline(document.getElementById('c2'));
	    var data = new google.visualization.DataTable();
	
		data.addColumn({ type: 'string', id: 'Term' });
	    data.addColumn({ type: 'string', id: 'nameperson' });
	    data.addColumn({ type: 'date', id: 'Start' });
	    data.addColumn({ type: 'date', id: 'End' });
	   	for (i = 0; i < rowdata.length; i++) {
	    	if (rowdata[i].died > rowdata[i].born){
	    		data.addRow([i.toString(), rowdata[i].name, rowdata[i].born, rowdata[i].died]);
	    	}
	    }
	
		//console.log(rowdata.length);
		height = (data.getNumberOfRows() * 42) + 50;
	 
		var options = {
				'timeline': { showRowLabels: false },
				'fontSize':18,
	            'width':680,
	           	'height':height};
	    chart.draw(data, options);
	    
	    function selectHandler() {
		    var selectedItem = chart.getSelection()[0];
		    if (selectedItem) {
		      	var value = data.getValue(selectedItem.row, 1);
		      	console.log(value);
		      	var url = "https://en.wikipedia.org/wiki/"+encodeURI(value);
		      	window.open(url);
    		}
  		}
	    google.visualization.events.addListener(chart, 'select', selectHandler);
	    
	    
	}
    
}
 