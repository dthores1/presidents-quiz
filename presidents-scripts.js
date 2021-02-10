let resultCells = [];
let presidents;

const gameArea = document.getElementById("gameArea");
const gameInput = document.getElementById("gameInput");
const giveUpBtn = document.getElementById("giveUpBtn");
const score = document.getElementById("score");

// Used in functions in timer.js
const timerElement = document.getElementById("timer");
const START_TIMER = "5:00"; 

const regex = /[!"#$%&'()*+,-./\s:;<=>?@[\]^_`{|}~]/g;

let foundpresidents = [];

document.addEventListener("mousemove", () => {
    console.log("mouse move");
})

function initData() {
    return fetch("data/data.json")
        .then(response => {
            return response.json();
        })
        .then(data => {
            presidents = data;
            startGame();
        });
}

initData();

function startGame() {
    foundpresidents = [];
    score.textContent = `${foundpresidents.length} / ${presidents.length}`;

    giveUpBtn.textContent = "Give up?";

    resetCells();

    gameArea.style.display = "flex";

    gameInput.addEventListener("keyup", validatePresident);
    giveUpBtn.addEventListener("click", endGame, {once: true});

    handleTimer();
}

function resetCells() {
    const resultColumns = document.querySelectorAll("#results .column");
    resultCells = [];

    let existingCells = document.getElementsByClassName("cell");
    while(existingCells[0]) {
        existingCells[0].parentNode.removeChild(existingCells[0]);
    }

    for(let i = 0; i < presidents.length; i++) {
        const presidentYear = document.createElement("div");
        presidentYear.classList = "cell year";
        presidentYear.textContent = `${presidents[i].took_office.substr(0, 4)} - ${(presidents[i].left_office == null) ? 'Present' : presidents[i].left_office.substr(0,4)}`;

        const presidentName = document.createElement("div");
        presidentName.classList = "cell president";

        const columnToUse = i < (presidents.length / 2) ? 0 : 1;
        resultColumns[columnToUse].appendChild(presidentYear);
        resultColumns[columnToUse].appendChild(presidentName);

        resultCells.push(presidentName);
    }

    resultCells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("correct");
        cell.classList.remove("not-found");
    })
}

function removePunctuation(string) {
    return string.replace(regex, '');
}

function validatePresident(e) {
    gameInput.classList.remove("input-error");

    // Strip punctuation and space from the input
    let value = removePunctuation(gameInput.value.toLowerCase());

    const matchedpresidents = presidents.filter(thisPresident => {
        return value === removePunctuation(thisPresident.president.toLowerCase()) 
                || value === removePunctuation(thisPresident.lastName?.toLowerCase())
                || value === removePunctuation(thisPresident.altName.toLowerCase());
    });

    if(matchedpresidents.length) {
        markAsFound(matchedpresidents);
    }

    // If no president was matched but the player pressed Enter, render the input in the error state
    if(!matchedpresidents.length && e.keyCode === 13) {
        gameInput.classList.add("input-error");
    }
}

function markAsFound(matchedpresidents) {
    // Loop here because in certain cases multiple presidents might match a name -- e.g., Harrison, Bush, Roosevelt
    matchedpresidents.forEach(president => {

        // Render the found president in the grid
        if(!foundpresidents.includes(president.number)) {
            resultCells[president.number - 1].textContent = president.president;
            foundpresidents.push(president.number);
            resultCells[president.number - 1].classList.add("correct");
            gameInput.value = "";
        
        // Display as error if they already found the president
        } else {
            gameInput.classList.add("input-error");
        }
    });

    // Update the score
    score.textContent = `${foundpresidents.length} / ${presidents.length}`;
}

// End-of game logic and cleanup
function endGame() {
    clearInterval(interval);

    // Display the presidents who were not found
    presidents.forEach(president => {
        if(!foundpresidents.includes(president.number)) {
            resultCells[president.number - 1].textContent = president.president;
            resultCells[president.number - 1].classList.add("not-found");
        }
    });

    // Change "Give up?" to "Try again?"
    giveUpBtn.textContent = "Try again?";

    // Add the event listener after a short delay to prevent double-clicks
    setTimeout(() => {
        giveUpBtn.addEventListener("click", startGame, {once: true});
    }, 500);
}