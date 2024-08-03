const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
const port = 3333;
const logFilePath = path.join(__dirname, 'server.log');

// Access the "AppData" folder of the current user
const appDataFolder = process.env.APPDATA;
console.log('AppData folder:', appDataFolder);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/open-zoom', (req, res) => {
  // The path to the Zoom.exe application in the "AppData" folder
  const zoomExePath = path.join(appDataFolder, 'Zoom', 'bin', 'Zoom.exe');

  // Zoom meeting ID and password
  const zoomMeetingID = '89507492879';
  const zoomMeetingPwd = 'NVU5Rnlka3NORzgrOXd1RzAzZ2p2UT09';

  // Construct the full URL with meeting ID and password
  const zoomMeetingURL = `--url=zoommtg://zoom.us/join?action=join&confno=${zoomMeetingID}&pwd=${zoomMeetingPwd}`;

  // Construct the full command to open Zoom with the provided URL
  const command = `"${zoomExePath}" "${zoomMeetingURL}"`; // Add double quotes around the URL

  // Kill all existing Zoom processes
  const killProcess = spawn('taskkill', ['/F', '/IM', 'Zoom.exe']);

  killProcess.on('error', (err) => {
    console.error('Error occurred while killing existing Zoom processes:', err);
    fs.appendFile(logFilePath, `Error occurred while killing existing Zoom processes: ${err}\n`, (logErr) => {
      if (logErr) {
        console.error('Error occurred while writing to the log file:', logErr);
      }
    });
  });

  killProcess.on('close', (code) => {
    const killMessage = 'All existing Zoom processes killed.\n';
    console.log(killMessage);
    fs.appendFile(logFilePath, killMessage, (logErr) => {
      if (logErr) {
        console.error('Error occurred while writing to the log file:', logErr);
      }
    });

    // Wait for 1 second after killing Zoom before opening a new instance
    setTimeout(() => {
      // Execute the command to open Zoom
      const launchProcess = spawn(command, [], { shell: true });

      launchProcess.on('error', (err) => {
        console.error('Error occurred while trying to open Zoom:', err);
        fs.appendFile(logFilePath, `Error occurred while trying to open Zoom: ${err}\n`, (logErr) => {
          if (logErr) {
            console.error('Error occurred while writing to the log file:', logErr);
          }
        });
      });

      launchProcess.on('close', (code) => {
        if (code === 0) {
          const successMessage = 'Zoom.exe launched successfully.\n';
          console.log(successMessage);
          fs.appendFile(logFilePath, successMessage, (logErr) => {
            if (logErr) {
              console.error('Error occurred while writing to the log file:', logErr);
            }
          });
        } else {
          console.error('Failed to open Zoom. Exit code:', code);
          fs.appendFile(logFilePath, `Failed to open Zoom. Exit code: ${code}\n`, (logErr) => {
            if (logErr) {
              console.error('Error occurred while writing to the log file:', logErr);
            }
          });
        }
      });
    }, 1000); // 1-second delay
  });

  res.send(); // Empty response, no messages displayed on the page
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
