//Person Class
	//constructor
function Person(name, born, died, occupation) {
	this.name = name;
	this.born = new Date(Date.parse(born));
	if (died == -1){
		this.died = new Date();
	}
	else {
		this.died = new Date(Date.parse(died));
	}
	this.occupation = occupation;
}


//functions
Person.prototype.getDuration = function() {
	return (this.died - this.born)
};

//END OF DATA CLASSES

function downloadJSONUrl(url, callback) {
	$.getJSON(url, callback);
}

function loadAllData(name){
	name = toProperCase(name);
	loadNameOrigin(name);
	loadFamousNationalities(name);
	loadPeople(name);
}

function loadNameOrigin(name){
	var url = '/origin?name='+name;
	downloadJSONUrl(url, function(data){ parseOrigin(name, data); });
}

function parseOrigin(name, data){
	console.log(data);
	if(data == null || data == "NO ORIGIN DATA"){
		data = name;
	}
	setSpinnerStatus();
	addTextBox(name, data);
}

function loadFamousNationalities(name){
	var url = '/nationalities?name='+name;
	downloadJSONUrl(url, function(data){ parseFamousNationalities(name, data); });
}

function parseFamousNationalities(name, data){
	console.log(data);
	setSpinnerStatus();
	drawPieChart(name, data)
}

function loadPeople(name){
	var url = '/people?name='+name;
	downloadJSONUrl(url, function(data){ parsePeople(name, data); });
}

function parsePeople(name, data){
	console.log(data);
	var people = [];
	for (i = 0; i < data.length; ++i) {
    	var p = new Person(data[i].name,data[i].born,data[i].died,data[i].occupation)
    	people.push(p);
    }
    people.sort(function(a,b){
  		// Turn your strings into dates, and then subtract them
  		// to get a value that is either negative, positive, or zero.
  		return a.born - b.born;
	});
    setSpinnerStatus();
    drawTimeline(name, people) 
}
	
	