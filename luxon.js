function dt_now() {
    return luxon.DateTime.now();
}

function dt_now_str() {
    return dt_now().toString();
}

function dt_from_iso(iso_str) {
    return luxon.DateTime.fromISO(iso_str);
}

function dt_age(base_dt, current_dt, unit = 'seconds') {

    // Convert strings to DateTime objects
    if (typeof base_dt === 'string') {
        base_dt = dt_from_iso(base_dt);
    }
    if (typeof current_dt === 'string') {
        current_dt = dt_from_iso(current_dt);
    }

    return Math.round(current_dt.diff(base_dt, unit).as(unit));
}


