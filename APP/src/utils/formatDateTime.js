const formatDateTime = {
    date(datestr) {
        const date = new Date(datestr);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        // 如果月份、日期、小时、分钟、秒数是个位数，则在前面补零
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}-${month}-${day}`;
    },
    dateTime(dateTime) {
        const date = new Date(dateTime);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        // 如果月份、日期、小时、分钟、秒数是个位数，则在前面补零
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}

export default formatDateTime