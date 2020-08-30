// ==UserScript==
// @name         Zoom Dashboard
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds functionality to zoom.us/join website
// @author       Patrick Cleary
// @match        https://zoom.us/join
// @match        https://*.zoom.us/join
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
    let todaysDate = new Date()
    let globalDate = new Date()
    
    window.addEventListener('load', () => {
        addMeetingDivs()
        addSchedule()
        createCalendar()
        addCalendar(changeDate)
        var cssTxt  = GM_getResourceText("calendarCSS");
        var cssTxt2  = GM_getResourceText("mainsiteCSS");
        GM_addStyle (cssTxt);
        GM_addStyle (cssTxt2);
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
        month.className = 'form-control input-sm'
  
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
        year.className = 'form-control input-sm'

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

    function joinMeeting(meeting) {
        copyToClipboard(meeting.password)
        document.getElementById("join-confno").value = meeting.id
        document.getElementById("btnSubmit").click()
    }

    function addInput() {


        let meetingDiv = document.getElementById("add-meeting");

        let addMeetingTitle = document.createElement('h1')
        addMeetingTitle.innerHTML = 'Add Meeting'

        

        let submit = document.createElement('button')
        submit.innerHTML = "submit"
        submit.className = "btn btn-primary add-meeting-inputs"
        submit.setAttribute("type", "text")
        submit.onclick = ()=>addMeetingButton()

        let input = document.createElement('input')
        input.setAttribute("type", "text")
        input.setAttribute("id", "meeting-name")
        input.setAttribute("placeholder", "Meeting Name")
        input.className = 'input-sm form-control add-meeting-inputs'

        let idInput = document.createElement('input')
        idInput.setAttribute("type", "text")
        idInput.setAttribute("id", "meeting-id")
        idInput.setAttribute("placeholder", "Meeting ID")
        idInput.className = 'input-sm form-control add-meeting-inputs'

        let passwordInput = document.createElement('input')
        passwordInput.type = 'text'
        passwordInput.id = 'meeting-password'
        passwordInput.placeholder ='Meeting Password (Optional)'
        passwordInput.className = 'input-sm form-control add-meeting-inputs'





        let repeatLabel = document.createElement('label')
        repeatLabel.setAttribute('for', 'repeat-options')
        repeatLabel.innerHTML = 'Repeat Meeting Every...'

        let repeatSelection = document.createElement('select');
        let repeatOptions = ['One Time Only', 'Every Day','Every Weekday', 'Every Week']
        repeatSelection.id = 'repeat-options'
        repeatSelection.className = "form-control add-meeting-inputs"
        
        let meetingDatePicker = document.createElement('input')
        meetingDatePicker.type = 'datetime-local'
        meetingDatePicker.id = 'meetingDatePicker'
        meetingDatePicker.className = 'form-control add-meeting-inputs'
        
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
        meetingDiv.appendChild(passwordInput)
        meetingDiv.appendChild(meetingDatePicker)
        meetingDiv.appendChild(repeatSelection)
        meetingDiv.appendChild(submit)
        

}

    function addMeetingButton() {
        let meetingName = document.getElementById("meeting-name").value
        let meetingId = document.getElementById("meeting-id").value
        let meetingPassword = document.getElementById('meeting-password').value
        let meetingDateTime = document.getElementById('meetingDatePicker').value
        let meetingRepeat = document.getElementById('repeat-options').value
        let meetingUniqueId = Date.now()


        document.getElementById("meeting-name").value = ''
        document.getElementById("meeting-id").value = ''
        document.getElementById('meeting-password').value =''
        document.getElementById('meetingDatePicker').value =  ''
        document.getElementById('repeat-options').value = 'Repeat Meeting Every...'

        let newMeeting = new Meeting(meetingName, meetingId, new Date(meetingDateTime), meetingRepeat, meetingPassword, meetingUniqueId)

        addMeeting(newMeeting)
        changeDate(globalDate)    

    }
    function editMeetings(button) {
        let deleteButtons = document.getElementsByClassName('delete-button-hidden')

        if(button.innerHTML === 'Edit Meetings'){
            
        for(let j =0; j < deleteButtons.length; j++) {
            deleteButtons[j].style.display = "block"
        }

        button.innerHTML = 'Done Editing'
        } else {
            for(let j =0; j < deleteButtons.length; j++) {
                deleteButtons[j].style.display = "none"
            }
            button.innerHTML = 'Edit Meetings'
        }


    }


    
    //Daily Schedule!!!


    function addSchedule() {

        let calendarDiv = document.getElementById('calendarDiv')
        let scheduleDiv = document.createElement('div')
        scheduleDiv.id = 'schedule-div'
        
        let schedulerTitle = document.createElement('h1')
        schedulerTitle.id = 'scheduler-title'
        schedulerTitle.innerHTML = 'Today\'s Meetings:'

        let moveDayButtonsDiv = document.createElement('div')
        moveDayButtonsDiv.id = 'move-day-buttons-div'
        
        
        let previousButton = document.createElement('button')
        previousButton.setAttribute('id', 'previous-day')
        previousButton.innerHTML = "&#8249"
        previousButton.className = 'btn btn-primary'
        previousButton.onclick = ()=>{globalDate.setDate(globalDate.getDate()-1); changeDate(globalDate)}
        
        let nextButton = document.createElement('button')
        nextButton.setAttribute('id', 'next-day')
        nextButton.innerHTML = "&#8250"
        nextButton.className = 'btn btn-primary'
        nextButton.onclick = ()=>{globalDate.setDate(globalDate.getDate()+1); changeDate(globalDate)}
        
         moveDayButtonsDiv.appendChild(previousButton)
         moveDayButtonsDiv.appendChild(schedulerTitle)
         moveDayButtonsDiv.appendChild(nextButton)

        scheduleDiv.appendChild(moveDayButtonsDiv)

        calendarDiv.appendChild(scheduleDiv)

        changeDate(globalDate)


    }

    function toStringCustom(date) {
        let days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        return days[date.getDay()] + ' ' + months[date.getMonth()] + ' '  + date.getDate() + ' ' + (1900+date.getYear())
    }

    function formatTime(date) {
        let hours = date.getHours()
        hours = ((hours + 11) % 12 + 1);

        return hours + ':' + (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + (date.getHours() > 12 ? ' PM' : ' AM')
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
        let todaysMeetings = getMeetingsForDate(date)

        for( let i =0; i < todaysMeetings.length; i ++) {

            let newMeeting = document.createElement('li')

            let timeDiv = document.createElement('div')
            timeDiv.className = 'timeDiv'
            timeDiv.innerHTML = formatTime(new Date(todaysMeetings[i].date))
            newMeeting.appendChild(timeDiv)

            let meetingNameDiv = document.createElement('div')
            meetingNameDiv.className = 'meetingNameDiv'

            let meetingTitle = document.createElement('h3')
            meetingTitle.innerHTML = todaysMeetings[i].name

            meetingNameDiv.appendChild(meetingTitle)

            newMeeting.appendChild(meetingNameDiv)
            newMeeting.className = 'list-group-item'

            let button = document.createElement('button')
            button.className = "btn join-meeting-btn"
            button.innerHTML = 'Join'
            button.onclick = ()=>joinMeeting(todaysMeetings[i])

            newMeeting.appendChild(button)


            let deleteButton = document.createElement('button')
            deleteButton.className = "btn delete-button-hidden"
            deleteButton.innerHTML = 'X'
            deleteButton.onclick = ()=>{deleteMeeting(todaysMeetings[i]); changeDate(globalDate)}

            newMeeting.appendChild(deleteButton)

            meetingsList.appendChild(newMeeting);
        }

        let editMeetingsButton = document.createElement('button')
        editMeetingsButton.id = 'edit-meetings-button'
        editMeetingsButton.className = 'btn'
        editMeetingsButton.innerHTML = 'Edit Meetings'
        editMeetingsButton.onclick = ()=>editMeetings(editMeetingsButton)

        meetingsList.appendChild(editMeetingsButton)        
        scheduleDiv.appendChild(meetingsList)
    }
    function copyToClipboard (str) {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        const selected =
          document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        if (selected) {
          document.getSelection().removeAllRanges();
          document.getSelection().addRange(selected);
        }
      };

      function changeDate(date) {
          globalDate = date
          refreshSchedule(date)


      }



    // Your code here...
})();
