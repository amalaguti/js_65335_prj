function showAll() {
    // Show notifications-all panel and blur the rest
    document.querySelector('.notifications-start').style.filter = 'blur(3px)';
    document.querySelector('.notifications-running').style.filter = 'blur(3px)';
    document.querySelector('.notifications-final').style.filter = 'blur(3px)';
    document.querySelector('.notifications-all').style.display = 'block';
    document.querySelector('.notifications-all').style.filter = 'none';

    // Fill the notifications-all panel with the notifications
    let notifications = NOTIFICATIONS.list();
    let elemNotificationList = document.querySelector('.notification-list-all');

    // Create a list of notifications, build the list with div,ul,li elements and append it to the notifications-all panel
    buildNotificationList(notifications, elemNotificationList, 'lightblue')
}

function showStatusStart() {
    // Fill the notifications-all panel with the notifications
    let notifications = NOTIFICATIONS.get_status_start();
    let elemNotificationList = document.querySelector('.notification-list-start');

    // Create a list of notifications, build the list with div,ul,li elements and append it to the notifications-all panel
    buildNotificationList(notifications, elemNotificationList, 'lightgreen')
}

function showStatusRunning() {
    // Fill the notifications-all panel with the notifications
    let notifications = NOTIFICATIONS.get_status_running();
    let elemNotificationList = document.querySelector('.notification-list-running');

    // Create a list of notifications, build the list with div,ul,li elements and append it to the notifications-all panel
    buildNotificationList(notifications, elemNotificationList, 'orange')
}

function showStatusFinal() {
    // Fill the notifications-all panel with the notifications
    let notifications = NOTIFICATIONS.get_status_terminated();
    let elemNotificationList = document.querySelector('.notification-list-final');

    // Create a list of notifications, build the list with div,ul,li elements and append it to the notifications-all panel
    buildNotificationList(notifications, elemNotificationList)
}

function closeAll() {
    // Close notifications-all panel and remove blur from the rest
    document.querySelector('.notifications-start').style.filter = 'none';
    document.querySelector('.notifications-running').style.filter = 'none';
    document.querySelector('.notifications-final').style.filter = 'none';
    document.querySelector('.notifications-all').style.display = 'none';
}


function refresh_panels() {
    // Refresh the panels
    showStatusStart()
    showStatusRunning()
    showStatusFinal()
    cslog('Notifications list refreshed');
    toast_refresh_panels();
}

function buildNotificationList(notifications, elemNotificationList, bg_color) {
    // Create a list of notifications, build the list with div,ul,li elements and append it to the notifications panel
    elemNotificationList.innerHTML = '';

    for (let i = 0; i < notifications.length; i++) {
        let notification = notifications[i];

        // Create a div element for each notification
        // Add click event listener and change style on selected
        let notificationElement_div = document.createElement('div');
        notificationElement_div.classList.add('notification');
        stylingNotificationElement_div(notificationElement_div, bg_color);
        notificationElement_div.addEventListener('click', function () {
            styleNotificationSelected(notificationElement_div, notification.ID);
        });

        // Create a ul element for each notification
        let notificationElement_ul = document.createElement('ul');

        // Create a li element for each notification
        let notificationElement_li = document.createElement('li');
        stylingNotificationElement_li(notificationElement_li);

        // Background color of the notification element by status
        if (_NOTIF_STATUS_FINAL.includes(notification.status)) {
            if (notification.status == 'completed') {
                notificationElement_div.style.backgroundColor = 'green'
            } else if (notification.status == 'canceled') {
                notificationElement_div.style.backgroundColor = 'yellow'
            } else if (notification.status == 'failed') {
                notificationElement_div.style.backgroundColor = 'red'
            }
        } else if (_NOTIF_STATUS_RUNNING.includes(notification.status)) {
            notificationElement_div.style.backgroundColor = 'orange'
        } else if (_NOTIF_STATUS_START.includes(notification.status)) {
            notificationElement_div.style.backgroundColor = 'lightgreen'
        }


        notificationElement_li.innerHTML = contentNotification_li(notification);
        notificationElement_ul.appendChild(notificationElement_li);
        notificationElement_div.appendChild(notificationElement_ul);
        elemNotificationList.appendChild(notificationElement_div);

        stylingNotificationElement_span();
    }
}

function stylingNotificationElement_div(notificationElement_div, bg_color) {
    // Styling the notification element div
    notificationElement_div.style.display = 'flex';
    notificationElement_div.style.margin = '10px';
    notificationElement_div.style.border = '1px solid black';
    notificationElement_div.style.backgroundColor = bg_color;
    notificationElement_div.style.borderRadius = '5px';

}

function stylingNotificationElement_li(notificationElement_li) {
    // Styling the notification element li
    notificationElement_li.style.width = '30ch';
    notificationElement_li.style.overflowWrap = 'break-word';
    notificationElement_li.style.padding = '1em';
}


function contentNotification_li(notification) {
    // Content of the notification element li
    // cslog(notification);
    return '<span class="notif_id">' + notification.ID + '</span>' + ' <br> ' + notification.JID + ' <br> ' + '<span class="notif_status">' + notification.status + '</span>';
}

function stylingNotificationElement_span() {
    // Styling the notification element span
    let spans_notif_id = document.querySelectorAll('.notif_id');
    spans_notif_id.forEach(span => {
        span.style.fontWeight = 'bold';
    });


    let spans_notif_status = document.querySelectorAll('.notif_status');
    spans_notif_status.forEach(span => {
        span.style.fontWeight = 'bold';
    });
}

function styleNotificationSelected(notificationElement_div, notif_id) {
    // Style the notification div element when selected by toggling class selected
    cslog('Notification clicked: ' + notif_id);
    notificationElement_div.classList.toggle('selected');

    // Remove the selected class from all other notifications
    let notifications = document.querySelectorAll('.notification');
    notifications.forEach(notification => {
        if (notification !== notificationElement_div) {
            notification.classList.remove('selected');
        }
    });

}


async function new_notification(event) {
    // Create a new notification
    notification = await create_notification();
    NOTIFICATIONS.add(notification)

    // Open the modal with the notification info
    let tblHTML = tableHTML(notification);

    openModal(`<p><b>Notification created</b></p><div>${tblHTML}</div>`);
    refresh_panels();
}


function update_status(event) {
    // Update the status of the notification
    // The notification is picked from the selected button

    let selected = document.querySelector('.selected');
    if (selected) {
        let notif_id = selected.querySelector('.notif_id').textContent;
        let notif_status = selected.querySelector('.notif_status').textContent;
        notification = NOTIFICATIONS.getByID(notif_id)[0];
    } else {
        customAlert('Select a notification to update the status');
        return
    }

    // Update the status based on the button clicked
    if (event.target.classList.contains('btn-start')) {
        new_status = 'in-progress';
        _update_status(notification, new_status)
    } else if (event.target.classList.contains('btn-pause')) {
        modalDialogOpen_options(["paused", "delayed"]);
        modalDialogOpen();
    } else if (event.target.classList.contains('btn-terminate')) {
        modalDialogOpen_options(["completed", "failed", "canceled"]);
        modalDialogOpen();
    }
}

function _update_status(notification, new_status) {
    // Update the status of the notification
    update = update_notification_status(notification, new_status);
    if (update) {
        refresh_panels();
    } else {
        customAlert('Error updating status - verify status transition rules');
    }
}

function showNotificationInfo() {
    // Show the notification
    let selected = document.querySelector('.selected');
    if (selected) {
        let notif_id = selected.querySelector('.notif_id').textContent;
        notification = NOTIFICATIONS.getByID(notif_id)[0];

        //Generate HTML Table rows
        let tblHTML = tableHTML(notification);
        // Open the modal with the notification info
        openModal(tblHTML);
    } else {
        customAlert('Select a notification to show');
    }
}

function _tableRows(content) {
    // Generate HTML Table rows for the notification
    let _tRs = ''
    Object.keys(content).forEach(key => {
        _row = `<tr><th>${key}</th><td>${content[key]}</td></tr>`;
        _tRs += _row;
    });
    let tableRows = _tRs;

    return tableRows
}

function _tableHTML(tableBody) {
    // Table HTML for the notification
    let table_HTML = `
    <table class="data-table">
        <thead>
        </thead>

        <tbody>
        ${tableBody}
        </tbody>
    </table>
    `
    return table_HTML
}

function tableHTML(content) {
    // Table HTML for the notification

    //Generate HTML Table rows
    let tableRows = _tableRows(notification);
    return _tableHTML(tableRows);
}

function removeNotification() {
    // Remove the notification
    let selected = document.querySelector('.selected');
    if (selected) {
        let notif_id = selected.querySelector('.notif_id').textContent;
        customAlert(`Notification ${notif_id} will be removed`);
        NOTIFICATIONS.deleteByID(notif_id);
        refresh_panels();
        //showAll();
    } else {
        customAlert('Select a notification to remove');
    }
}


function controlBtnsHandler() {
    // Add event listener to control buttons
    btns = document.querySelectorAll('.control-button')
    btns.forEach(btn => {
        // Check what button is clicked and fire the corresponding function
        let btns_update_status = ['ctrl-btn-start', 'ctrl-btn-pause', 'ctrl-btn-terminate'];
        if (btns_update_status.some(r => Array.from(btn.classList).includes(r))) {
            btn.addEventListener('click', (event) => {
                update_status(event)
            })
        } else if (btn.classList.contains('ctrl-btn-new')) {
            btn.addEventListener('click', new_notification)
        } else if (btn.classList.contains('ctrl-btn-showAll')) {
            btn.addEventListener('click', showAll)
        } else if (btn.classList.contains('ctrl-btn-info')) {
            btn.addEventListener('click', showNotificationInfo)
        } else if (btn.classList.contains('ctrl-btn-remove')) {
            btn.addEventListener('click', removeNotification)
        }

    });
}


function openModal(contentHTML) {
    // Open the modal
    let modal = document.querySelector('.modal')
    modal.style.display = 'block';

    let modal_body = document.querySelector('.modal-body')
    modal_body.innerHTML = contentHTML;

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
function closeModal() {
    // Close the modal
    let modal = document.querySelector('.modal')
    modal.style.display = 'none';
}

function modalDialogOpen_options(options) {
    // Fill the select in the modal dialog with options
    let optionsHTML = document.querySelector('.optsDialog-select');
    _optionsHTML = '';
    options.forEach(option => {
        _optionsHTML += `<option>${option}</option>`;
    });

    optionsHTML.innerHTML = _optionsHTML;

}
function modalDialogOpen() {
    const optsDialog = document.getElementById("optsDialog");
    const selectEl = optsDialog.querySelector("select");
    const confirmBtn = optsDialog.querySelector("#confirmBtn");
    const cancelBtn = optsDialog.querySelector("#cancelBtn");

    optsDialog.showModal();
    // "Cancel" button closes the dialog without submitting because of [formmethod="dialog"], triggering a close event.
    optsDialog.addEventListener("close", (e) => {
        let new_status = optsDialog.returnValue
        // Forced to use event.stopImmediatePropagation() due update function was triggerd multiple times (2 or 3)
        // error started to happen due modal implementation
        e.stopImmediatePropagation()
        console.log("Dialog closed with returnValue: ", new_status);
        if (new_status != "cancel") {
            _update_status(notification, new_status);
        }
    });

    // Add event listeners to the modal buttons "confirm" and "cancel"
    addEvtListeners_toModalButtons(selectEl);

}

function addEvtListeners_toModalButtons(selectEl) {
        // Prevent the "confirm" button from the default behavior of submitting the form, and close the dialog with the `close()` method, which triggers the "close" event.
        confirmBtn.addEventListener("click", (event) => {
            event.preventDefault(); // We don't want to submit this fake form
            optsDialog.close(selectEl.value); // Have to send the select box value here.
        });
        cancelBtn.addEventListener("click", (event) => {
            event.preventDefault(); // We don't want to submit this fake form
            optsDialog.close(cancelBtn.value); // Have to send the select box value here.
        });
}


async function toast_refresh_panels() {
    cslog("Toast notification for refreshing the panels");
    // Toast notification for refreshing the panels
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    // Toast.fire({
    //     icon: "success",
    //     title: "Notifications refreshed",
    // });

    while (swal.isVisible()) {              // && swal.getTitle().textContent == "Control Panel") {    
        cslog("OTHER SWAL OPEN YET, sleeping 1s");
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    ; (async () => {
        await Toast.fire({
            icon: "success",
            title: "Notifications refreshed",
        });
    })()

}

function toastify(text, duration=3000, gravity="top", position="center", bgcolor="black", color="white") {
    Toastify({
        text: text,
        duration: duration,
        gravity: gravity, // `top` or `bottom`
        position: position, // `left`, `center` or `right`
        style: {
            background: bgcolor,
            color: color,
            fontSize: "24px",
            borderRadius: "8px",
            padding: "10px 20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            height: "100px",
            width: "fit-content",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        onClick: function(){} // Callback after click
    }).showToast();
}

function check_aged_notifications(every=5, unit='seconds', age_limit=10) {
    // Interval to check for aged notifications
    // Notifications with last_update greater than age_limit
    // Finalized notifications are excluded
    const milliseconds = 1000

    toastify(`Checking aged notifications every ${every} seconds`);

    setInterval(() => {
        const aged_notifications = NOTIFICATIONS.get_aged_notifications(unit='seconds', check_last_update=true, age_limit=age_limit, include_final=false)
        console.log('Aged notifications: ', aged_notifications.length);
        if (aged_notifications.length > 0) {
            toastify(`Aged notifications: ${aged_notifications.length}`,duration=3000, gravity="top", position="center", bgcolor="orange", color="white");            
        }
    }, every * milliseconds);
}

function check_expired_notifications(every=10, unit='seconds', age_limit=30, remove=false,expire_max_last_update=30) {
    // Interval to check for expired notifications
    // Notifications with creation time greater than age_limit
    // This notifications should have been concluded or they are orphaned
    // Safely to remove 
    const milliseconds = 1000

    toastify(`Checking expired notifications every ${every} seconds`);

    setInterval(() => {
        const expired_notifications = NOTIFICATIONS.get_aged_notifications(unit='seconds', check_last_update=false, age_limit=age_limit, include_final=true, expire_max_last_update=expire_max_last_update)
        console.log('Expired notifications: ', expired_notifications.length);
        if (expired_notifications.length > 0) {
            toastify(`Expired notifications: ${expired_notifications.length}`,duration=5000, gravity="top", position="center", bgcolor="yellow", color="black");

            if (remove) {
                remove_notifications(expired_notifications);
            }
        }
    }, every * milliseconds);   
}

function remove_notifications(notifications) {
    // Remove expired notifications
    console.log('Expired notifications: ', notifications.length);
    
    toastify(`Remove notifications count: ${notifications.length}`,duration=10000, gravity="bottom", position="center", bgcolor="red", color="white");
    notifications.forEach(notification => {
        NOTIFICATIONS.deleteByID(notification.ID);
    });
    refresh_panels();

}

cslog("DOM Interaction loaded");
cslog('Notifications: ' + JSON.stringify(NOTIFICATIONS.list()));
document.addEventListener("DOMContentLoaded", function () {
    cslog("DOM built - Notifications loaded, ready to work");
    toastify("DOM built - Notifications loaded, ready to work");
});

function start() {
    controlBtnsHandler();
    refresh_panels();
    check_aged_notifications(every=5, unit='seconds', age_limit=10);
    check_expired_notifications(every=10, unit='seconds', age_limit=30, remove=true, expire_max_last_update=30);
    
}

//start(); // Commented out to show the welcome message first (and call start from welcome() function)
welcome();



