const postCreatedAtFormat = (date) => {
  // get date in format MM DD YYYY HH:MM:SS
  let tempDate = date.toString().split(' ').slice(1, 5)

  // convert time to HH:MM - keep in array format
  let timeArr = tempDate[tempDate.length - 1].toString().split(':').slice(0, 2)

  // convert time to 12h format
  // get hours
  let hours = timeArr[0]
  // part of the day
  let AmOrPm = hours >= 12 ? 'pm' : 'am'

  // convert hours
  hours = hours % 12 || 12

  // set converted hours to time array
  timeArr[0] = hours

  // generate new time string
  let time = `${timeArr.join(':')} ${AmOrPm}`

  // replace time with formated
  tempDate[tempDate.length - 1] = time

  return tempDate.join(' ')
}

module.exports = postCreatedAtFormat
