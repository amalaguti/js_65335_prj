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
    
    // Create a list of notifications, build the list with div,ul,li elementss and append it to the notifications-all panel
    buildNotificationList(notifications, elemNotificationList)

}

function closeAll() {
    // Close notifications-all panel and remove blur from the rest
    document.querySelector('.notifications-start').style.filter = 'none';
    document.querySelector('.notifications-running').style.filter = 'none';
    document.querySelector('.notifications-final').style.filter = 'none';
    document.querySelector('.notifications-all').style.display = 'none';
}

function buildNotificationList(notifications, elemNotificationList) {
    // Create a list of notifications, build the list with div,ul,li elements and append it to the notifications panel
    elemNotificationList.innerHTML = '';

    for (let i = 0; i < notifications.length; i++) {
        let notification = notifications[i];

        // Create a div element for each notification
        let notificationElement_div = document.createElement('div');
        stylingNotificationElement_div(notificationElement_div);

        // Create a ul element for each notification
        let notificationElement_ul = document.createElement('ul');
        
        // Create a li element for each notification
        let notificationElement_li = document.createElement('li');
        stylingNotificationElement_li(notificationElement_li);

        
        notificationElement_li.innerHTML = notification;
        notificationElement_ul.appendChild(notificationElement_li);
        notificationElement_div.appendChild(notificationElement_ul);
        elemNotificationList.appendChild(notificationElement_div);
    }
}

function stylingNotificationElement_div(notificationElement_div) {
    // Styling the notification element div
    notificationElement_div.style.display = 'flex';
    notificationElement_div.style.margin = '10px';
    notificationElement_div.style.border = '1px solid black';
    notificationElement_div.style.backgroundColor = 'lightgrey';
}

function stylingNotificationElement_li(notificationElement_li) {
    // Styling the notification element li
    notificationElement_li.style.width = '30ch';
    notificationElement_li.style.overflowWrap = 'break-word';
    notificationElement_li.style.padding = '1em';

}
// # width: 30ch, overflow-wrap: break-word 


cslog("DOM Interaction loaded");
cslog('Notifications: ' + JSON.stringify(NOTIFICATIONS.list()));

document.addEventListener("DOMContentLoaded", function() {
    // customAlert("DOM built - Notifications loaded, ready to work");
    cslog("DOM built - Notifications loaded, ready to work");
  });


elem = document.getElementById('btn-showAll')
cslog('Element: ' + elem)
elem.addEventListener('click', showAll)