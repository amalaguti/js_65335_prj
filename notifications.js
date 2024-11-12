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


async function create_notification() {

    /* Create a new notification 
        This function is async because it fetches the client IP address
    */
    let client_ip = await get_ip();
    let JID = gen_random_jid();
    notification = new Notification(gen_random_notification_id(),JID,"new",client_ip);
    cslog('Notification created: ' + notification.toString());
    return notification;
}


function get_notification_by_ID(NOTIF_ID) {
    /* Get a notification by ID */
   return NOTIFICATIONS.getByID(NOTIF_ID)
}

function get_notification_by_JID(JID) {
    /* Get a notification by JID */
   return NOTIFICATIONS.getByJID(JID)
}

function get_notification(NOTIF_ID = undefined, JID = undefined) {
    /* Get a notification by NOTIF_ID or JID */
    if (NOTIF_ID !== undefined) {
        return get_notification_by_ID(NOTIF_ID);
    } else if (JID !== undefined) {
        return get_notification_by_JID(JID);
    }
}


/* Delete a notification by NOTIF_ID */
function delete_notification_by_ID(NOTIF_ID) {
    /* Delete a notification by ID */
   return NOTIFICATIONS.deleteByID(NOTIF_ID);

}

function delete_notification_by_JID(JID) {
    /* Delete a notification by JID */
   return NOTIFICATIONS.deleteByJID(JID);
    

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

function update_notification_status(notification) {
    /* Update the status of a notification running validation rules check first */
    let new_status = prompt('Enter the new status:\n' + NOTIF_STATUS.join('\n'));

    new_status = new_status.toLowerCase();
    if (NOTIF_STATUS.includes(new_status)) {
        if (!validate_update_status_rules(notification.status, new_status)) {
            customAlert(`Invalid status change from ${notification.status} to ${new_status}, please check the rules`);
            return false;
        }
    
        notification.update_status(new_status);
        return true;
    } else {
        customAlert('Invalid status');
        return false;
    }
}

function _view_notification(notification, _ID) {
    /* View notification, used in menu cases logic to reduce code duplication */
    if (notification instanceof Notification) {
        cslog(`View notification ${_ID} outcome: ${notification.toString()}`);
        customAlert('Notification: ' + notification.toString());
    } else {
        customAlert(`Notification ${_ID} not found`);
    }
}

function _delete_notification(Idx, _ID) {
    deletion = NOTIFICATIONS.deleteByIdx(Idx);
    if (deletion) {
        customAlert('Notification ' + _ID + ' deleted');
        return true;
    } else {
        customAlert('Notification ' + _ID + ' NOT deleted');
        return false
    }
}

function _update_status(notification, id) {
    /* Update the status of a notification, used in menu cases logic to reduce code duplication */
    if (notification instanceof Notification) {
        update = update_notification_status(notification);
        if (update) {
            customAlert('Notification updated');
            return true
        } else {
            customAlert('Notification NOT updated');
            return false
        }
    } else {
        customAlert(`Notification ${id} not found`);
        return false
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
    let menu_items_by_options = [
        'EXIT',
        'by NOTIF_ID',
        'by JID_ID',
    ]

    const menu_items_for_view_notifications = [
        'by status active',
        'by status terminated'
    ]

    if (menu_item === 'View notification') {
        console.log('Extend menu items for view notifications')
        menu_items_by_options = menu_items_by_options.concat(menu_items_for_view_notifications)
    }

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

                if (notification instanceof Notification) {
                    customAlert('Notification created: ' + notification.toString());
                    cslog('Notification added at position: ' + (NOTIFICATIONS.add(notification)-1));
                    cslog('Notifications count: ' + NOTIFICATIONS.count());
                } else {
                    cslog('Notification NOT created');
                    customAlert('Notification NOT created');
                }
                _lp_flag = confirm('Do you want to continue managing notifications ?');
                break;
                

            // LIST NOTIFICATIONS
            case 2:
                /* List notifications */                
                cslog('Menu Option 2: ' + NOTIFICATIONS.list());
                cslog('Notifications count: ' + NOTIFICATIONS.count());
                customAlert(`Notifications count ${NOTIFICATIONS.count()}: ` + NOTIFICATIONS.list());
                
                _lp_flag = confirm('Do you want to continue managing notifications ?');
                break;

            
            // VIEW NOTIFICATION
            case 3:
                /* View notification */
                action = show_menu_by_options(ROOT_MENU_ITEMS[action])

                switch (action) {
                    case 0:
                        /* Exit */
                        _lp_flag = false;
                        break;
                    case 1:
                        /* View notification by NOTIF_ID */
                        NOTIF_ID = prompt('Enter the NOTIF_ID to view - Ex: NOTIF_ID-0000000');
                
                        if (NOTIF_ID) {
                            notification = get_notification(NOTIF_ID, undefined);                
                            _view_notification(notification[0], NOTIF_ID)
                            break
                        }
                        break;
                    case 2:
                        /* View notification by JID */
                        JID = prompt('Enter the JID to view - Ex: JID-99999');

                        if (JID) {
                            notification = get_notification(undefined, JID);
                            _view_notification(notification[0], JID)
                            break
                        }
                        break;

                    case 3:
                        /* View notification by active status */
                        notifications = NOTIFICATIONS.get_status_active();
                        customAlert(`Notifications count ${notifications.length}: ` + notifications);
                        
                        // customAlert(`${NOTIFICATIONS.get_status_active()}`);
                
                        _lp_flag = confirm('Do you want to continue managing notifications ?');
                        break;

                    case 4:
                        /* View terminated notifications */
                        notifications = NOTIFICATIONS.get_status_terminated();
                        customAlert(`Notifications count ${notifications.length}: ` + notifications);
                
                        _lp_flag = confirm('Do you want to continue managing notifications ?');
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
                        notification = get_notification(NOTIF_ID, undefined);

                        if (NOTIF_ID) {
                            notification = get_notification(NOTIF_ID, undefined);
                        
                            if (notification[0] instanceof Notification) {
                                /* Confirm the deletion */
                                let delete_confirm = confirm('Do you want to delete the notification: ' + notification[0].toString());
                                if (delete_confirm) {
                                    /* Delete the notification by index */
                                    _delete_notification(notification[1], NOTIF_ID)
                                    break;
                                } else {
                                    // User canceled the deletion
                                    break;
                                }
                            }
                            customAlert(`Notification NOTIF_ID ${NOTIF_ID} not found`);
                            break;
                        }
                        break;
                    case 2:
                        /* Update notification status by JID */
                        JID = prompt('Enter the JID to delete - Ex: JID-99999')
                        notification = get_notification(undefined, JID);

                        if (JID) {
                            notification = get_notification(undefined, JID);
                            
                            if (notification[0] instanceof Notification) {
                                /* Confirm the deletion */
                                let delete_confirm = confirm('Do you want to delete the notification: ' + notification[0].toString());
                                if (delete_confirm) {
                                    /* Delete the notification by index */
                                    _delete_notification(notification[1], JID)
                                    break;
                                } else {
                                    // User canceled the deletion
                                    break;
                                }
                            }
                            customAlert(`Notification JID ${JID} not found`);
                            break;
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

                        if (NOTIF_ID) {
                            notification = get_notification(NOTIF_ID, undefined);
                            update = _update_status(notification[0], NOTIF_ID);
                            break;
                        }
                        // User canceled the deletion
                        break;
                    case 2:
                        /* Update notification status by JID */
                        JID = prompt('Enter the JID to update status - Ex: JID-99999')

                        if (JID) {
                            notification = get_notification(undefined, JID);
                            update = _update_status(notification[0], JID);
                            break;
                        }
                        // User canceled the deletion
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
    /* Show the menu by options to filter */
    action = menu_notifications_actions_by_options(menu_item);
    cslog('Menu filter selected option: ' + action);
    return action
}



/* Class representing a notification object */
class Notification {
    constructor(ID, JID, status, consumer) {
        this.ID = ID;
        this.JID = JID;
        this.status = status.toLowerCase();
        this.consumer = consumer;
    }

    toString() {
        return JSON.stringify(this);
    }

    get_status() {
        return this.status;
    }

    get_consumer() {
        return this.consumer;
    }

    get_JID() {
        return this.JID;
    }

    update_status(status) {
        cslog(`Updating to status ${status.toLowerCase()} for notification ID: ${this.ID} - JID:${this.JID}`);
        this.status = status.toLowerCase();;
    }
    
}

/* Class to manage notifications objects*/
class Notifications {
    constructor() {
        this.notifications = [];
    }

    add(notification) {
        return this.notifications.push(notification);
    }
    

    getByID(ID) {
        // Returns notification and index position
        const index = this.notifications.findIndex(notification => notification.ID === ID);
        if (index > -1) {
            return [this.notifications[index], index];
        } else {
            return false;
        }   
    }

    getByJID(JID) {
        // Returns notification and index position
        const index = this.notifications.findIndex(notification => notification.JID === JID);
        if (index > -1) {
            return [this.notifications[index], index];
        } else {
            return false;
        } 
    }

    deleteByID(ID) {
        const index = this.notifications.findIndex(notification => notification.ID === ID);
        if (index > -1) {
            cslog('Deleting notification by ID: ' + this.notifications[index].toString());
            this.notifications.splice(index, 1);
            cslog('Notification NOTIF_ID ' + NOTIF_ID + ' deleted');
            return true;
        }
        cslog(`Notification NOTIF_ID ${ID} not found`)   
        return false;
    }

    deleteByJID(JID) {
        const index = this.notifications.findIndex(notification => notification.JID === JID);
        if (index > -1) {
            cslog('Deleting notification by JID: ' + this.notifications[index].toString());
            this.notifications.splice(index, 1);
            cslog('Notification JID ' + JID + ' deleted');
            return true;
        }
        cslog(`Notification NOTIF_ID ${ID} not found`)
        return false;        
    }

    deleteByIdx(index) {
        if (index > -1) {
            cslog('Deleting notification by index: ' + this.notifications[index].toString());
            this.notifications.splice(index, 1);
            cslog('Notification index ' + index + ' deleted');
            return true;
        }
        return false;
    }

    list() {
        return this.notifications;
    }

    count() {
        return this.notifications.length;
    }


    get_status_active() {
        /*
         _NOTIF_STATUS_START = ["new", "queued", "scheduled"] + _NOTIF_STATUS_RUNNING = ["in-progress", "paused", "delayed"];
        */
       return this.notifications.filter(notification => _NOTIF_STATUS_START.concat(_NOTIF_STATUS_RUNNING).includes(notification.status))
    }

    get_status_terminated() {
        /* MAP terminated notifications
         _NOTIF_STATUS_FINAL = ["completed", "failed", "canceled"];)
        */
        return this.notifications.filter(notification => _NOTIF_STATUS_FINAL.includes(notification.status));
    }
}

/* Create a new instance of Notifications */
const NOTIFICATIONS = new Notifications();

/* Create sample NOTIFICATIONS if MOCK enabled */
if (MOCK_CONN) {
    cslog('MOCK MODE enabled');

    /* Array of mocked notifications */
   _NOTIFICATIONS = [
        { ID: "NOTIF_ID-0000000", JID: "JID-11111", status: "new", consumer: "192.168.1.1" },
        { ID: "NOTIF_ID-9999999", JID: "JID-99999", status: "new", consumer: "192.168.1.1" },
        { ID: gen_random_notification_id(), JID: gen_random_jid(), status: "new", consumer: "192.168.1.1" },
        { ID: gen_random_notification_id(), JID: gen_random_jid(), status: "in-progress", consumer: "192.168.1.2" },
        { ID: gen_random_notification_id(), JID: gen_random_jid(), status: "completed", consumer: "192.168.1.3" },
        { ID: gen_random_notification_id(), JID: gen_random_jid(), status: "failed", consumer: "192.168.1.4" },
        { ID: gen_random_notification_id(), JID: gen_random_jid(), status: "canceled", consumer: "192.168.1.4" }
    ];     

    for  (let _notification of _NOTIFICATIONS) {
        NOTIFICATIONS.add(new Notification(_notification.ID, _notification.JID, _notification.status, _notification.consumer));
    }
}

/* Show notifications */
cslog('Notifications: ' + JSON.stringify(NOTIFICATIONS.list()));

/* Show the menu */
show_menu();




