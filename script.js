// Define your groups of words with categories
const groups = [
    { name: "Innate abilities", words: ["Invoke", "Mischief", "Nature's Guise", "Minefield Sign"] },
    { name: "Directly linked to another ability", words: ["Bedlam", "Call of the Wild Boar", "Illusory Orb", "Tree Dance"] },
    { name: "Ability with charges", words: ["Shrapnel", "Scurry", "Spirit Siphon", "Proximity Mines"] },
    { name: "Abilities with sub-abilities", words: ["Snowball", "Tree Grab", "Icarus Dive", "Nightmare"] }
];

// Combine all words into a single array and shuffle
const allWords = groups.flatMap(group => group.words);
shuffle(allWords);

// Dynamically create the grid
const grid = document.querySelector('.grid');
allWords.forEach(word => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.textContent = word;
    grid.appendChild(cell);
});

let selectedWords = [];
let matchesFound = 0;
let incorrectGuesses = 0;
const maxIncorrectGuesses = 4;

// Add event listeners to cells
document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', function() {
        if (selectedWords.includes(this.textContent)) {
            this.classList.remove('selected');
            selectedWords = selectedWords.filter(word => word !== this.textContent);
        } else if (selectedWords.length < 4) {
            this.classList.add('selected');
            selectedWords.push(this.textContent);
        }
    });
});

// Function to check if selected words form a valid group
function isAValidGroup(selectedWords) {
    return groups.some(group => 
        selectedWords.every(word => group.words.includes(word)) &&
        group.words.every(word => selectedWords.includes(word))
    );
}

// Function to handle the submission of selected words
function submitSelection() {
    const messageElement = document.querySelector('.message');
    const guessesElement = document.getElementById('guesses-remaining');

    // Prevent further actions if the game is already over
    if (incorrectGuesses >= maxIncorrectGuesses) {
        messageElement.textContent = 'Game over! No more guesses remaining.';
        messageElement.style.color = 'red';
        return; // Exit the function to prevent further execution
    }

    if (selectedWords.length === 4) {
        let isMatchFound = false;
        let matchedGroupIndex = null;

        // Check if the selected words match any of the groups
        for (let i = 0; i < groups.length; i++) {
            if (selectedWords.every(word => groups[i].words.includes(word)) && groups[i].words.every(word => selectedWords.includes(word))) {
                isMatchFound = true;
                matchedGroupIndex = i;
                break; // Exit loop once a match is found
            }
        }

        if (isMatchFound) {
            // Handle correct selection
            moveWordsToMatchedRow(groups[matchedGroupIndex].name);
            matchesFound++;
            messageElement.textContent = `Correct! ${groups[matchedGroupIndex].name} found.`;
            messageElement.style.color = 'green';

            // Check if the game is won
            if (matchesFound === groups.length) {
                messageElement.textContent = 'Congratulations! You found all matches!';
                disableGame(); // Disable further actions as the game is won
            }
        } else {
            // Handle incorrect selection
            incorrectGuesses++;
            guessesElement.textContent = `Guesses Remaining: ${maxIncorrectGuesses - incorrectGuesses}`;
            messageElement.textContent = 'No match! Try again.';
            messageElement.style.color = 'red';

            // Check if the game is over
            if (incorrectGuesses >= maxIncorrectGuesses) {
                messageElement.textContent = 'Game over! You reached the maximum number of incorrect guesses.';
                disableGame(); // Disable further actions as the game is over
            }
        }

        // Reset selections for the next attempt
        selectedWords = [];
        document.querySelectorAll('.selected').forEach(cell => cell.classList.remove('selected'));
    } else {
        messageElement.textContent = 'Please select exactly 4 words.';
        messageElement.style.color = 'red';
    }
}


function moveWordsToMatchedRow(categoryName) {
    const matchedRowId = `matched-row-${matchesFound + 1}`;
    const matchedRow = document.getElementById(matchedRowId);
    const categoryNameElement = document.getElementById(`category-name-${matchesFound + 1}`);
    categoryNameElement.textContent = categoryName;

    selectedWords.forEach(word => {
        const cell = Array.from(document.querySelectorAll('.cell')).find(cell => cell.textContent === word && !cell.classList.contains('hidden'));
        cell.classList.add('hidden');
        const newCell = document.createElement('div');
        newCell.textContent = word;
        newCell.classList.add('matched-cell', `matched-cell-${matchesFound + 1}`);
        matchedRow.appendChild(newCell);
    });
}

// Correctly disable game interactions
function disableGame() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.removeEventListener('click', handleCellClick); // Assuming handleCellClick is your event handler
    });
    document.querySelector('button').disabled = true;
}

// Ensure shuffle function and other parts remain unchanged


// Shuffle function
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Disable game interactions
function disableGame() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('selected');
        // Assuming direct attachment, replace with your actual event handler if named differently
        cell.removeEventListener('click', handleCellClick); // Adjust as per your actual event listener
    });
    // Hide the submit button
    document.querySelector('button').style.display = 'none';
    // Alternatively, to remove it completely: document.querySelector('button').remove();
}
