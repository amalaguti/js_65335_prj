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

function buildNotificationList(notifications, elemNotificationList, bg_color) {
    // Create a list of notifications, build the list with div,ul,li elements and append it to the notifications panel
    elemNotificationList.innerHTML = '';

    for (let i = 0; i < notifications.length; i++) {
        let notification = notifications[i];

        // Create a div element for each notification
        let notificationElement_div = document.createElement('div');
        stylingNotificationElement_div(notificationElement_div, bg_color);

        // Create a ul element for each notification
        let notificationElement_ul = document.createElement('ul');
        
        // Create a li element for each notification
        let notificationElement_li = document.createElement('li');
        notificationElement_li.addEventListener('click', function() {
            // Show the notification details when clicking on the notification
            cslog('Notification clicked: ' + notification.ID);
        });
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




cslog("DOM Interaction loaded");
cslog('Notifications: ' + JSON.stringify(NOTIFICATIONS.list()));

document.addEventListener("DOMContentLoaded", function() {
    // customAlert("DOM built - Notifications loaded, ready to work");
    cslog("DOM built - Notifications loaded, ready to work");
    // Show the notifications at the start
    showStatusStart()
    showStatusRunning()
    showStatusFinal()
  });


// Add event listener to the Show All button
elem = document.getElementById('btn-showAll')
elem.addEventListener('click', showAll)

