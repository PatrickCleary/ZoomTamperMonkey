function addCalendar(date, refreshSchedule) {

function generate_year_range(start, end) {
  var years = "";
  for (var year = start; year <= end; year++) {
      years += "<option value='" + year + "'>" + year + "</option>";
  }
  return years;
}
let today = new Date();

var currentMonth = date.getMonth();
var currentYear = date.getFullYear();
var selectYear = document.getElementById("year");
var selectMonth = document.getElementById("month");


var createYear = generate_year_range(2020, 2050);
/** or
* createYear = generate_year_range( 1970, currentYear );
*/

document.getElementById("year").innerHTML = createYear;

var calendar = document.getElementById("calendar");
var lang = calendar.getAttribute('data-lang');

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

var dayHeader = "<tr>";
for (day in days) {
  dayHeader += "<th data-days='" + days[day] + "'>" + days[day] + "</th>";
}
dayHeader += "</tr>";

document.getElementById("thead-month").innerHTML = dayHeader;

monthAndYear = document.getElementById("monthAndYear");
showCalendar(date);



function next() {
  date.setMonth(date.getMonth()+1)
  showCalendar(date);
}
document.getElementById('next').onclick = ()=>next()


function previous() {
  date.setMonth(date.getMonth()-1)
  showCalendar(date);
}
document.getElementById('previous').onclick = ()=>previous()


function jump() {
  date.setYear(parseInt(selectYear.value));
  date.setMonth(parseInt(selectMonth.value));
  showCalendar(date);
}
document.getElementById('month').onchange = ()=>jump()
document.getElementById('year').onchange = ()=>jump()


function showCalendar(date) {

  firstDayDate = new Date(date)
  firstDayDate.setDate(1)
  var firstDay = firstDayDate.getDay();

  let month = date.getMonth()
  let year = date.getYear()

  tbl = document.getElementById("calendar-body");

  
  tbl.innerHTML = "";

  
  monthAndYear.innerHTML = months[month] + " " + (1900+year);
  selectYear.value = (1900+year);
  selectMonth.value = month;

  // creating all cells
  var date = 1;
  for ( var i = 0; i < 6; i++ ) {
      var row = document.createElement("tr");

      for ( var j = 0; j < 7; j++ ) {
          if ( i === 0 && j < firstDay ) {
              cell = document.createElement( "td" );
              cellText = document.createTextNode("");
              cell.appendChild(cellText);
              row.appendChild(cell);
          } else if (date > daysInMonth(month, year)) {
              break;
          } else {
              cell = document.createElement("td");
              cell.setAttribute("data-date", date);
              cell.setAttribute("data-month", month + 1);
              cell.setAttribute("data-year", year);
              cell.setAttribute("data-month_name", months[month]);
              cell.className = "date-picker";
              cell.innerHTML = "<span>" + date + "</span>";
              cell.onclick = refreshScheduleFromCalendar(date, month, year, cell)
              if ( date === today.getDate() && (1900+year) === today.getFullYear() && month === today.getMonth() ) {
                  cell.className = "date-picker selected";
                  cell.id = "todays-date"
                }
              row.appendChild(cell);
              date++;
          }


      }

      tbl.appendChild(row);
  }

}

function formatDate(date, month, year) {
  return ((month > 8) ? (month + 1) : ('0' + (month + 1))) + '-' + ((date > 9) ? date : ('0' + date)) + '-' + year
}

function refreshScheduleFromCalendar(date, month, year,cell) {
  
  let refreshDate = new Date(formatDate(date,month,(1900+year)))
  
  return ()=>{
    refreshSchedule(refreshDate); 
    let selectedDate = document.getElementsByClassName('selected')
    if(selectedDate[0]){
      selectedDate[0].className = 'date-picker'
    }
    cell.className = 'date-picker selected'}
}

function daysInMonth(iMonth, iYear) {
  return 32 - new Date(iYear, iMonth, 32).getDate();
}
}