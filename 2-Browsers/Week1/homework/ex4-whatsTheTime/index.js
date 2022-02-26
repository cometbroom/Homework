'use strict';
/*------------------------------------------------------------------------------
Full description at: https://github.com/HackYourFuture/Homework/tree/main/2-Browsers/Week1#exercise-4-whats-the-time

1. Inside the `index.js`, complete the `addCurrentTime` to add the current time 
  to the webpage. Make sure it's written in the HH:MM:SS notation (hour, minute,
  second). Use `setInterval()` to make sure the time stays current.
2. Have the function execute when it's loading in the browser.
------------------------------------------------------------------------------*/
function updateTime(timeDisplay) {
  const timeNow = new Date();
  timeDisplay.textContent = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`;
}

function addCurrentTime() {
  const timeDisplay = document.createElement('h2');
  updateTime(timeDisplay);
  document.body.appendChild(timeDisplay);
  return timeDisplay;
}

document.addEventListener('DOMContentLoaded', () => {
  const timeDisplay = addCurrentTime();
  setInterval(() => {
    updateTime(timeDisplay);
  }, 1000);
});
