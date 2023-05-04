module.exports = (date, convertToUTC, requireDate, isStartDate) => {
    if (date == '' || date == null || date == undefined) {
        return date;
    }
    
    if (requireDate && typeof(date) == 'string') {
        date = new Date(date);
    }

    if (isStartDate) {
        date.setHours(0, 0, 0, 0);
    }
    else if (isStartDate !== undefined && isStartDate !== null && isStartDate === false) {
        date.setHours(23, 59, 59, 59);
    }

    if (convertToUTC) {
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    }

    return date;
};