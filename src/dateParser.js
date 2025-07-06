import { getWording } from "./wordings"

export function formatToRelative(dateInput) {
    if (dateInput == null) {
        return "Никогда";
    }
    
    let date = isDate(dateInput) ? dateInput : new Date(dateInput);
    
    if (isNaN(date.getTime())) {
        console.log(date);
        return "Неизвестная дата";
    }
    
    let currentDate = Date.now();
    let diffenence = currentDate - date;
    if (wasYesterday(date)) {
        return `Вчера в ${date.toLocaleTimeString()}`;
    }
    return getRelative(diffenence);
}

function isDate(variable) {
    return variable instanceof Date;
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
    if (seconds <= 0)
        return "Только что"
    for (let i = secondsToMeasuresPairs.length - 1; i >= 0; i--) {
        let interval = Math.floor(seconds / secondsToMeasuresPairs[i].value);
        if (interval > 0) {
            return getWording(interval, wordings[secondsToMeasuresPairs[i].key]) + " назад";
        }
    }
}

const wordings = {
    "s": ["секунду", "секунды", "секунд"],
    "min": ["минуту", "минуты", "минут"],
    "h": ["час", "часа", "часов"],
    "d": ["день", "дня", "дней"],
    "w": ["неделю", "недели", "недель"],
    "m": ["месяц", "месяца", "месяцев"],
    "y": ["год", "года", "лет"]
}

const secondsToMeasuresPairs = [
    { value: 1, key: "s" },
    { value: 60, key: "min" },
    { value: 3600, key: "h" },
    { value: 86400, key: "d" },
    //{ value: 604800, key: "w" },
    { value: 2592000, key: "m" },
    { value: 31536000, key: "y" }
]