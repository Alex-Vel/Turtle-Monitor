function sendNotification (message){
    if(!("Notification" in window)){
        alert("Please switch to a browser that supports notifications");
    }
    else if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(function (permission) {
            if (permission === 'granted') {
                new Notification('Warning', {
                    body: message
                });
                }
            }
        );
    }
    else{
        new Notification('Warning', {
            body: message
        });
    }
}
export default sendNotification;