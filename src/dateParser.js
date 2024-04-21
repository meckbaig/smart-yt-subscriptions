export function formatToRelative(dateString) {
    let date = parseDate(dateString);
    let currentDate = Date.now();
    let diffenence = currentDate - date;
    if (wasYesterday(date)) {
        return `Вчера в ${date.toLocaleTimeString()}`;
    }
    return getRelative(diffenence);
}

function parseDate(str) {
    var parts = str.split(' ');
    var timeParts = parts[0].split(':');
    var dateParts = parts[1].split('.');
    return new Date(dateParts[2], dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1], timeParts[2]);
}

function diffenenceDayAndGreater(diffenence) {
    let sd = Math.floor(diffenence / (1000 * 3600 * 24));
    console.log(sd);
    return sd > 0;
}

function wasYesterday(date) {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    var compareDate = new Date(date.getTime());
    compareDate.setHours(0, 0, 0, 0);

    return compareDate.getTime() === yesterday.getTime();
}

function getRelative(diffenence) {
    let seconds = Math.floor(diffenence / 1000);
    for (let i = secondsToMeasuresPairs.length - 1; i >= 0; i--) {
        let interval = Math.floor(seconds / secondsToMeasuresPairs[i].value);
        if (interval > 0) {
            return properWording(interval, secondsToMeasuresPairs[i].key) + " назад";
        }
    }
}

function properWording(interval, measure) {
    let intervalsLastNumber = interval % 10;
    let tens = Math.floor((interval % 100) / 10);
    let measureStringPosition;

    if (tens == 1) {
        measureStringPosition = 2;
    }
    else if (intervalsLastNumber == 1) {
        measureStringPosition = 0;
    }
    else if (intervalsLastNumber >= 2 && intervalsLastNumber <= 4) {
        measureStringPosition = 1;
    }
    else {
        measureStringPosition = 2;
    }

    return `${interval} ${wordings[measure][measureStringPosition]}`;
}

let wordings = {
    "s": ["секунда", "секунды", "секунд"],
    "min": ["минута", "минуты", "минут"],
    "h": ["час", "часа", "часов"],
    "d": ["день", "дня", "дней"],
    "w": ["неделю", "недели", "недель"],
    "m": ["месяц", "месяца", "месяцев"],
    "y": ["год", "года", "лет"]
}

let secondsToMeasuresPairs = [
    { value: 1, key: "s" },
    { value: 60, key: "min" },
    { value: 3600, key: "h" },
    { value: 86400, key: "d" },
    //{ value: 604800, key: "w" },
    { value: 2592000, key: "m" },
    { value: 31536000, key: "y" }
]