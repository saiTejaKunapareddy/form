// Function to handle form submission and API call
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
    if (!data["ticket-received-time"] || !data["campaign-start-date"]) {
        alert("Please fill in all required fields.");
        return;
    }

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
        } else {
            // Get the error response text for debugging
            const errorText = await response.text();
            console.error('API Error:', errorText); // Log the error text for debugging
            alert('Error submitting the ticket!');
        }
    } catch (error) {
        console.error('Error:', error); // Log the error to console
        alert('Something went wrong! Check the console for more details.');
    }
}

// Attach event listener when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', handleFormSubmission);
});
