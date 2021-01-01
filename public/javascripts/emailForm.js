Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function handleCheckBoxChange(e) {
    let checkbox = e.target;
    if (checkbox.id === 'enableCC') {
        handleHiddenCheckBoxChange(checkbox, 'cc');
    } else if (checkbox.id === 'enableBCC') {
        handleHiddenCheckBoxChange(checkbox, 'bcc');
    } else if (checkbox.id === 'scheduleMail') {
        handleHiddenCheckBoxChange(checkbox, 'scheduledDate');
    }

}

function handleHiddenCheckBoxChange(checkbox, hiddenInputTextId) {
    const hiddenInputText = document.getElementById(hiddenInputTextId);
    if (checkbox.checked) {
        // Show the hidden fields.
        hiddenInputText.hidden = false;
    } else {
        hiddenInputText.hidden = true;
        hiddenInputText.value = "";
    }
}

function pageLoadEvent() {
    handleCheckBoxChange({ target: document.getElementById('enableCC') });
    handleCheckBoxChange({ target: document.getElementById('enableBCC') });
    handleCheckBoxChange({ target: document.getElementById('scheduleMail') });
    setScheduledMailTimeLimits();
}

function setScheduledMailTimeLimits() {
    const element = document.getElementById('scheduledDate');
    element.min = new Date().toISOString().slice(0,16)
    element.max = new Date().addDays(24).toISOString().slice(0,16)
}

async function submitForm() {
    const form = document.getElementById('mailform');
    let utcDateTime;
    if (document.getElementById('scheduleMail').checked && document.getElementById('scheduledDate').value) {
        if (utcDateTime = document.getElementById('scheduledTimeUTC')) {
            form.removeChild(utcDateTime);
        }
        utcDateTime = document.createElement('INPUT');
        utcDateTime.type = 'HIDDEN';
        utcDateTime.name = 'scheduledTimeUTC';
        utcDateTime.id = 'scheduledTimeUTC';
        utcDateTime.value = new Date(document.getElementById('scheduledDate').value).toISOString();

        form.appendChild(utcDateTime);
    }
    let response = await sendMail(form);
    let userMessage = response.message + "\nYour reference id is:" + response.requestId;
    if (response.messageId) {
        userMessage += "\nYour MessageId:" + response.messageId;
    }
    userMessage += "\nSend same email again?"
    if (!confirm(userMessage)) {
        document.getElementById('reset').click();
    };
}

async function sendMail(form) {
    try {
        const data = await fetch(form.action, {
            method: 'POST',
            // mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            accept: 'application/json',
            body: new URLSearchParams(new FormData(form))
        }).then((response) => {
            return response.json();
        });
        return data;
    } catch (e) {
        console.error('Error:' + e);
        return { result: 'Failed', requestId: req.headers['X-API-Request'], message: "Unable to connect to the server" };
    }
}