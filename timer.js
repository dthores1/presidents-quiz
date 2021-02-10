/**
    Functions for game timers. 
    Requires a START_TIMER variable with the beginning timer value - this should be in "0:00" format.
    Also requires a timerElement, which is where the timer content will be placed in the DOM. 
**/

let interval; 

function handleTimer() {
    timerElement.textContent = START_TIMER;
    removeTimerStyles();

    interval = setInterval(() => {
        let currentVal = timerElement.textContent;
        let valueParts = currentVal.split(":");

        if(currentVal != "0:00") {
            let minute;
            let seconds;

            if(valueParts[1] == "00") {
                minute = parseInt(valueParts[0]) - 1;
                seconds = "59";
            } else {
                minute = valueParts[0];
                seconds = parseInt(valueParts[1]) -1 ;
            }

            // When under one minute remaining, apply pulsating styles
            if(minute == 0) {
                if(!timerElement.classList.contains("pulse")) {
                    timerElement.classList.add("pulse");
                    timerElement.classList.add("warning");
                }

                if(seconds <= 10 && !timerElement.classList.contains("critical")) {
                    timerElement.classList.add("critical");
                }
            }

            seconds = seconds < 10 ? "0" + seconds : seconds;

            timerElement.textContent = `${minute}:${seconds}`;
        } else {
            clearInterval(interval);
            endGame();
        }

    }, 1000);
}

// These styles are applied when the timer starts to run low. 
// This function removes those styles when the game is over or reset. 
function removeTimerStyles() {
    timerElement.classList.remove("pulse");
    timerElement.classList.remove("warning");
    timerElement.classList.remove("critical");    
}