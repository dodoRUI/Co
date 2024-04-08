const dateTime = {
    // 格式化日期时间
    dateTimeFormat(arr, property) {
        for (let i in arr) {
            if (arr[i][property]) {
                const date = new Date(arr[i][property]);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');
                arr[i][property] = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            }
        }
        return arr
    },

    // 格式化日期
    dateFormat(arr, property) {
        for (let i in arr) {
            if (arr[i][property]) {
                const date = new Date(arr[i][property]);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                arr[i][property] = `${year}-${month}-${day}`;
            }
        }
        return arr
    }
}

module.exports = dateTime