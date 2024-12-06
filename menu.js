function build_menu(menu_items = []) {
    /* Build the menu items string from the array of menu items*/
    let menu_items_msg = "";
    menu_items.forEach((element, index) => {
        menu_items_msg += `${index} - ${element}\n`
    });
    return menu_items_msg;

}

function _view_notification(notification, _ID) {
    /* View notification, used in menu cases logic to reduce code duplication */
    if (notification instanceof Notification) {
        cslog(`View notification ${_ID} outcome: ${notification.toString()}`);
        customAlert_console('Notification: ' + notification.toString());
    } else {
        customAlert_console(`Notification ${_ID} not found`);
    }
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
        'by status terminated',
        'by consumers',
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
                    customAlert_console('Notification created: ' + notification.toString());
                    cslog('Notification added at position: ' + (NOTIFICATIONS.add(notification)-1));
                    cslog('Notifications count: ' + NOTIFICATIONS.count());
                } else {
                    cslog('Notification NOT created');
                    customAlert_console('Notification NOT created');
                }
                _lp_flag = confirm('Do you want to continue managing notifications ?');
                break;
                

            // LIST NOTIFICATIONS
            case 2:
                /* List notifications */                
                cslog('Menu Option 2: ' + NOTIFICATIONS.list());
                cslog('Notifications count: ' + NOTIFICATIONS.count());
                customAlert_console(`Notifications count ${NOTIFICATIONS.count()}: ` + NOTIFICATIONS.list());
                
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
                        customAlert_console(`Notifications count ${notifications.length}: ` + notifications);
                
                        _lp_flag = confirm('Do you want to continue managing notifications ?');
                        break;

                    case 4:
                        /* View terminated notifications */
                        notifications = NOTIFICATIONS.get_status_terminated();
                        customAlert_console(`Notifications count ${notifications.length}: ` + notifications);
                
                        _lp_flag = confirm('Do you want to continue managing notifications ?');
                        break;

                    case 5:
                        /* View by consumers */
                        consumers = NOTIFICATIONS.get_consumers();
                        customAlert_console(`Consumers count ${consumers.length}: ` + JSON.stringify(consumers));
                
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
                            customAlert_console(`Notification NOTIF_ID ${NOTIF_ID} not found`);
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
                            customAlert_console(`Notification JID ${JID} not found`);
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
                            let new_status = prompt_for_new_status();
                            update = _update_status(notification[0], NOTIF_ID, new_status);
                            break;
                        }
                        // User canceled the deletion
                        break;
                    case 2:
                        /* Update notification status by JID */
                        JID = prompt('Enter the JID to update status - Ex: JID-99999')

                        if (JID) {
                            notification = get_notification(undefined, JID);
                            let new_status = prompt_for_new_status();
                            update = _update_status(notification[0], JID, new_status);
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

            case 6:
                /* Save active notifications to localStorage */
                notifications = NOTIFICATIONS.get_status_active();
                customAlert_console(`Save notifications count ${notifications.length}: ` + notifications);
                localStorage.setItem("notifications", JSON.stringify(notifications));        
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


/* Show the menu */
//show_menu();