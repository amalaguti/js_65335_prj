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
 //let NOTIFICATIONS = [];    /* Array of notifications */

const _NOTIF_STATUS_START = ["new", "queued", "scheduled"];
const _NOTIF_STATUS_RUNNING = ["in-progress", "paused", "delayed"];
const _NOTIF_STATUS_FINAL = ["completed", "failed", "canceled"];
const NOTIF_STATUS = _NOTIF_STATUS_START.concat(_NOTIF_STATUS_RUNNING, _NOTIF_STATUS_FINAL);
const ROOT_MENU_ITEMS = [
    'EXIT',
    'Add notification',
    'List all notifications', 
    'View notification', 
    'Delete notification',
    'Update notification status'
]

// by NOTIF_ID - Ex: NOTIF_ID-0000000', 
// by JID_ID - Ex: JID-99999',

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


function gen_random_jid() {
    /* Generate a random JID */
    return "JID-" + Math.random().toString().slice(2, 7);
}


function gen_random_notification_id() {
    /* Generate a random notification ID */
    return "NOTIF_ID-" + Math.random().toString().slice(2, 9);
}


/* MOCK function to get notifications */
// function get_notifications() {
//     /* Return the list of notifications */
//     if (MOCK_CONN) {
//         return JSON.stringify(NOTIFICATIONS);
//     };
// }

// function get_notification_by_ID(NOTIF_ID) {
//     /* Get a notification by ID */
//     let index = NOTIFICATIONS.findIndex(notification => notification.ID === NOTIF_ID);
//     if (index > -1) {
//         return NOTIFICATIONS[index];
//     } else {
//         customAlert(`Notification NOTIF_ID ${NOTIF_ID} not found`);
//         return false;
//     }
// }

// function get_notification_by_JID(JID) {
//     /* Get a notification by JID */
//     let index = NOTIFICATIONS.findIndex(notification => notification.JID === JID);
//     if (index > -1) {
//         return NOTIFICATIONS[index];
//     } else {
//         customAlert(`Notification JID ${JID} not found`);
//         return false;
//     }
// }

// function get_notification(NOTIF_ID = undefined, JID = undefined) {
//     /* Get a notification by NOTIF_ID or JID */
//     if (NOTIF_ID !== undefined) {
//         return get_notification_by_ID(NOTIF_ID);
//     } else if (JID !== undefined) {
//         return get_notification_by_JID(JID);
//     }
// }


async function create_notification() {
    /* Create a new notification 
        This function is async because it fetches the client IP address
    */
    let client_ip = await get_ip();
    let JID = gen_random_jid();
    let notification = { ID: gen_random_notification_id(), JID: JID, status: "new", consumer: client_ip };
    cslog('Notification created: ' + JSON.stringify(notification));
    NOTIFICATIONS.push(notification);
    cslog('Added new notification: ' + get_notifications());

    return notification;
}


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



function validate_update_status_rules(current_status, new_status) {
    /* Validate the update status based on the following rules */

    // Rule 1 - for new_status queued, only if current_status is new
    if (new_status === "queued" && current_status === "new") {
        return true;
    }

    // Rule 2 - for new_status scheduled, only if current_status is new
    if (new_status === "scheduled" && current_status === "new") {
        return true;
    }

    // Rule 3 - for new_status in RUNNING, only if current_status is in START or RUNNING
    if (_NOTIF_STATUS_RUNNING.includes(new_status) && (_NOTIF_STATUS_START.includes(current_status) || _NOTIF_STATUS_RUNNING.includes(current_status))) {
        return true;
    }

    // Rule 4 - for new_status in FINAL, only if current_status is in START or RUNNING
    if (_NOTIF_STATUS_FINAL.includes(new_status) && (_NOTIF_STATUS_START.includes(current_status) || _NOTIF_STATUS_RUNNING.includes(current_status))) {
        return true;
    }

    // Any other status change is invalid
    return false;
}


function _update_notification_status(notification) {
    /* Update the status of a notification */
    let new_status = prompt('Enter the new status:\n' + NOTIF_STATUS.join('\n'));
    if (NOTIF_STATUS.includes(new_status.toLowerCase())) {
        if (!validate_update_status_rules(notification.status, new_status.toLowerCase())) {
            customAlert(`Invalid status change from ${notification.status} to ${new_status.toLowerCase()}, please check the rules`);
            return false;
        }
        notification.status = new_status.toLowerCase();
        return true;
    } else {
        customAlert('Invalid status');
        return false;
    }
}


function update_notification_status_by_ID(NOTIF_ID) {
    /* Update the status of a notification by ID */
    notification = get_notification_by_ID(NOTIF_ID);
    if (notification) {
        return _update_notification_status(notification);
    } else {
        return false;
    }
}

function update_notification_status_by_JID(JID) {
    /* Update the status of a notification by JID */
    notification = get_notification_by_JID(JID);
    if (notification) {
        return _update_notification_status(notification);
    } else {
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


function build_menu(menu_items = []) {
    /* Build the menu items string from the array of menu items*/
    let menu_items_msg = "";
    menu_items.forEach((element, index) => {
        menu_items_msg += `${index} - ${element}\n`
    });
    return menu_items_msg;

}

function menu_notifications_actions() {
    const menu_items = ROOT_MENU_ITEMS

    let menu_items_msg = "";
    menu_items_msg = build_menu(menu_items);

    menu_item = Number(prompt('Notifications Manager, task:\n'
        + menu_items_msg));
     
    cslog('Menu item selected: ' + menu_item);
    return menu_item;
}

function menu_notifications_actions_by_options(menu_item) {
    const menu_items_by_options = [
        'EXIT',
        'by NOTIF_ID',
        'by JID_ID',
    ]

    menu_items_by_options.forEach((element, index) => {
        // concat the menu item with the option for options other than 'EXIT'
        if (index > 0) {
            menu_items_by_options[index] = `${menu_item} ${element}`
        }
    });
    menu_items_msg = build_menu(menu_items_by_options);

    menu_item = Number(prompt('Notifications Manager, task:\n'
        + menu_items_msg));
     
    cslog('Menu item selected: ' + menu_item);
    return menu_item;
}



async function show_menu() {
    let _lp_flag = true;

    while (_lp_flag) {
        /* Show the main menu */
        let action = menu_notifications_actions();

        switch (action) {
            case 0:
                /* Exit */
                _lp_flag = false;
                break;
            

            // ADD NOTIFICATION
            case 1:
                /* Add notification */
                notification = await create_notification();
                cslog('Menu Option 1: ' + JSON.stringify(notification));
                customAlert('Notification created: ' + JSON.stringify(notification));
                _lp_flag = confirm('Do you want to continue managing notifications ?');
                break;
                

            // LIST NOTIFICATIONS
            case 2:
                /* List notifications */
                notifications = get_notifications();
                cslog('Menu Option 2: ' + notifications);
                customAlert('Notifications: ' + notifications);
                _lp_flag = confirm('Do you want to continue managing notifications ?');
                break;

            
            // VIEW NOTIFICATION
            case 3:
                /* Delete notification by NOTIF_ID or by ID*/
                action = show_menu_by_options(ROOT_MENU_ITEMS[action])

                switch (action) {
                    case 0:
                        /* Exit */
                        _lp_flag = false;
                        break;
                    case 1:
                        /* View notification by NOTIF_ID */
                        NOTIF_ID = prompt('Enter the NOTIF_ID to view - Ex: NOTIF_ID-0000000');
                        notification = get_notification(NOTIF_ID, undefined);
                        cslog('Menu Option 3: ' + JSON.stringify(notification));
                        customAlert('Notification: ' + JSON.stringify(notification));
                        break;
                    case 2:
                        /* View notification by JID */
                        JID = prompt('Enter the JID to view - Ex: JID-99999');
                        notification = get_notification(undefined, JID);
                        cslog('Menu Option 4: ' + JSON.stringify(notification));
                        customAlert('Notification: ' + JSON.stringify(notification));
                        break;
                    default:
                        alert('Wrong option');
                        break;
                }
                _lp_flag = confirm('Do you want to continue managing notifications ?');
                break;

                
            // DELETE NOTIFICATION
            case 4:
                /* Delete notification by NOTIF_ID or by ID*/
                action = show_menu_by_options(ROOT_MENU_ITEMS[action])

                switch (action) {
                    case 0:
                        /* Exit */
                        _lp_flag = false;
                        break;
                    case 1:
                        /* Delete notification by NOTIF_ID */
                        NOTIF_ID = prompt('Enter the NOTIF_ID to delete - Ex: NOTIF_ID-0000000');
                        deletion = delete_notification(NOTIF_ID, undefined);
                        if (deletion) {
                            customAlert('Notification deleted');
                        } else {
                            customAlert('Notification NOT deleted');
                        }
                        break;
                    case 2:
                        /* Update notification status by JID */
                        JID = prompt('Enter the JID to delete - Ex: JID-99999')
                        update = update_notification_status(undefined, JID);
                        if (update) {
                            customAlert('Notification updated');
                        } else {
                            customAlert('Notification NOT updated');
                        }
                        break;
                    default:
                        alert('Wrong option');
                        break;
                }
                _lp_flag = confirm('Do you want to continue managing notifications ?');
                break;


            // UPDATE NOTIFICATION STATUS
            case 5:
                /* Update notification status by NOTIF_ID or by ID*/
                action = show_menu_by_options(ROOT_MENU_ITEMS[action])

                switch (action) {
                    case 0:
                        /* Exit */
                        _lp_flag = false;
                        break;
                    case 1:
                        /* Update notification status by NOTIF_ID */
                        NOTIF_ID = prompt('Enter the NOTIF_ID to update status - Ex: NOTIF_ID-0000000');
                        update = update_notification_status(NOTIF_ID, undefined);
                        if (update) {
                            customAlert('Notification updated');
                        } else {
                            customAlert('Notification NOT updated');
                        }
                        break;
                    case 2:
                        /* Update notification status by JID */
                        JID = prompt('Enter the JID to update status - Ex: JID-99999')
                        update = update_notification_status(undefined, JID);
                        if (update) {
                            customAlert('Notification updated');
                        } else {
                            customAlert('Notification NOT updated');
                        }
                        break;
                    default:
                        alert('Wrong option');  
                        break;
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

function show_menu_by_options(menu_item) {
    /* Show the menu by options to filter by NOTIF_ID or JID */
    action = menu_notifications_actions_by_options(menu_item);
    cslog('Menu filter by NOTIF_ID or JID selected option: ' + action);
    return action
}


/* Class representing a notification object */
class Notification {
    constructor(ID, JID, status, consumer) {
        this.ID = ID;
        this.JID = JID;
        this.status = status;
        this.consumer = consumer;
    }
}

/* Class to manage notifications objects*/
class Notifications {
    constructor() {
        this.notifications = [];
    }

    add(notification) {
        this.notifications.push(notification);
    }

    getByID(ID) {
        return this.notifications.find(notification => notification.ID === ID);
    }

    getByJID(JID) {
        return this.notifications.find(notification => notification.JID === JID);
    }

    deleteByID(ID) {
        const index = this.notifications.findIndex(notification => notification.ID === ID);
        if (index > -1) {
            this.notifications.splice(index, 1);
            return true;
        }
        return false;
    }

    deleteByJID(JID) {
        const index = this.notifications.findIndex(notification => notification.JID === JID);
        if (index > -1) {
            this.notifications.splice(index, 1);
            return true;
        }
        return false;
    }

    updateStatusByID(ID, newStatus) {
        const notification = this.getByID(ID);
        if (notification) {
            notification.status = newStatus;
            return true;
        }
        return false;
    }

    updateStatusByJID(JID, newStatus) {
        const notification = this.getByJID(JID);
        if (notification) {
            notification.status = newStatus;
            return true;
        }
        return false;
    }

    list() {
        return this.notifications;
    }
}

/* Create a new instance of Notifications */
const notifications = new Notifications();

/* Create sample NOTIFICATIONS if MOCK enabled */
if (MOCK_CONN) {
    cslog('MOCK MODE enabled');

    /* Array of mocked notifications */
    NOTIFICATIONS = [
        { ID: "NOTIF_ID-0000000", JID: "JID-11111", status: "new", consumer: "192.168.1.1" },
        { ID: "NOTIF_ID-9999999", JID: "JID-99999", status: "new", consumer: "192.168.1.1" },
        { ID: gen_random_notification_id(), JID: gen_random_jid(), status: "new", consumer: "192.168.1.1" },
        { ID: gen_random_notification_id(), JID: gen_random_jid(), status: "in-progress", consumer: "192.168.1.2" },
        { ID: gen_random_notification_id(), JID: gen_random_jid(), status: "completed", consumer: "192.168.1.3" },
        { ID: gen_random_notification_id(), JID: gen_random_jid(), status: "failed", consumer: "192.168.1.4" },
        { ID: gen_random_notification_id(), JID: gen_random_jid(), status: "canceled", consumer: "192.168.1.4" }
    ];     

    for  (let _notification of NOTIFICATIONS) {
        notifications.add(new Notification(_notification.ID, _notification.JID, _notification.status, _notification.consumer));
    }
}

/* Show notifications */
cslog('Notifications: ' + JSON.stringify(notifications.list()));
// show_menu();

cslog('Notification by ID: ' + JSON.stringify(notifications.getByID("NOTIF_ID-0000000")));
cslog('Notification by JID: ' + JSON.stringify(notifications.getByJID("JID-99999")));