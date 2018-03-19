var allCourses = [
		["CS 25200 LE1","Jan 08, 2018","Apr 28, 2018","MWF","12:30 pm - 1:20 pm","Mathematical Sciences Building 175",""],
  		["CS 30700 LE1","Jan 08, 2018","Apr 28, 2018","MWF","11:30 am - 12:20 pm","Class of 1950 Lecture Hall 224",""],
  		["CS 40800 LE1","Jan 08, 2018","Apr 28, 2018","TR","9:00 am - 10:15 am","Wetherill Lab of Chemistry 104",""]
];

// Get the modal
var modal;
//pop up window element
var modal1;

function getOnclickReady(){
	for(var i = 1; i <= 31 ; i++){
		document.getElementById("day"+i).addEventListener("click", showBlock);
    }
    document.getElementById("firstClose").addEventListener("click", closeClassModal);
    document.getElementById("secondClose").addEventListener("click", closeCalendarModal);
    document.getElementById("prev").addEventListener("click", changeMonth);
    document.getElementById("next").addEventListener("click", changeMonth);
    modal1 = document.getElementById('myModal1');
    modal = document.getElementById('myModal');
    
}
/***function to set up buttons when the page start***/
function setClassButtons(){
    //update class term
    var classTerm = document.getElementById("classTerm");
    if(allCourses[0][1].substring(0,3) == "Jan"){
    	classTerm.innerHTML  = "Spring " + allCourses[0][1].substring(8,12);
    }
    else if(allCourses[0][1].substring(0,3) == "Aug"){
    	classTerm.innerHTML = "Fall " + allCourses[0][1].substring(8,12);
    }
    else{
    	classTerm.innerHTML = "Summer " + allCourses[0][1].substring(8,12);
    }
	/***Create all class Button***/
	for(var i = 0; i < allCourses.length; i++){
    	var a = document.createElement('a');
    	var linkText = document.createTextNode(allCourses[i][0]);
    	a.appendChild(linkText);
    	//a.href = "#";
        a.className = "listButtons";
    	a.id = i;
        a.addEventListener("click", showBlockClass);
    	document.body.appendChild(a);
    }
    getOnclickReady();
    lastButton();
}
function lastButton(){
	/***Create button to fetch everything***/
    var lastButton = document.createElement('LastButton');
    var linkText = document.createTextNode("Fetch everything to Google calendar...");
   	lastButton.appendChild(linkText);
	lastButton.className = "btn btn-default btn-warning btn-md btn-block";
	lastButton.href = "#fetch to google";
    document.body.appendChild(lastButton);
    lastButton.addEventListener("click", sendDataToGoogle);

}
/***modal function***/

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var currentElement;
/***When the user clicks the buttons, open the modal***/
function showBlockClass(){
	var elem = this;
	currentElement = elem;
  	modal.style.display = "block";
    //if this is a class object load the class data
	for(var i = 0; i < 4; i++){
    	var currentInput = document.getElementById("input"+i);
    	if (i == 0){
        	currentInput.value = allCourses[elem.id][0];
            currentInput.readOnly = true;
        }
        else if (i == 1){
           	currentInput.value = allCourses[elem.id][1] + ' - ' + allCourses[elem.id][2] + ' ' +allCourses[elem.id][3] + ' ' +allCourses[elem.id][4];
            currentInput.readOnly = true;
        }
        else if (i == 2){
        	currentInput.value = allCourses[elem.id][5];
            currentInput.readOnly = true;
       	}
        else if (i == 3){
        	if(allCourses[elem.id].length == 7){
            	currentInput.value = allCourses[elem.id][6];
            }
        }
    }
}

/***function used to save and close the inputs of modal***/
function clearClassInput(){
        var currentInput = document.getElementById("input"+3);
       	allCourses[currentElement.id][6] = currentInput.value;
        //clear all input fields in modal
        for(var i = 0 ; i < 4 ; i++){
        	currentInput = document.getElementById("input"+i);
            currentInput.value = "";
            currentInput.readOnly = false;
        }
}
/***close button***/
// When the user clicks on <span> (x), close the modal
function closeClassModal() {
	modal.style.display = "none";
    clearClassInput();
}

/***Calendar***/
//current year and month
var month;
var year;
var lastMonthDays;
var count;
//list of events limited to five
var addEventList = [];
var eventCount = 0;
var monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
//function used to initialize the date
function initDate(){
	var today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    document.getElementById("month").innerHTML = monthName[month]+" "+year;
    count = 0;
    lastMonthDays = 32;
    changeDays();
}
//use to change the days in a month show in calendar
function changeDays(){
   var NumDays = new Date(year, month+1, 0).getDate();
   if(lastMonthDays > NumDays){
      for(var i = 31; i>NumDays; i--){
          document.getElementById("day" + i).style.display = "none";
      }
   }
   else{
      for(var i = lastMonthDays; i<=NumDays; i++){
      	  document.getElementById("day" + i).style.display = "inline-block";
      }
   }
   lastMonthDays = NumDays;
}
//function to change the month display in calendar
function changeMonth(){
	var elem = this;
	if(elem.id == "prev"){
		month--;
    	if(month == -1){
       		year--;
       		month = 11;
    	}
	}
	else{
    	month++;
    	if(month == 11){
         	year++;
         	month = 0;
    	}
	}
    document.getElementById("month").innerHTML = monthName[month]+" "+year;
    changeDays();
}
//function to display modal
function showBlock(){
	//Jan 08, 2018 - Apr 28, 2018 MWF 12:30 pm - 1:20 pm
   modal1.style.display = "block";
   var dateString = monthName[month] + ' ' + this.innerHTML + ', ' + year + " 07:00 pm - 08:00 pm";
   var input = document.getElementById("input11");
   input.value = dateString;
}
//function to create the button to edit later
function createEventButton(){
  document.body.removeChild(document.body.getElementsByTagName("LastButton")[0]);
	//Create all class Button
    var a = document.createElement('a');
    var linkText = document.createTextNode(addEventList[addEventList.length - 1][0]);
    a.appendChild(linkText);
    a.className = "listButtons";
    a.id = allCourses.length + eventCount - 1;
    a.addEventListener("click", showBlockEvent);
    document.body.appendChild(a);
    lastButton();
}
var updateEvent = false;
var currentEvent;
//modal for the current event button
function showBlockEvent(){
   var elem = this;
   modal1.style.display = "block";
   updateEvent = true;
   currentEvent = elem.id;
   for(var i = 0; i < 4; i++){
   		var input = document.getElementById("input1"+i);
       	input.value = addEventList[elem.id - allCourses.length][i];
   }
}
//function to clear all the fields of modal
function clearAllInput(){
	var NewEvent = [];
    var success = true;
    //save each input to the array
	for(var i = 0; i < 4 ; i++){
    	var tempInput = document.getElementById("input1"+i);
        if(tempInput.value.length == 0 && i != 3){
            success = false;
            break;
        }
        else{
            NewEvent.push(tempInput.value);
      	}
    }
    //save it to the array if there is no problem
    if (success && !updateEvent){
    	addEventList.push(NewEvent);
        eventCount++;
        createEventButton();
    }
    else if (success && updateEvent){
        document.getElementById(currentEvent).text = NewEvent[0];
        addEventList[currentEvent - allCourses.length] = NewEvent;
    	updateEvent = false;
    }
    //clear the fields
    for(var i = 0; i < 4 ; i++){
    	var tempInput = document.getElementById("input1"+i);
        tempInput.value = "";
    }
}
/***close button***/
// When the user clicks on <span> (x), close the modal
function closeCalendarModal() {
	modal1.style.display = "none";
    clearAllInput();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
   	if (event.target == modal1) {
    		modal1.style.display = "none";
        	clearAllInput();
	}
    else if (event.target == modal) {
    	modal.style.display = "none";
        clearClassInput();
	}
}
//function to fetch data to google calendar
function sendDataToGoogle(){
	//send all classes and events

}

window.onload = function() {
  setClassButtons() ; 
  initDate();
};