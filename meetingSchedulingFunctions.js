class Meeting {
    constructor(meetingName, meetingId, meetingDate,meetingRepeat) {
        this.name = meetingName
        this.id = meetingId
        this.date = meetingDate
        this.repeat =  meetingRepeat
    }

}

    function getTodaysMeetings(date) {
        weeklyMeetingsMap = GM_getValue("weeklyMeetingsMap")

        if(weeklyMeetingsMap == undefined) {
            weeklyMeetingsMap = new Map() 
            for( let i = 0; i < 7; i++) {
                weeklyMeetingsMap.set(i, [])
            }
            GM_setValueAndConvertToString("weeklyMeetingsMap", weeklyMeetingsMap)
        }
        return GM_getValueAndConvertToMap('weeklyMeetingsMap').get(date.getDay())
    }


    function addMeeting(meeting) {

        console.log(meeting.repeat)
        //do not repeat
        if(meeting.repeat ==0 || meeting.repeat == 'Repeat Meeting Every...') {

        }

        //repeat every day
        else if(meeting.repeat == 1) {

        }

        //repeat every weekday
        else if(meeting.repeat ==2) {

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
