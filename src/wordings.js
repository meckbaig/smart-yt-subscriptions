export function getWording(interval, wordsArray) {
    let intervalsLastNumber = interval % 10;
    let tens = Math.floor((interval % 100) / 10);
    let position;

    if (tens == 1) {
        position = 2;
    }
    else if (intervalsLastNumber == 1) {
        position = 0;
    }
    else if (intervalsLastNumber >= 2 && intervalsLastNumber <= 4) {
        position = 1;
    }
    else {
        position = 2;
    }
    return `${interval} ${wordsArray[position]}`;
}