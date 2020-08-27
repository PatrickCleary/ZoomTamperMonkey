// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://zoom.us/join
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==
(function() {

    'use strict';
    window.jQuery310 = $.noConflict(true);

    window.addEventListener('load', () => {
        addMeetingDivs()

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

    function addMeetingDivs() {
        let contentContainer = document.getElementById("content_container")

        let addMeeting = document.createElement('div')
        addMeeting.setAttribute("id", "add-meeting")
        let meetings = document.createElement('div')
        meetings.setAttribute("id", "meetings")

        contentContainer.appendChild(addMeeting)
        contentContainer.appendChild(meetings)



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
