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
        customAlert('Error updating status');
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
    // Fill the modal dialog with options
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

    optsDialog.showModal();
    // "Cancel" button closes the dialog without submitting because of [formmethod="dialog"], triggering a close event.
    optsDialog.addEventListener("close", (e) => {
        let new_status = optsDialog.returnValue
        // Forced to use event.stopImmediatePropagation() due update function was triggerd multiple times (2 or 3)
        // error started to happen due modal implementation
        e.stopImmediatePropagation()
        _update_status(notification, new_status);
    });

    // Prevent the "confirm" button from the default behavior of submitting the form, and close the dialog with the `close()` method, which triggers the "close" event.
    confirmBtn.addEventListener("click", (event) => {
        event.preventDefault(); // We don't want to submit this fake form
        optsDialog.close(selectEl.value); // Have to send the select box value here.

    });

}

cslog("DOM Interaction loaded");
cslog('Notifications: ' + JSON.stringify(NOTIFICATIONS.list()));
document.addEventListener("DOMContentLoaded", function () {
    cslog("DOM built - Notifications loaded, ready to work");
    // Show the notifications at the start
    refresh_panels();
});
controlBtnsHandler();



