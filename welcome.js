/* Welcome messages */

msg_1 = `
This is a notifications handler module that allows you to create, update, delete, and display notifications triggered by an external task management system.<br>
<li style="list-style-type:none;"><strong>Task Manager</strong>: <em><a href="https://amalaguti.github.io/saltmgmt">Salt Management</a></em></li>
`
msg_2 = `
The status are grouped in three <strong>categories</strong>:<br>
<ul>
    <li>START</li>
    <li>RUNNING</li>
    <li>FINAL</li>
</ul>
`;
msg_3 = `
Each category includes the following statuses:<br>
<ul>
    <li><strong>START</strong>
        <ul>
            <li>new</li>
            <li>queued</li>
            <li>scheduled</li>
        </ul>
    </li>
    <li><strong>RUNNING</strong>
        <ul>
            <li>in-progress</li>
            <li>paused</li>
            <li>delayed</li>
        </ul>
    </li>
    <li><strong>FINAL</strong>
        <ul>
            <li>completed</li>
            <li>failed</li>
            <li>canceled</li>
        </ul>
    </li>
</ul>
`
msg_4 = `
Status <em>transitions</em> are managed by defined <strong>transition rules</strong>:<br>
<ul>
    <li>A notification in <strong>"new"</strong> status can transition to <strong>"in-progress"</strong> or <strong>"completed"</strong>.</li>
    <li>A notification in <strong>"in-progress"</strong> status can transition to <strong>"paused"</strong> or <strong>"completed"</strong>.</li>
    <li>A notification in <strong>"completed"</strong> status cannot transition to any other status.</li>
</ul>
`;
msg_5 = `
Use the control panel buttons to change the status of a notification, add a new notification, or delete an existing one.<br>
To modify a notification, you must first select the notification from the corresponding notifications panel and then select the desired action from the control panel buttons.
`;

// Show Intro messages
Swal.fire({
    title: "Notifications module",
    html: `<div style="text-align: left;">${msg_1}</div>`,
    icon: "info",
    backdrop: false,
    confirmButtonText: `Continue ➡️`,
    didClose: () => {
        Swal.fire({
            title: "Categories",
            html: `<div style="text-align: left;">${msg_2}</div>`,
            footer: "I will close in <counter></counter> seconds.",
            timer: 10000,
            confirmButtonText: `OK ➡️`,
            didOpen: () => {
                Swal.showLoading(Swal.getConfirmButton());
                Swal.hideLoading();
                const timer = Swal.getPopup().querySelector("counter");
                timerInterval = setInterval(() => {
                    timer.textContent = `${Math.round(Swal.getTimerLeft() / 1000)}`;
                }, 1000);
            },
            willClose: () => {
                clearInterval(timerInterval);
            },
            didClose: () => {
                Swal.fire({
                    title: "Statuses",
                    html: `<div style="text-align: left;">${msg_3}</div>`,
                    footer: "I will close in <counter></counter> seconds.",
                    timer: 10000,
                    confirmButtonText: `OK ➡️`,
                    didOpen: () => {
                        Swal.showLoading(Swal.getConfirmButton());
                        Swal.hideLoading();
                        const timer = Swal.getPopup().querySelector("counter");
                        timerInterval = setInterval(() => {
                            timer.textContent = `${Math.round(Swal.getTimerLeft() / 1000)}`;
                        }, 1000);
                    },
                    willClose: () => {
                        clearInterval(timerInterval);
                    },
                    didClose: () => {
                        Swal.fire({
                            title: "Transitions",
                            html: `<div style="text-align: left;">${msg_4}</div>`,
                            footer: "I will close in <counter></counter> seconds.",
                            timer: 10000,
                            confirmButtonText: `OK ➡️`,
                            didOpen: () => {
                                Swal.showLoading(Swal.getConfirmButton());
                                Swal.hideLoading();
                                const timer = Swal.getPopup().querySelector("counter");
                                timerInterval = setInterval(() => {
                                    timer.textContent = `${Math.round(Swal.getTimerLeft() / 1000)}`;
                                }, 1000);
                            },
                            willClose: () => {
                                clearInterval(timerInterval);
                            },
                            didClose: () => {
                                Swal.fire({
                                    title: "Control Panel",
                                    html: `<div style="text-align: left;">${msg_5}</div>`,
                                    footer: "I will close in <counter></counter> seconds.",
                                    timer: 10000,
                                    confirmButtonText: `OK ➡️`,
                                    didOpen: () => {
                                        Swal.showLoading(Swal.getConfirmButton());
                                        Swal.hideLoading();
                                        const timer = Swal.getPopup().querySelector("counter");
                                        timerInterval = setInterval(() => {
                                            timer.textContent = `${Math.round(Swal.getTimerLeft() / 1000)}`;
                                        }, 1000);
                                    },
                                    willClose: () => {
                                        clearInterval(timerInterval);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});
