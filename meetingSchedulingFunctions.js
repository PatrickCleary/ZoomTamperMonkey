class Meeting {
    constructor(meetingName, meetingId,meetingTime, meetingDate,meetingRepeat) {
        this.name = meetingName
        this.id = meetingId
        this.time = meetingTime
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
        console.log('getmEETINGSs' +  date)
        console.log('getmEETINGSs' +  date.getDay())
        return GM_getValueAndConvertToMap('weeklyMeetingsMap').get(date.getDay())
    }


    function addMeeting(meeting) {

        

        if(meeting.repeat == 2){
            let weeklyMeetingsMap = GM_getValueAndConvertToMap('weeklyMeetingsMap') 
            let dayOfTheWeek = meeting.date.getDay()
            console.log('add meeting date ' + meeting.date)
            console.log('add meeting day ' + meeting.date.getDay())
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
