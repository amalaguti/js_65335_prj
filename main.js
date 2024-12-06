function cslog(text) {
    console.log(">>>> " + text);
}

function customAlert(text) {
    // alert(">>>> " + text);
    Swal.fire({
        title: "Alert",
        text: text,
        icon: "warning",
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      });
}

function customAlert_console(text) {
    alert(">>>> " + text);
}



cslog('Main.js loaded');

