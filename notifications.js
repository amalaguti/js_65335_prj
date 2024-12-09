/* 
    Module to manage notifications
    This module will be used to create, view and delete notifications
    Notifications will be stored in an array
    Notifications will be displayed and managed in the notifications panel

    MOCK_CONN: If true, the connection to the server will be mocked  
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
    'Update notification status',
    'Save notifications'
]

// by NOTIF_ID - Ex: NOTIF_ID-0000000', 
// by JID_ID - Ex: JID-99999',

async function get_ip() {
    // Fetch the IP address from the API
    const url = "https://ipinfo.io/json"  /* API TO GET CLIENT INFO */
    try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: response.status}`);
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
    notification = new Notification(gen_random_notification_id(),JID,"new",client_ip, dt_now_str());
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

function prompt_for_new_status() {
    /* Prompt for the new status */
    let new_status = prompt('Enter the new status:\n' + NOTIF_STATUS.join('\n'));

    return new_status.toLowerCase();
}

function update_notification_status(notification, new_status) {
    /* Update the status of a notification running validation rules check first */
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

function _update_status(notification, id, new_status) {
    /* Update the status of a notification, used in menu cases logic to reduce code duplication */
    if (notification instanceof Notification) {
        update = update_notification_status(notification, new_status);
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




/* Class representing a notification object */
class Notification {
    constructor(ID, JID, status, consumer, dateTime) {
        this.ID = ID;
        this.JID = JID;
        this.status = status.toLowerCase();
        this.consumer = consumer;
        this.creation = dateTime;
        this.last_update = dateTime;
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
        this.status = status.toLowerCase();
        this.last_update = dt_now_str();
    }


    get_aging(unit='seconds', check_last_update=false) {
        /* Return the aging of the notification since creation or since last_update */
        if (check_last_update) {
            return dt_age(this.last_update, dt_now_str(), unit);
        }
        return dt_age(this.creation, dt_now_str(), unit);
    }
    
}


/* Class to manage notifications objects*/
class Notifications {
    constructor() {
        this.notifications = [];
    }

    add(notification) {
        // Save data to sessionStorage
        let notifications = JSON.parse(sessionStorage.getItem("notifications")) || {};
        sessionStorage.setItem("notifications", JSON.stringify(notifications));
        cslog('Notification added to session storage');
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
            cslog('Notification NOTIF_ID ' + ID + ' deleted');
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

    get_status_start() {
        /*
         _NOTIF_STATUS_START = ["new", "queued", "scheduled"]
        */
       return this.notifications.filter(notification => _NOTIF_STATUS_START.includes(notification.status))
    }

    get_status_running() {
        /*
         _NOTIF_STATUS_RUNNING = ["in-progress", "paused", "delayed"];
        */
       return this.notifications.filter(notification => _NOTIF_STATUS_RUNNING.includes(notification.status))
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

    get_consumers() {
        /* Get the consumers and the count of notifications per consumer 
            returns array of consumers (not notifications instances) sorted by count
            of notifications per consumer 
        */
        const consumerCount = this.notifications.reduce((acc, notification) => {
            acc[notification.consumer] = (acc[notification.consumer] || 0) + 1;
            return acc;
        }, {});

        return Object.keys(consumerCount)
            .map((consumer) => ({
            consumer: consumer,
            count: consumerCount[consumer]
            }))
            .sort((a, b) => b.count - a.count);
    }

    get_aged_notifications(unit='seconds', check_last_update=false, age_limit=10, include_final=true, expire_max_last_update=30) {
        /* Get the aged notifications since creation or since last_update(check_last_update bool) */
        /* use check_last_update to get the aging since last_update instead of since creation */
        /* expire_max_last_update is the max age of a notification since last_update to be considered expired */
        
        const notifications = this.notifications.filter(notification => notification.get_aging(unit, check_last_update) > age_limit);
        // Iclude all notifications, including those finalized
        if (include_final) {
            //return notifications
            return notifications.filter(notification => dt_age(notification.last_update, dt_now_str(), unit = unit) > expire_max_last_update);
        }

        // Exclude finalized notifications
        return notifications.filter(notification => !_NOTIF_STATUS_FINAL.includes(notification.status));
    }
}

/* Create a new instance of Notifications */
const NOTIFICATIONS = new Notifications();

/* Create sample NOTIFICATIONS if MOCK enabled */
if (MOCK_CONN) {
    cslog('MOCK MODE enabled');

    /* Array of mocked notifications */
   _NOTIFICATIONS = [
        { ID: "NOTIF_ID-0000000", JID: "JID-11111", status: "new", consumer: "192.168.1.1", dateTime: dt_now_str() },
        { ID: "NOTIF_ID-9999999", JID: "JID-99999", status: "new", consumer: "192.168.1.1", dateTime: dt_now_str() },
        { ID: gen_random_notification_id(), JID: gen_random_jid(), status: "new", consumer: "192.168.1.1", dateTime: dt_now_str() },
        { ID: gen_random_notification_id(), JID: gen_random_jid(), status: "queued", consumer: "192.168.1.1", dateTime: dt_now_str() },
        { ID: gen_random_notification_id(), JID: gen_random_jid(), status: "scheduled", consumer: "192.168.1.1", dateTime: dt_now_str() },
        { ID: gen_random_notification_id(), JID: gen_random_jid(), status: "uncategorized", consumer: "192.168.1.1", dateTime: dt_now_str() },
        { ID: gen_random_notification_id(), JID: gen_random_jid(), status: "in-progress", consumer: "192.168.1.2", dateTime: dt_now_str() },
        { ID: gen_random_notification_id(), JID: gen_random_jid(), status: "paused", consumer: "192.168.1.2", dateTime: dt_now_str() },
        { ID: gen_random_notification_id(), JID: gen_random_jid(), status: "delayed", consumer: "192.168.1.2", dateTime: dt_now_str() },
        { ID: gen_random_notification_id(), JID: gen_random_jid(), status: "completed", consumer: "192.168.1.3", dateTime: dt_now_str() },
        { ID: gen_random_notification_id(), JID: gen_random_jid(), status: "failed", consumer: "192.168.1.4", dateTime: dt_now_str() },
        { ID: gen_random_notification_id(), JID: gen_random_jid(), status: "canceled", consumer: "192.168.1.4", dateTime: dt_now_str() },
    ];     

    for  (let _notification of _NOTIFICATIONS) {
        NOTIFICATIONS.add(new Notification(_notification.ID, _notification.JID, _notification.status, _notification.consumer, _notification.dateTime));
    }
}

/* Show notifications */
//cslog('Notifications: ' + JSON.stringify(NOTIFICATIONS.list()));





