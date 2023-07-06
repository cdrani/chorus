const secondsToTime = seconds => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    let time = ""

    if (hours > 0) {
        time += hours + ":"
    }

    if (minutes < 10 && hours !== 0) {
      time += "0"
    }

    time += minutes + ":"
    if (remainingSeconds < 10) {
        time += "0"
    }

    time += remainingSeconds

    return time
}

const timeToSeconds = time => {
    if (!time || !time?.includes(':')) return

    const timeParts = time.split(":").map(Number)

    if (timeParts.length === 3) {
        const [hours, minutes, seconds ] = timeParts
        return (hours || 0) * 3600 + minutes * 60 + seconds
    } else if (timeParts.length === 2) {
        const [minutes, seconds ] = timeParts
        return minutes * 60 + seconds
    }

    return timeParts.at(0)
}
