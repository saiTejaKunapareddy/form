let lastSubmittedData = null;
let timerInterval;
let startTime = null;
let isTimerRunning = false;
let timeSpent = 0;
let isSubmitted = false;
var taskStartTime
function startTimer() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    startTime = Date.now() - timeSpent * 1000;
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

function stopTimer() {
    if (!isTimerRunning) return 0;
    isTimerRunning = false;
    clearInterval(timerInterval);
    timeSpent = Math.floor((Date.now() - startTime) / 1000);
    return timeSpent;
}

function resetTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
    startTime = null;
    timeSpent = 0;
    document.getElementById('timerDisplay').textContent = 'Time : 0h 0m 0s';
}

function updateTimerDisplay() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;
    document.getElementById('timerDisplay').textContent = `Time : ${hours}h ${minutes}m ${seconds}s`;
}

async function handleFormSubmission(event) {
    event.preventDefault();
    const submitButton = document.getElementById('btn1');
    submitButton.disabled = true;


    const formData = new FormData(event.target);
    let now = new Date()
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    data['start_time'] = taskStartTime;
    data['end_time'] = new Date();

    console.log("data", data)
    const requiredFields = [
        "parent_ticket_id",
        "child_ticket_id",
        "line_id",
        "creatives",
        "setup_type",
        "day_partying",
        "QA_ticket_id",
        "ticket_status",
        "campaign_start_date",
        "start_time",
        "end_time"
    ];

    for (const field of requiredFields) {
        if (!data[field]) {
            alert(`Please fill in the ${field.replace('_', ' ').toUpperCase()} field.`);
            return;
        }
    }

    const timeRecorded = stopTimer();



    const apiUrl = "https://time-tracker-backend-5i9n.onrender.com/createTicket";

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();

            lastSubmittedData = { ...data, time_spent: data.time_spent };
            isSubmitted = false;
            resetTimer();
            const form = document.querySelector('form');
            form.reset();
            lastSubmittedData = null;
            isSubmitted = false;
            document.getElementById('timerDisplay').textContent = 'Time : 0h 0m 0s';
            //  alert('Ticket submitted successfully!');
            const startButton = document.getElementById('btnStart');
            const inputs = document.querySelectorAll("input");
            const dropdown = document.getElementById("dropdown");
            const dropdown1 = document.getElementById("dropdown1");
            startButton.disabled = false
            inputs.forEach((input) => {
                input.disabled = true;
                dropdown.disabled = true
                dropdown1.disabled = true


            });
            showSuccessAlert()





        } else {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            alert('Error submitting the ticket!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong! Check the console for more details.');
    } finally {
        submitButton.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    closeSuccessAlert()
    const startButton = document.getElementById('btnStart');
    const inputs = document.querySelectorAll("input");
    const dropdown = document.getElementById("dropdown");
    const dropdown1 = document.getElementById("dropdown1");
    loader.style.display = "none"; // Hide the loader
    content.style.display = "block"; // Show the content
    let now = new Date()

    startButton.addEventListener('click', () => {
        if (!isTimerRunning) {
            startTimer();
            inputs.forEach((input) => {
                input.disabled = false;
                dropdown.disabled = false
                dropdown1.disabled = false


            });
            startButton.disabled = true;
            startButton.disabled = true
            taskStartTime = new Date();
            console.log("start time", startTime)

            //   enableButton.textContent = "Inputs Enabled";
        }
    });

    const resetButton = document.getElementById('btn2');
    resetButton.addEventListener('click', () => {
        resetTimer();
        const form = document.querySelector('form');
        form.reset();
        lastSubmittedData = null;
        isSubmitted = false;
        document.getElementById('timerDisplay').textContent = 'Time : 0h 0m 0s';
    });

    const form = document.querySelector('form');
    form.addEventListener('submit', handleFormSubmission);
});
function showSuccessAlert() {
    document.getElementById('customAlert').style.display = 'block';
}

function closeSuccessAlert() {
    document.getElementById('customAlert').style.display = 'none';
}
