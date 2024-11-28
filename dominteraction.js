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
    alert(`New notification created ${notification.ID}`);
    showStatusStart()
}


function update_status(event) {
    // Update the status of the notification
    // The status is set based on the selected button

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
    } else if (event.target.classList.contains('btn-pause')) {
        new_status = prompt('Enter the status\nOptions: "paused", "delayed"');
    } else if (event.target.classList.contains('btn-terminate')) {
        new_status = prompt('Enter the status\nOptions: "completed", "failed", "canceled"');
    }

    update = update_notification_status(notification, new_status);
    if (update) {
        refresh_panels();
    } else {
        customAlert('Error updating status');
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
        }
    });
}

cslog("DOM Interaction loaded");
cslog('Notifications: ' + JSON.stringify(NOTIFICATIONS.list()));

document.addEventListener("DOMContentLoaded", function () {
    // customAlert("DOM built - Notifications loaded, ready to work");
    cslog("DOM built - Notifications loaded, ready to work");
    // Show the notifications at the start
    refresh_panels();
});

controlBtnsHandler();





