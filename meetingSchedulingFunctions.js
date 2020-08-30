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

function formatDate(date) {
    return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + date.getFullYear()
}
    function getMeetingsForDate(date) {
        weeklyMeetingsMap = GM_getValue("weeklyMeetingsMap")
        dailyMeetingsMap = GM_getValue("dailyMeetingsMap")

        if(dailyMeetingsMap == undefined) {
            dailyMeetingsMap = new Map()
            GM_setValueAndConvertToString("dailyMeetingsMap", dailyMeetingsMap)
        }

        if(weeklyMeetingsMap == undefined) {
            weeklyMeetingsMap = new Map() 
            for( let i = 0; i < 7; i++) {
                weeklyMeetingsMap.set(i, [])
            }

            GM_setValueAndConvertToString("weeklyMeetingsMap", weeklyMeetingsMap)
        }
        

        let weeklyMeetings = GM_getValueAndConvertToMap('weeklyMeetingsMap').get(date.getDay())
        let dailyMeetings = GM_getValueAndConvertToMap('dailyMeetingsMap').get(formatDate(date))
        if(dailyMeetings == undefined){
            dailyMeetings = []
        }
        let thisDatesMeetings = weeklyMeetings.concat(dailyMeetings)

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
            let dailyMeetingsMap = GM_getValueAndConvertToMap('dailyMeetingsMap')
            let tempDate = new Date(meeting.date)
            let meetingsForThatDay = dailyMeetingsMap.get(formatDate(tempDate))
            let toDeleteIndex = meetingsForThatDay.findIndex(meetingInArray => meetingInArray.uniqueId == meeting.uniqueId)
            if(toDeleteIndex > -1) {
                meetingsForThatDay.splice(toDeleteIndex, 1)
            }
            dailyMeetingsMap.set(formatDate(tempDate), meetingsForThatDay)
            GM_setValueAndConvertToString('dailyMeetingsMap', dailyMeetingsMap)
        }

        //repeat every day
        else if(meeting.repeat == 1) {
            let weeklyMeetingsMap = GM_getValueAndConvertToMap('weeklyMeetingsMap') 
            for( let dayOfWeek =0; dayOfWeek<7; dayOfWeek++) {
                let meetingsForThatDay = weeklyMeetingsMap.get(dayOfWeek)
                let toDeleteIndex = meetingsForThatDay.findIndex(meetingInArray => meetingInArray.uniqueId == meeting.uniqueId)
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
            let tempDate =new Date(meeting.date)
            let dayOfTheWeek = tempDate.getDay()
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
            let dailyMeetingsMap = GM_getValueAndConvertToMap('dailyMeetingsMap')
            let meetingsForThatDay = dailyMeetingsMap.get(formatDate(meeting.date)) || []
            meetingsForThatDay.push(meeting)
            dailyMeetingsMap.set(formatDate(meeting.date), meetingsForThatDay)
            GM_setValueAndConvertToString('dailyMeetingsMap', dailyMeetingsMap)
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
