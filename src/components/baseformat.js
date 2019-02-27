zeroLead = (number,pad) => {
    let len = number.toString().length
    let lead = ''
    while ( len < pad ){
        lead = lead + '0'
        len++
    }
    return(lead+number)
    // return lead + number.toSting()
}

export const TodayDate = () => {
    let todayDate = new Date()
    let date = todayDate.getFullYear()+'-'+ zeroLead(todayDate.getMonth(),2)+'-'+ zeroLead(todayDate.getDate(),2)
    let time = todayDate.getHours()+':'+ zeroLead(todayDate.getMinutes(),2)+':'+ zeroLead(todayDate.getSeconds(),2)
    return date + ' ' + time
}

export const FormatDate = (inputDate) => {
    let getDate = inputDate.split(' ')
    let date = getDate[0]
    let time = getDate[1]
    var months = ['January', 'February', 'March', 'April','May', 'June', 'July', 'August', 'September','October', 'November', 'December']
    var display_date = date.split('-')[2] + ' ' + months[parseInt(date.split('-')[1])] + ' ' + date.split('-')[0]
    return display_date + ', ' + time
}

