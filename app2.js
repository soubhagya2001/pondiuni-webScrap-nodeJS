//with date and sorting
// with date

// Import necessary modules
const express = require('express');
const request = require('request-promise');
const cheerio = require('cheerio');

// Create an Express app
const app = express();
const port = 3000; // You can change the port as needed

// Define a global array to store the results
let notices = [];

// Function to fetch and process the data
async function fetchData() {
  try {
    // Make a request to the specified URL
    const html = await request('https://www.pondiuni.edu.in/all-notifications/#Events');

    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    // Find all elements that match the specified selector
    const noticeElements = $('div[data-id="e6e0ef4"] .elementor-heading-title.elementor-size-default a');

    // Loop through each element and extract URL, heading, and date
    noticeElements.each((index, element) => {
      const url = $(element).attr('href'); // Extract URL
      const heading = $(element).text();    // Extract heading
      const date = $(element).closest('.elementor-row').find('.d1').text().trim(); // Extract date

      // Add the data to the array
      notices.push({ heading, url, date });
    });
  } catch (error) {
    console.error('An error occurred while fetching and parsing the data:', error);
  }
}

// Fetch and process the data
fetchData().then(() => {
  // Define the route for /notice
  app.get('/notice', (req, res) => {
    // Sort the notices array based on date before sending the data
    notices.sort((a, b) => new Date(b.date) - new Date(a.date));
    // Return the sorted result as a JSON array
    res.json(notices);
  });

  // Define routes for different categories
  app.get('/circular', getSectionHandler(0, 10));
  app.get('/news', getSectionHandler(10, 10));
  app.get('/phd', getSectionHandler(20, 10));
  app.get('/events', getSectionHandler(30, 10));
  app.get('/admissions', getSectionHandler(40, 10));
  app.get('/careers', getSectionHandler(50, 10));
  app.get('/tenders', getSectionHandler(60, 10));

  // Function to handle different sections of the array
  function getSectionHandler(startIndex, count) {
    return (req, res) => {
      const section = notices.slice(startIndex, startIndex + count);
      res.json(section);
    };
  }

  // Start the Express server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
