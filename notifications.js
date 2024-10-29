/* 
    Module to manage notifications
    This module will be used to create, view and delete notifications
    Notifications will be stored in an array
    Notifications will be displayed and managed in the notifications panel

    A user menu will be displayed to manage notifications

    MOCK_CONN: If true, the connection to the server will be mocked

    A notification will have the following properties:
        JID: Job ID
        status: Status of the job (new, in-progress, completed)
        consumer: IP address of the requesting consumer
*/

// cslog is defined in main.js
cslog('Notifications module loaded');

const MOCK_CONN = true;     /* Mock connection */
let NOTIFICATIONS = [];    /* Array of notifications */


function get_random_jid() {
    /* Generate a random JID */
    return "JID-" + Math.random().toString().slice(2, 7);
}


function get_random_notification_id() {
    /* Generate a random notification ID */
    return "NOTIF_ID-" + Math.random().toString().slice(2, 9);
}


/* Create sample NOTIFICATIONS if MOCK enabled */
if (MOCK_CONN) {
    cslog('MOCK MODE enabled');
    NOTIFICATIONS = [
        { ID: "NOTIF_ID-0000000", JID: "JID-11111", status: "new", consumer: "192.168.1.1" },
        { ID: "NOTIF_ID-9999999", JID: "JID-99999", status: "new", consumer: "192.168.1.1" },
        { ID: get_random_notification_id(), JID: get_random_jid(), status: "new", consumer: "192.168.1.1" },
        { ID: get_random_notification_id(), JID: get_random_jid(), status: "in-progress", consumer: "192.168.1.2" },
        { ID: get_random_notification_id(), JID: get_random_jid(), status: "completed", consumer: "192.168.1.3" },
        { ID: get_random_notification_id(), JID: get_random_jid(), status: "failed", consumer: "192.168.1.4" },
        { ID: get_random_notification_id(), JID: get_random_jid(), status: "canceled", consumer: "192.168.1.4" }
    ];     /* Array of notifications */    
}



function get_notifications() {
    /* Return the list of notifications */
    if (MOCK_CONN) {
        return JSON.stringify(NOTIFICATIONS);
    };
}


async function get_ip() {
    // Fetch the IP address from the API
    const url = "https://ipinfo.io/json"  /* API TO GET CLIENT INFO */
    try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
    
        const json = await response.json();
        return json.ip;
      } catch (error) {
        console.error(error.message);
      }

};


async function create_notification() {
    /* Create a new notification 
        This function is async because it fetches the client IP address
    */
    let client_ip = await get_ip();
    let JID = get_random_jid();
    let notification = { ID: get_random_notification_id(), JID: JID, status: "new", consumer: client_ip };
    cslog('Notification created: ' + JSON.stringify(notification));
    NOTIFICATIONS.push(notification);
    cslog('Added new notification: ' + get_notifications());

    return notification;
}

cslog('Notifications: ' + get_notifications());


/* Delete a notification by NOTIF_ID */
function delete_notification_by_ID(NOTIF_ID) {
    /* Delete a notification by ID */
    let index = NOTIFICATIONS.findIndex(notification => notification.ID === NOTIF_ID);
    if (index > -1) {
        let delete_confirm = confirm('Do you want to delete the notification: ' + JSON.stringify(NOTIFICATIONS[index]));
    
        if (delete_confirm) {
            cslog('Deleting notification by ID: ' + JSON.stringify(NOTIFICATIONS[index]));
            NOTIFICATIONS.splice(index, 1);
            return true;
        } else {
            cslog('Notification NOTIF_ID ' + NOTIF_ID + ' not deleted');
            return false;
        }
    } else {
        cslog(`Notification NOTIF_ID ${NOTIF_ID} not found`);
        return false;
    }

}


function delete_notification_by_JID(JID) {
    /* Delete a notification by JID */
    let index = NOTIFICATIONS.findIndex(notification => notification.JID === JID);
    if (index > -1) {
        let delete_confirm = confirm('Do you want to delete the notification: ' + JSON.stringify(NOTIFICATIONS[index]));

        if (delete_confirm) {
            cslog('Deleting notification by JID: ' + JSON.stringify(NOTIFICATIONS[index]));
            NOTIFICATIONS.splice(index, 1);
            return true;
        } else {
            cslog('Notification NOTIF_ID ' + NOTIF_ID + ' not deleted');
            return false;
        }
    } else {
        cslog(`Notification JID ${JID} not found`);
        return false;
    }
}

function delete_notification(NOTIF_ID = undefined, JID = undefined) {
    /* Delete a notification by NOTIF_ID or JID */
    if (NOTIF_ID !== undefined) {
        return delete_notification_by_ID(NOTIF_ID);
    } else if (JID !== undefined) {
        return delete_notification_by_JID(JID);
    }
}


function get_notification_by_ID(NOTIF_ID) {
    /* Get a notification by ID */
    let index = NOTIFICATIONS.findIndex(notification => notification.ID === NOTIF_ID);
    if (index > -1) {
        return NOTIFICATIONS[index];
    } else {
        customAlert(`Notification NOTIF_ID ${NOTIF_ID} not found`);
        return false;
    }
}

function get_notification_by_JID(JID) {
    /* Get a notification by JID */
    let index = NOTIFICATIONS.findIndex(notification => notification.JID === JID);
    if (index > -1) {
        return NOTIFICATIONS[index];
    } else {
        customAlert(`Notification JID ${JID} not found`);
        return false;
    }
}

function get_notification(NOTIF_ID = undefined, JID = undefined) {
    /* Get a notification by NOTIF_ID or JID */
    if (NOTIF_ID !== undefined) {
        return get_notification_by_ID(NOTIF_ID);
    } else if (JID !== undefined) {
        return get_notification_by_JID(JID);
    }
}


function update_notification_status_by_ID(NOTIF_ID) {
    /* Update the status of a notification by ID */
    let index = NOTIFICATIONS.findIndex(notification => notification.ID === NOTIF_ID);
    if (index > -1) {
        let new_status = prompt('Enter the new status: new, in-progress, completed');
        NOTIFICATIONS[index].status = new_status;
        return true;
    } else {
        customAlert(`Notification NOTIF_ID ${NOTIF_ID} not found`);
        return false;
    }
}

function update_notification_status_by_JID(JID) {
    /* Update the status of a notification by JID */
    let index = NOTIFICATIONS.findIndex(notification => notification.JID === JID);
    if (index > -1) {
        let new_status = prompt('Enter the new status: new, in-progress, completed');
        NOTIFICATIONS[index].status = new_status;
        return true;
    } else {
        customAlert(`Notification JID ${JID} not found`);
        return false;
    }
}


function update_notification_status(NOTIF_ID = undefined, JID = undefined) {
    /* Update the status of a notification by NOTIF_ID or JID */
    if (NOTIF_ID !== undefined) {
        return update_notification_status_by_ID(NOTIF_ID);
    } else if (JID !== undefined) {
        return update_notification_status_by_JID(JID);
    }
}

/* Get a notification by ID */
// const NOTIF_ID='NOTIF_ID-0000000';
// let notification = get_notification_by_ID(NOTIF_ID);
// cslog('Notification by ID: ' + JSON.stringify(notification));
/* Get a notification by JID */
// const JID='JID-99999';
// let notification = get_notification_by_JID(JID);
// cslog('Notification by JID: ' + JSON.stringify(notification));


/* Delete a notification by NOTIF_ID */
// const NOTIF_ID='NOTIF_ID-0000000';
// delete_notification(NOTIF_ID, undefined);

/* Delete a notification by JID */
// const JID='JID-99999';
// delete_notification(undefined,JID);


function build_menu(menu_items = []) {
    /* Build the menu items string from the array of menu items*/
    let menu_items_msg = "";
    menu_items.forEach((element, index) => {
        menu_items_msg += `${index} - ${element}\n`
    });
    return menu_items_msg;

}

function menu_notifications_actions() {
    const menu_items = [
        'EXIT',
        'Add notification',
        'List all notifications', 
        'View notification by NOTIF_ID - Ex: NOTIF_ID-0000000', 
        'View notification by JID_ID - Ex: JID-99999',
        'Delete notification by NOTIF_ID - Ex: NOTIF_ID-0000000', 
        'Delete notification by JID_ID - Ex: JID-99999',
        'Update notification status by JID_ID - Ex: JID-99999'
    ]
   let menu_items_msg = "";
    menu_items_msg = build_menu(menu_items);

    let menu_item = Number(prompt('Notifications Manager, task:\n'
        + menu_items_msg));
     
    cslog('Menu item selected: ' + menu_item);
    return menu_item;
}


async function show_menu() {
    let _lp_flag = true;

    while (_lp_flag) {

        let action = menu_notifications_actions();

        let NOTIF_ID = "";

        switch (action) {
            case 0:
                /* Exit */
                _lp_flag = false;
                break;
            
            case 1:
                /* Add notification */
                notification = await create_notification();
                cslog('Menu Option 1: ' + JSON.stringify(notification));
                customAlert('Notification created: ' + JSON.stringify(notification));
                _lp_flag = confirm('Do you want to continue managing notifications ?');
                break;
                
            case 2:
                /* List notifications */
                notifications = get_notifications();
                cslog('Menu Option 2: ' + notifications);
                customAlert('Notifications: ' + notifications);
                _lp_flag = confirm('Do you want to continue managing notifications ?');
                break;

            case 3:
                /* View notification by NOTIF_ID */
                NOTIF_ID = prompt('Enter the NOTIF_ID');
                notification = get_notification(NOTIF_ID, undefined);
                cslog('Menu Option 3: ' + JSON.stringify(notification));
                customAlert('Notification: ' + JSON.stringify(notification));
                _lp_flag = confirm('Do you want to continue managing notifications ?');
                break;
                
            case 4:
                /* View notification by JID */
                JID = prompt('Enter the JID');
                notification = get_notification(undefined, JID);
                cslog('Menu Option 4: ' + JSON.stringify(notification));
                customAlert('Notification: ' + JSON.stringify(notification));
                _lp_flag = confirm('Do you want to continue managing notifications ?');
                break;
                
            case 5:
                /* Delete notification by NOTIF_ID */
                NOTIF_ID = prompt('Enter the NOTIF_ID to delete');
                deletion = delete_notification(NOTIF_ID, undefined);
                if (deletion) {
                    customAlert('Notification deleted');
                } else {
                    customAlert('Notification NOT deleted');
                }
                _lp_flag = confirm('Do you want to continue managing notifications ?');
                break;
                
            case 6:
                /* Delete notification by JID */
                JID = prompt('Enter the JID to delete');
                deletion = delete_notification(undefined, JID);
                if (deletion) {
                    customAlert('Notification deleted');
                } else {
                    customAlert('Notification NOT deleted');
                }
                _lp_flag = confirm('Do you want to continue managing notifications ?');
                break;
                
            case 7:
                /* Update notification status by JID */
                JID = prompt('Enter the JID to update notification status');
                update = update_notification_status(undefined, JID);
                if (update) {
                    customAlert('Notification updated');
                } else {
                    customAlert('Notification NOT updated');
                }
                _lp_flag = confirm('Do you want to continue managing notifications ?');
                break;
            default:
                alert('Wrong option');
                _lp_flag = confirm('Do you want to continue managing notifications ?');
                break;
                
        }
    }
}

show_menu();

