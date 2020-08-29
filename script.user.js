// ==UserScript==
// @name         Zoom Dashboard
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds functionality to zoom.us/join website
// @author       Patrick Cleary
// @match        https://zoom.us/join
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require      ./Calendar-master/calendar.js
// @resource     calendarCSS ./Calendar-master/calendar.css
// @resource     mainsiteCSS ./mainsite.css
// @grant        GM_setValue    
// @grant        GM_getValue
// @grant        GM_getResourceText
// @grant        GM_addStyle


// ==/UserScript==
(function() {
    
    
    'use strict';
    window.jQuery310 = $.noConflict(true);
    
    window.addEventListener('load', () => {
        addMeetingDivs()
        createCalendar()
        addCalendar();
        var cssTxt  = GM_getResourceText("calendarCSS");
        var cssTxt2  = GM_getResourceText("mainsiteCSS");
        GM_addStyle (cssTxt);
        GM_addStyle (cssTxt2);



    let meetingsArray = GM_getValue("meetings");
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

        let scheduling = document.createElement('div');
        scheduling.id = "scheduling"
        contentContainer.appendChild(scheduling)

        let addMeeting = document.createElement('div')
        addMeeting.setAttribute("id", "add-meeting")
        let meetings = document.createElement('div')
        meetings.setAttribute("id", "meetings")
        let calendar = document.createElement('div')
        calendar.setAttribute("id","calendarDiv")

       
        scheduling.appendChild(calendar)
        scheduling.appendChild(addMeeting)
        scheduling.appendChild(meetings)


    }

    function joinMeeting(id) {
        document.getElementById("join-confno").value = id
        document.getElementById("btnSubmit").click()
    }

    function addInput() {

        let meetingDiv = document.getElementById("add-meeting");

        let submit = document.createElement('button')
        submit.innerHTML = "submit"
        submit.setAttribute("type", "text")
        submit.setAttribute("placeholder","Meeting Name")
        submit.onclick = ()=>addMeeting()
        meetingDiv.appendChild(submit)

        let input = document.createElement('input')
        input.setAttribute("type", "text")
        input.setAttribute("id", "meeting-name")
        input.setAttribute("placeholder", "Meeting Name")
        meetingDiv.appendChild(input)

        let idInput = document.createElement('input')
        idInput.setAttribute("type", "text")
        idInput.setAttribute("id", "meeting-id")
        idInput.setAttribute("placeholder", "Meeting ID")

        meetingDiv.appendChild(idInput)
}

    function addButton(text, onclick, cssObj) {
        cssObj = null
        let button = document.createElement('button'), btnStyle = button.style

        button.innerHTML = text
        button.onclick = onclick

        let meetings = document.getElementById("meetings").appendChild(button)
    }

    function addMeeting() {
        let name = document.getElementById("meeting-name").value
        let id = document.getElementById("meeting-id").value
        let meetingArray = GM_getValue("meetings")
        meetingArray.push([name, id])
        GM_setValue("meetings", meetingArray)
        addButton(name, ()=>joinMeeting(id))


    }
    function deleteAllMeetings() {
        GM_setValue("meetings", []);
    }


    

    // Your code here...
})();
