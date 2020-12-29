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
}

function submitForm() {
    const form = document.getElementById('mailform');
    if (document.getElementById('scheduleMail').checked && document.getElementById('scheduledDate').value) {
        const utcDateTime = document.createElement('INPUT');
        utcDateTime.type = 'HIDDEN';
        utcDateTime.name = 'scheduledTimeUTC';
        utcDateTime.value = new Date(document.getElementById('scheduledDate').value).toISOString();;
        form.appendChild(utcDateTime);
    }
    let response = sendMail(form);
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
        throw e;
    }
}