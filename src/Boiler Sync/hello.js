var allEvents = [];

/*
 * Converts date to RFC3339 format.
 */
function rfc3339(d) {
    function pad(n) {
        return n < 10 ? "0" + n : n;
    }
    function timezoneOffset(offset) {
        var sign;
        if (offset === 0) {
            return "Z";
        }
        sign = (offset > 0) ? "-" : "+";
        offset = Math.abs(offset);
        return sign + pad(Math.floor(offset / 60)) + ":" + pad(offset % 60);
    }
    return d.getFullYear() + "-" +
        pad(d.getMonth() + 1) + "-" +
        pad(d.getDate()) + "T" +
        pad(d.getHours()) + ":" +
        pad(d.getMinutes()) + ":" +
        pad(d.getSeconds()) +
        timezoneOffset(d.getTimezoneOffset());
}

/*
 * Updates UI with courses.
 */
function loadCourses() {
  var courseTable = document.getElementById('courses');
  for (var i = 0; i < allEvents.length; ++i) {
    var row = document.createElement('tr');
    var col0 = document.createElement('td');
    var checkbox = document.createElement('input');
    checkbox.checked = true;
    checkbox.type = 'checkbox';
    checkbox.id = 'checked_course_' + i;
    col0.appendChild(checkbox);
    var col1 = document.createElement('td');
    col1.innerText = allEvents[i].summary;
    row.appendChild(col0);
    row.appendChild(col1);
    courseTable.appendChild(row);
  }
}

/*
 * Converts course to Google Calendar event.
 */
function convertCourseToEvents(course) {
  var event = {};
  event["summary"] = course["code"];
  //if (event["summary"] == "CS") {
    //event["summary"] = "Cookie Starter";
  //}
  //event["location"] = course["location"];
  //if (event["location"] == "UNIV") {
    //event["location"] = "This is a bug";
  //}
  event["description"] = course["name"] + "\n" + "Instructor: " + course["instructor"];
  event["start"] = { "dateTime" : rfc3339(convertTimeFormat(course["start_date"], course["start_time"])), "timeZone": "America/Chicago" };
  event["originalStartTime"] = { "dateTime" : rfc3339(convertTimeFormat(course["start_date"], course["start_time"])), "timeZone": "America/New_York" };
  event["end"] = { "dateTime" : rfc3339(convertTimeFormat(course["start_date"], course["end_time"])), "timeZone": "America/Chicago" };
  event["recurrence"] = [ recurrenceString(course["days"], course["end_date"]) ];
  return event;
}

/*
 * Replaces character in string.
 */
function setCharAt(str,index,chr) {
    if(index > str.length - 1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

/*
 * Creates RRULE string for event.
 */
function recurrenceString(days, end_date) {
  var str = "RRULE:";
  var freq_str = "FREQ=WEEKLY;"
  var days_str = "BYDAY=";
  for (var i = 0; i < days.length; i++) {
    days_str += convertDayCharToDayCode(days.charAt(i)) + ",";
  }
  days_str = setCharAt(days_str, days_str.length - 1, ";");
  var interval_str = "INTERVAL=1;"
  var until_str = "UNTIL=20180428";
  return str + freq_str + interval_str + days_str + until_str;
  //return "RRULE:FREQ=WEEKLY;UNTIL=20180428T035959Z;BYDAY=MO,WE,FR";
}

//"RRULE:FREQ=WEEKLY;UNTIL=20180428T035959Z;BYDAY=MO,WE,FR"

/*
 * Converts date and time to Google Calendar format.
 */
function convertTimeFormat(date, time) {
  var date = new Date(date);
  var hr = time.split(":")[0];
  //if (hr % 2 == 0)
    //hr += 1;
  date.setHours(hr);

  var min = time.split(":")[1];
  //if (min % 5 == 0)
    //min += 1;
  //if (min % 2 == 0)
    //min += 5;
  //if (min % 3 == 0)
    //min -= 1;
  //if (min % 7 == 0)
    //min -= 5;
  date.setMinutes(min);
  //console.log(date);
  return date;
}

/*
 * Converts day character to RRULE day format.
 */
function convertDayCharToDayCode(day) {
  switch (day) {
    case 'M':
      //bug #16 MO
      return 'TU';
    case 'T':
      return 'TU';
    case 'W':
      //bug #17 WE
      return 'TH';
    case 'R':
      return 'TH';
    case 'F':
      //bug #18 FR
      return 'TH';
  }
}



chrome.extension.onRequest.addListener(function (course_array) {
  for (var i = 0; i < course_array.length; i++) {
    //if (i == 1)
      //continue;
    allEvents[i] = convertCourseToEvents(course_array[i]);
  }
  loadCourses();
  synchronize();
})


/*
 * Authenticates with Google Calendar and synchronize events.
 */
function synchronize() {
  // Use jQuery to load GAPI script.
  $.getScript("https://apis.google.com/js/client.js", function() {
    // Load GAPI.Client.
    gapi.load('client', function() {
      console.log('GAPI.Client loaded.');
      // Load GAPI.Client.Calendar.
      gapi.client.load('calendar', 'v3', function() {
        console.log('GAPI.Client.Calendar loaded.');
        // Authenticate with Chrome identity.
        chrome.identity.getAuthToken({'interactive': true}, function(token) {
          // Set GAPI OAuth2 token.
          gapi.client.setToken({access_token: token});

          // TODO: Loop through all events.
          for (var i = 0; i < allEvents.length; i++)
          {
            var request = gapi.client.calendar.events.insert({
              'calendarId': 'primary',
              'resource': allEvents[i]
            });

            request.execute(function(event) {
              console.log('Event created: ' + event.htmlLink);
            });
          }
        });
      });
    });
  });
};

window.onload = function() {
  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query(
      {
        active: true,
        windowId: currentWindow.id
      },
      function(activeTabs) {
        chrome.tabs.executeScript(
          activeTabs[0].id,
          {
            file: 'fetchCourses.js',
            allFrames: true
          });
      });
  });
};
