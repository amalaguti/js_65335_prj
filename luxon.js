function dt_now() {
    return luxon.DateTime.now();
}

function dt_now_str() {
    return dt_now().toString();
}

function dt_age(base_dt, current_dt, unit = 'seconds') {
    return Math.round(current_dt.diff(base_dt, unit).as(unit));
}