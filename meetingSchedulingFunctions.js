class Meeting {
    constructor(meetingName, meetingId, meetingDate,meetingRepeat, meetingPassword, meetingUniqueId) {
        this.name = meetingName
        this.id = meetingId
        this.date = meetingDate
        this.repeat =  meetingRepeat
        this.password = meetingPassword
        this.uniqueId = meetingUniqueId
    }

}

    function getMeetingsForDate(date) {
        weeklyMeetingsMap = GM_getValue("weeklyMeetingsMap")

        if(weeklyMeetingsMap == undefined) {
            weeklyMeetingsMap = new Map() 
            for( let i = 0; i < 7; i++) {
                weeklyMeetingsMap.set(i, [])
            }
            GM_setValueAndConvertToString("weeklyMeetingsMap", weeklyMeetingsMap)
        }

        let thisDatesMeetings = GM_getValueAndConvertToMap('weeklyMeetingsMap').get(date.getDay())
        thisDatesMeetings.sort(function(a, b) {
            dateB = new Date(b.date)
            dateA = new Date(a.date)


            return (dateA.getHours()*100 +dateA.getMinutes()) - (dateB.getHours()*100 + dateB.getMinutes())
        } )
        return thisDatesMeetings
    }

    function deleteMeeting(meeting) {
        
        //do not repeat
        if(meeting.repeat ==0 || meeting.repeat == 'Repeat Meeting Every...') {

        }

        //repeat every day
        else if(meeting.repeat == 1) {
            let weeklyMeetingsMap = GM_getValueAndConvertToMap('weeklyMeetingsMap') 
            for( let dayOfWeek =0; dayOfWeek<7; dayOfWeek++) {
                let meetingsForThatDay = weeklyMeetingsMap.get(dayOfWeek)
                let toDeleteIndex = meetingsForThatDay.findIndex(meetingInArray => meetingInArray.uniqueId == meeting.uniqueId)
                console.log(toDeleteIndex)
                if(toDeleteIndex > -1) {
                    meetingsForThatDay.splice(toDeleteIndex, 1)
                }
                weeklyMeetingsMap.set(dayOfWeek, meetingsForThatDay)
            }
            GM_setValueAndConvertToString('weeklyMeetingsMap', weeklyMeetingsMap)
        }

        //repeat every weekday
        else if(meeting.repeat ==2) {
            let weeklyMeetingsMap = GM_getValueAndConvertToMap('weeklyMeetingsMap') 
            for( let dayOfWeek =1; dayOfWeek<6; dayOfWeek++) {
                let meetingsForThatDay = weeklyMeetingsMap.get(dayOfWeek)
                let toDeleteIndex = meetingsForThatDay.findIndex(meetingInArray => meetingInArray.uniqueId == meeting.uniqueId)
                if(toDeleteIndex > -1) {
                    meetingsForThatDay.splice(toDeleteIndex, 1)
                }
                weeklyMeetingsMap.set(dayOfWeek, meetingsForThatDay)
        }
        GM_setValueAndConvertToString('weeklyMeetingsMap', weeklyMeetingsMap)

    }

        //repeat 1x a week
        else if(meeting.repeat == 3){
            let weeklyMeetingsMap = GM_getValueAndConvertToMap('weeklyMeetingsMap') 
            let dayOfTheWeek = meeting.date.getDay()
            let meetingsForThatDay = weeklyMeetingsMap.get(dayOfTheWeek)
            let toDeleteIndex = meetingsForThatDay.findIndex(meetingInArray => meetingInArray.uniqueId == meeting.uniqueId)
                if(toDeleteIndex > -1) {
                    meetingsForThatDay.splice(toDeleteIndex, 1)
                }
            weeklyMeetingsMap.set(dayOfTheWeek, meetingsForThatDay)
            GM_setValueAndConvertToString('weeklyMeetingsMap', weeklyMeetingsMap)
        }
    }
    
    function addMeeting(meeting) {

        //do not repeat
        if(meeting.repeat ==0 || meeting.repeat == 'Repeat Meeting Every...') {

        }

        //repeat every day
        else if(meeting.repeat == 1) {
            let weeklyMeetingsMap = GM_getValueAndConvertToMap('weeklyMeetingsMap') 
            for( let dayOfWeek =0; dayOfWeek<7; dayOfWeek++) {
                let meetingsForThatDay = weeklyMeetingsMap.get(dayOfWeek)
                meetingsForThatDay.push(meeting)
                weeklyMeetingsMap.set(dayOfWeek, meetingsForThatDay)
            }
            GM_setValueAndConvertToString('weeklyMeetingsMap', weeklyMeetingsMap)
        }

        //repeat every weekday
        else if(meeting.repeat ==2) {
            let weeklyMeetingsMap = GM_getValueAndConvertToMap('weeklyMeetingsMap') 
            for( let dayOfWeek =1; dayOfWeek<6; dayOfWeek++) {
                let meetingsForThatDay = weeklyMeetingsMap.get(dayOfWeek)
                meetingsForThatDay.push(meeting)
                weeklyMeetingsMap.set(dayOfWeek, meetingsForThatDay)
        }
        GM_setValueAndConvertToString('weeklyMeetingsMap', weeklyMeetingsMap)

    }

        //repeat 1x a week
        else if(meeting.repeat == 3){
            let weeklyMeetingsMap = GM_getValueAndConvertToMap('weeklyMeetingsMap') 
            let dayOfTheWeek = meeting.date.getDay()
            let meetingsForThatDay = weeklyMeetingsMap.get(dayOfTheWeek)
            meetingsForThatDay.push(meeting)
            weeklyMeetingsMap.set(dayOfTheWeek, meetingsForThatDay)
            GM_setValueAndConvertToString('weeklyMeetingsMap', weeklyMeetingsMap)
        }
        
    }


function GM_getValueAndConvertToMap(value) {

    let map = GM_getValue(value)
    return new Map(JSON.parse(map))

}

function GM_setValueAndConvertToString(value, map) {
    let mapString = JSON.stringify([...map]);
    GM_setValue(value, mapString)
}
