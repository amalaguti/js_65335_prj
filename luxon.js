//console.dir(luxon);


// const now = luxon.DateTime.now();
// const nowUTC = now.toUTC();
// const later = luxon.DateTime.fromISO("2024-12-04T16:42")
// cslog(now.toString());
// cslog(nowUTC.toString());
// cslog(later.toString());
// cslog((later - now) / 60 /60);

// i = luxon.Interval.fromDateTimes(now, later);
// cslog(`${Math.round(i.length('minutes'))} minutes have passed since ${now.toString()}`);

function dt_now() {
    return luxon.DateTime.now();
}

function dt_now_str() {
    return dt_now().toString();
}