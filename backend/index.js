const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');
const client = require('prom-client');  // Import the Prometheus client

const app = express();
const port = 7000;  // Backend port

// Import the metrics module
const metrics = require('./metrics');

// Middleware
app.use(cors());  // Enable CORS
app.use(bodyParser.json());

// Path to user.txt
const dbPath = path.join(__dirname, 'db');  // Updated path
const filePath = path.join(dbPath, 'user.txt');

// Create db directory if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

// Function to get the current sequence number
function getCurrentSequenceNumber(callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return callback(1); // If error reading file, start at 1
    }
    // Count lines in the file to determine the current sequence number
    const lines = data.trim().split('\n').length;
    callback(lines + 1); // Increment to get the next sequence number
  });
}

// Function to write header if the file is new
function writeHeaderIfNeeded(callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err || data.trim() === '') {
      // If file doesn't exist or is empty, write the header
      fs.writeFile(filePath, 'Date, Name, Age\n', callback);
    } else {
      callback();
    }
  });
}

// Function to run the dataCleanup.sh script
function runDataCleanup() {
  exec('bash ./db/dataCleanup.sh', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error executing cleanup script: ${stderr}`);
      return;
    }
    console.log(`Cleanup script output:\n${stdout}`);
  });
}

// Function to run the convert2csv.sh script
function runConvert2Csv() {
  exec('bash ./db/convert2csv.sh', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error executing convert script: ${stderr}`);
      return;
    }
    console.log(`Convert script output:\n${stdout}`);
  });
}

// Function to run the convert2json.sh script
function runConvert2Json() {
  exec('bash ./db/convert2json.sh', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error executing convert script: ${stderr}`);
      return;
    }
    console.log(`Convert script output:\n${stdout}`);
  });
}

// POST route to receive name and age
app.post('/submit-name', (req, res) => {
  const { name, age } = req.body;

  // Check if name or age is missing
  if (!name || !age) {
    return res.status(400).send('Name and age are required');
  }

  // Get the current date
  const currentDate = new Date().toISOString().split('T')[0];  // Format as YYYY-MM-DD

  // Get the current sequence number
  getCurrentSequenceNumber((seq) => {
    // Write header if needed
    writeHeaderIfNeeded(() => {
      // Format the output as Date, Name, Age
      const formattedOutput = `${currentDate}, ${name}, ${age}\n`;  // Updated format

      // Append date, name, and age to user.txt
      fs.appendFile(filePath, formattedOutput, (err) => {
        if (err) {
          return res.status(500).send('Failed to save name, age, and date');
        }

        // Run the dataCleanup.sh script after successfully appending to user.txt
        runDataCleanup();
        runConvert2Csv();
        runConvert2Json();

        res.status(200).send('Name, age, and date saved successfully');
      });
    });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});

