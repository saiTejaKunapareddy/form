// Variable to store previously submitted data
let lastSubmittedData = null;

async function handleFormSubmission(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form data
    const formData = new FormData(event.target);

    // Convert form data to a plain object
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Validate if required fields are filled
    const requiredFields = [
        "parent_ticket_id", 
        "child_ticket_id", 
        "line_id", 
        "creatives", 
        "setup_type", 
        "day_partying", 
        "QA_ticket_id", 
        "ticket_status", 
        "campaign_start_date"
    ];

    for (const field of requiredFields) {
        if (!data[field]) {
            alert(`Please fill in the ${field.replace('_', ' ').toUpperCase()} field.`);
            return;
        }
    }

    // Check if the form data is the same as the last submitted data
    if (lastSubmittedData && JSON.stringify(lastSubmittedData) === JSON.stringify(data)) {
        alert('This ticket has already been submitted.');
        return;
    }

    // Disable the submit button to prevent double submissions
    const submitButton = document.getElementById('btn1');
    submitButton.disabled = true;

    // Correct API endpoint URL
    const apiUrl = "https://time-tracker-backend-5i9n.onrender.com/createTicket"; // Updated endpoint

    try {
        // Send the form data to the API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // Send data as JSON
        });

        // Handle the response
        if (response.ok) {
            const result = await response.json();
            alert('Ticket submitted successfully!');
            console.log(result); // Log the result for debugging

            // Store the submitted data to prevent duplicate submissions
            lastSubmittedData = data;
        } else {
            // Get the error response text for debugging
            const errorText = await response.text();
            console.error('API Error:', errorText); // Log the error text for debugging
            alert('Error submitting the ticket!');
        }
    } catch (error) {
        console.error('Error:', error); // Log the error to console
        alert('Something went wrong! Check the console for more details.');
    } finally {
        // Re-enable the submit button after processing
        submitButton.disabled = false;
    }
}

// Attach event listener when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', handleFormSubmission);
});
