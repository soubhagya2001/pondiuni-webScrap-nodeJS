// Import necessary modules
const express = require('express');
const request = require('request-promise');
const cheerio = require('cheerio');

// Create an Express app
const app = express();
const port = 3000; // You can change the port as needed

// Define the route for /notice
app.get('/notice', async (req, res) => {
  try {
    // Make a request to the specified URL
    const html = await request('https://www.pondiuni.edu.in/all-notifications/#Events');

    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    // Find all elements that match the specified selector
    const noticeElements = $('div[data-id="e6e0ef4"] .elementor-heading-title.elementor-size-default a');

    // Create an array to store the results
    const notices = [];

    // Loop through each element and extract URL and heading
    noticeElements.each((index, element) => {
      const url = $(element).attr('href'); // Extract URL
      const heading = $(element).text();    // Extract heading

      // Add the data to the array
      notices.push({ heading, url });
    });

    // Return the result as JSON array
    res.json(notices);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: 'An error occurred while fetching and parsing the data.' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
