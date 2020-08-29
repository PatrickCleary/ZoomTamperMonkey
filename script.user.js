// ==UserScript==
// @name         Zoom Dashboard
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds functionality to zoom.us/join website
// @author       Patrick Cleary
// @match        https://zoom.us/join
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require      ./Calendar-master/calendar.js
// @require      ./meetingSchedulingFunctions.js
// @resource     calendarCSS ./Calendar-master/calendar.css
// @resource     mainsiteCSS ./mainsite.css
// @grant        GM_setValue    
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_getResourceText
// @grant        GM_addStyle


// ==/UserScript==
(function() {
    
    
    'use strict';
    window.jQuery310 = $.noConflict(true);
    
    window.addEventListener('load', () => {

        addMeetingDivs()
        addSchedule()
        createCalendar()
        addCalendar(refreshSchedule)
        var cssTxt  = GM_getResourceText("calendarCSS");
        var cssTxt2  = GM_getResourceText("mainsiteCSS");
        GM_addStyle (cssTxt);
        GM_addStyle (cssTxt2);


    let meetingsArray = GM_getValue("meetings")
 

    if(meetingsArray == undefined) {
        meetingsArray = []
        GM_setValue("meetings", meetingsArray)
    }
      for (let index = 0; index< meetingsArray.length; index++) {
              addButton(meetingsArray[index][0], ()=>joinMeeting(meetingsArray[index][1]))

      }
     addButton("delete all meetings", ()=>deleteAllMeetings())
    addInput()
    })
    
    function createCalendar() {


        let container_Calendar = document.createElement('div')
        container_Calendar.setAttribute('class','container-calendar')
  
        let monthAndYear = document.createElement('h3')
        monthAndYear.setAttribute('id', 'monthAndYear')
  
        container_Calendar.appendChild(monthAndYear)
   
        let button_container_calendar = document.createElement('div')
        button_container_calendar.setAttribute('class','button-container-calendar')
  
        let previousButton = document.createElement('button')
        previousButton.setAttribute('id', 'previous')
        previousButton.innerHTML = "&#8249"
  
        
        let nextButton = document.createElement('button')
        nextButton.setAttribute('id', 'next')
        nextButton.innerHTML = "&#8250"
  
        button_container_calendar.appendChild(previousButton)
        button_container_calendar.appendChild(nextButton)
        container_Calendar.appendChild(button_container_calendar)
  
         
        let table_calendar = document.createElement('table');
        table_calendar.setAttribute('id','calendar')
        table_calendar.setAttribute('class','table-calendar')
        table_calendar.setAttribute('data-lang','en')
        let thead_month = document.createElement('thead')
        let calendar_body = document.createElement('tbody')
        thead_month.setAttribute('id','thead-month')
        calendar_body.setAttribute('id','calendar-body')
  
  
        table_calendar.appendChild(thead_month) 
        table_calendar.appendChild(calendar_body)
  
        container_Calendar.appendChild(table_calendar)
  
        let footer_container_calendar = document.createElement('div')
        footer_container_calendar.appendChild
        let label = document.createElement('label')
        label.setAttribute('for', 'month')
        label.innerHTML = 'Jump To:'
        let month = document.createElement('select')
        month.setAttribute('id','month')
  
        footer_container_calendar.appendChild(label)
        footer_container_calendar.appendChild(month)
  
        container_Calendar.appendChild(footer_container_calendar)
        let monthsArray = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  
        for( let i =0; i < monthsArray.length; i++ ) {
            let monthOption = document.createElement('option')
            monthOption.className = 'month-option'
            monthOption.setAttribute('value', i.toString())
            monthOption.innerHTML = monthsArray[i]
            month.appendChild(monthOption)
        }
  
  
        let year = document.createElement('select')
        year.setAttribute('id','year')
        container_Calendar.appendChild(year)
  
        let calendarDiv = document.getElementById('calendarDiv')
        calendarDiv.appendChild(container_Calendar)
  
  
    }



    function addMeetingDivs() { 
        let contentContainer = document.getElementById("join-conf")

        let calendar_div = document.createElement('div');
        calendar_div.id = "calendarDiv"
        contentContainer.appendChild(calendar_div)

        let scheduler_div = document.createElement('div')
        scheduler_div.id = "schedulerDiv"
        contentContainer.appendChild(scheduler_div)

        let addMeeting = document.createElement('div')
        addMeeting.id = "add-meeting"
        let meetings = document.createElement('div')
        meetings.setAttribute("id", "meetings")
        let calendar = document.createElement('div')
        calendar.setAttribute("id","calendarDiv")

       
        calendar_div.appendChild(calendar)

        scheduler_div.appendChild(addMeeting)
        scheduler_div.appendChild(meetings)


    }

    function joinMeeting(id) {
        document.getElementById("join-confno").value = id
        document.getElementById("btnSubmit").click()
    }

    function addInput() {


        let meetingDiv = document.getElementById("add-meeting");

        let addMeetingTitle = document.createElement('h1')
        addMeetingTitle.innerHTML = 'Add Meeting'

        

        let submit = document.createElement('button')
        submit.innerHTML = "submit"
        submit.className = "btn btn-primary"
        submit.setAttribute("type", "text")
        submit.onclick = ()=>addMeetingButton()

        let input = document.createElement('input')
        input.setAttribute("type", "text")
        input.setAttribute("id", "meeting-name")
        input.setAttribute("placeholder", "Meeting Name")
        input.className = 'input-sm form-control'

        let idInput = document.createElement('input')
        idInput.setAttribute("type", "text")
        idInput.setAttribute("id", "meeting-id")
        idInput.setAttribute("placeholder", "Meeting ID")
        idInput.className = 'input-sm form-control'





        let repeatLabel = document.createElement('label')
        repeatLabel.setAttribute('for', 'repeat-options')
        repeatLabel.innerHTML = 'Repeat Meeting Every...'

        let repeatSelection = document.createElement('select');
        let repeatOptions = ['One Time Only', 'Every Day','Every Weekday', 'Every Week']
        repeatSelection.id = 'repeat-options'
        repeatSelection.className = "form-control"
        
        let meetingDatePicker = document.createElement('input')
        meetingDatePicker.type = 'datetime-local'
        meetingDatePicker.id = 'meetingDatePicker'
        meetingDatePicker.className = 'form-control'
        
        //TODO: new DAate().toString() not working?
        meetingDatePicker.value = new Date().toString()
        meetingDatePicker.min = new Date().toString();
        meetingDatePicker.max = "2050-12-31"

        let defaultRepeatOption = document.createElement('option')
        defaultRepeatOption.innerHTML = 'Repeat Meeting Every...'
        defaultRepeatOption.disabled = true
        defaultRepeatOption.selected = true
        repeatSelection.appendChild(defaultRepeatOption)

        for(let i = 0 ; i < repeatOptions.length; i++) { 
            let repeatOption = document.createElement('option')
            repeatOption.className = 'repeat-option'
            repeatOption.setAttribute('value', i.toString())
            repeatOption.innerHTML = repeatOptions[i]

            repeatSelection.appendChild(repeatOption)
        }

        meetingDiv.appendChild(addMeetingTitle)
        meetingDiv.appendChild(input)
        meetingDiv.appendChild(idInput)
        meetingDiv.appendChild(meetingDatePicker)
        meetingDiv.appendChild(repeatSelection)
        meetingDiv.appendChild(submit)
        

}

    function addButton(text, onclick, cssObj) {
        cssObj = null
        let button = document.createElement('button'), btnStyle = button.style
        button.className = "btn"
        button.innerHTML = text
        button.onclick = onclick

        document.getElementById("meetings").appendChild(button)
    }

    function addMeetingButton() {
        let meetingName = document.getElementById("meeting-name").value
        let meetingId = document.getElementById("meeting-id").value
        let meetingDateTime = document.getElementById('meetingDatePicker').value
        let meetingRepeat = document.getElementById('repeat-options').value

        let newMeeting = new Meeting(meetingName, meetingId, new Date(meetingDateTime), meetingRepeat)

        addMeeting(newMeeting)
        refreshSchedule(new Date())    

    }
    function deleteAllMeetings() {
        GM_setValue("meetings", []);
    }


    
    //Daily Schedule!!!


    function addSchedule() {

        let calendarDiv = document.getElementById('calendarDiv')
        let scheduleDiv = document.createElement('div')
        scheduleDiv.id = 'schedule-div'
        
        let schedulerTitle = document.createElement('h1')
        schedulerTitle.id = 'scheduler-title'
        schedulerTitle.innerHTML = 'Today\'s Meetings:'

        scheduleDiv.appendChild(schedulerTitle)

        calendarDiv.appendChild(scheduleDiv)

        refreshSchedule(new Date())


    }

    function toStringCustom(date) {
        let days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        return days[date.getDay()] + ' ' + months[date.getMonth()] + ' '  + date.getDate() + ' ' + (1900+date.getYear())
    }

    function refreshSchedule(date) {
        let schedulerTitle = document.getElementById('scheduler-title')
        schedulerTitle.innerHTML = toStringCustom(date)
        let meetingsList = document.getElementById('meetings-list')
        let scheduleDiv = document.getElementById('schedule-div')
        if(meetingsList) {
            scheduleDiv.removeChild(meetingsList)
        }
        
        meetingsList = document.createElement('ul')
        meetingsList.id = 'meetings-list'
        
        //TODO: change this to be the currently selected date!!!
        let todaysMeetings = getTodaysMeetings(date)

        for( let i =0; i < todaysMeetings.length; i ++) {

            let newMeeting = document.createElement('li')
            newMeeting.innerHTML = todaysMeetings[i].name + ' - ' + todaysMeetings[i].time
            
            let button = document.createElement('button')
            button.className = "btn"
            button.innerHTML = 'Join Meeting'
            button.onclick = ()=>joinMeeting(todaysMeetings[i].id)

            newMeeting.appendChild(button)

            meetingsList.appendChild(newMeeting);
        }
        scheduleDiv.appendChild(meetingsList)
        
    }



    // Your code here...
})();
