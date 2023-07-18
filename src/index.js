import * as ingredients from "./ingredients.js";
import * as sounds from "./sounds.js";

// Music and sound effect toggles
let musicOn = true;
let sfxOn = true;

const timeLimit = 120; // Total number of seconds the game lasts for
let money = 0; // Money the player has made so far
let currentTea = {flavor: "", topping: "", temperature: ""}; // Tea that the player has built so far
let timeLeft = timeLimit; // Amount of seconds left on the game timer, in seconds
let timer; // The actual timer "object"
let trashed = false; // Tracks if you hit trash during this round
let teaCount = 0;// The number of teas that the customer has made since they started playing
let perfectCount = 0; // The number of perfect teas that the customer has made since they started playing

// Call the main line of execution only when the DOM has completely loaded
document.addEventListener('DOMContentLoaded', main);

function main() {
    // When the game opens, attempt to play the music every 500 ms
    // This is deal with Google Chrome's requirement to not allow sounds to play without first interacting with the page
    // Idea is from this Stack Overflow post: https://stackoverflow.com/questions/52163817/is-there-an-event-to-detect-when-user-interacted-with-a-page
    sounds.bgMusic.autoplay=true;
    const tryToPlay = setInterval(async() => {
        try {
            await sounds.bgMusic.play();
            // Achieved gapless looping audio using Roko C. Buljan's code from here: https://stackoverflow.com/questions/7330023/gapless-looping-audio-html5
            sounds.bgMusic.addEventListener('timeupdate', function() {
                var buffer = 0.1;
                if (this.currentTime > this.duration - buffer) {
                    this.currentTime = 0;
                    this.play();
                }
            });
            clearInterval(tryToPlay);
        } catch (err) { }
    }, 500);
    gameStartMenu();
}

// Show the game start menu screen
function gameStartMenu() {
    // Show game start menu screen
    const gameStartEle = document.getElementById("gameStart");
    gameStartEle.classList.remove("invisible");
    // Activate play button
    const playBtn = document.getElementById("playBtn");
    playBtn.onclick = () => {
        sounds.sfx["bell"].play();
        // Hide start menu screen
        gameStartEle.classList.add("invisible");
        // Show game screen
        const gameEle = document.getElementById("game");
        gameEle.classList.remove("invisible");
        // Start the game loop
        gameLoop();
    }
    // Activate "how to play" button
    const tutorialBtn = document.getElementById("tutorialBtn");
    tutorialBtn.onclick = () => {
        sounds.sfx["button"].play();
        // Hide start menu screen
        gameStartEle.classList.add("invisible");
        tutorial();
    }
    // Activate credits button
    const creditsBtn = document.getElementById("creditsBtn");
    creditsBtn.onclick = () => {
        sounds.sfx["button"].play();
        // Hide start menu screen
        gameStartEle.classList.add("invisible");
        credits();
    }
    // Activate music button
    const musicBtn = document.getElementById("musicBtn");
    musicBtn.onclick = () => {
        sounds.sfx["button"].play();
        // Toggle music
        toggleMusic();
    }
    // Activate sound button
    const soundBtn = document.getElementById("soundBtn");
    soundBtn.onclick = () => {
        sounds.sfx["button"].play();
        // Toggle sound effects
        toggleSfx();
    }
}

// Toggle music
function toggleMusic() {
    const musicBtn = document.getElementById("musicBtn");
    if (musicOn) {
        // Mute music
        musicOn = false;
        musicBtn.src = "./img/noMusic.png";
        sounds.bgMusic.muted = true;
    } else {
        // Unmute music
        musicOn = true;
        musicBtn.src = "./img/music.png";
        sounds.bgMusic.muted = false;
    }
}

// Toggle sound effects
function toggleSfx() {
    const soundBtn = document.getElementById("soundBtn");
    if (sfxOn) {
        // Mute all sfx
        sfxOn = false;
        soundBtn.src = "./img/noSound.png";
        for (const sfxName in sounds.sfx) {
            sounds.sfx[sfxName].muted = true;
        }
    } else {
        // Unmute all sfx
        sfxOn = true;
        soundBtn.src = "./img/sound.png";
        for (const sfxName in sounds.sfx) {
            sounds.sfx[sfxName].muted = false;
        }
    }
}

// Show the "how to play" screen
function tutorial() {
    // Show "how to play" screen
    const tutorialEle = document.getElementById("tutorial");
    tutorialEle.classList.remove("invisible");
    // Activate back to menu button
    const backBtn = document.getElementById("backBtn1");
    backBtn.onclick = () => {
        // Hide "how to play" screen
        tutorialEle.classList.add("invisible");
        sounds.sfx["button"].play();
        gameStartMenu();
    }
}

// Show the credits screen
function credits() {
    // Show credits screen
    const creditsEle = document.getElementById("credits");
    creditsEle.classList.remove("invisible");
    // Activate back to menu button
    const backBtn = document.getElementById("backBtn2");
    backBtn.onclick = () => {
        // Hide credits screen
        creditsEle.classList.add("invisible");
        sounds.sfx["button"].play();
        gameStartMenu();
    }
}

// Get rid of the game to show the game over screen (once the timer runs out)
function gameOver() {
    sounds.sfx["end"].play();
    // Deactivate buttons and stop timer
    deactivateAllButtons();
    clearInterval(timer);
    // Hide game screen
    const gameEle = document.getElementById("game");
    gameEle.classList.add("invisible");
    // Show game over screen
    const gameOverEle = document.getElementById("gameOver");
    gameOverEle.classList.remove("invisible");
    // Set text on game over screen
    const textEle = document.getElementById("gameOverText");
    textEle.innerHTML = "Money earned: $" + money + "<br>Total drinks served: " + teaCount + "<br>Perfect drinks: " + perfectCount;
    // Activate restart button
    const restartBtn = document.getElementById("restartBtn");
    restartBtn.onclick = () => {
        sounds.sfx["button"].play();
        restartGame();
    }
    // Activate back to menu button
    const backBtn = document.getElementById("backBtn3");
    backBtn.onclick = () => {
        // Hide game over screen
        gameOverEle.classList.add("invisible");
        sounds.sfx["button"].play();
        resetGame();
        gameStartMenu();
    }
}

// Restart the game (after pressing on the "play again" button)
function restartGame() {
    // Deactivate restart button
    document.getElementById("restartBtn").onclick = null;
    // Hide game over screen
    const gameOverEle = document.getElementById("gameOver");
    gameOverEle.classList.add("invisible");
    // Show game screen
    const gameEle = document.getElementById("game");
    gameEle.classList.remove("invisible");
    resetGame();
    gameLoop();
}

// Reset all game variables in preparation to start a new round
function resetGame() {
    // Start over by resetting the timer and global variables, then running the main function
    timeLeft = timeLimit;
    money = 0;
    currentTea = {flavor: "", topping: "", temperature: ""};
    trashed = false;
    teaCount = 0;
    perfectCount = 0;
}

async function gameLoop() {
    updateTimerText(timeLimit);
    updateMoneyCounter(money);
    timer = setInterval(tick, 1000);
    initialTransition();
    while (timeLeft > 0) {
        trashed = false;
        const order = generateOrder();
        setupButtons(order);
        activateIngredientButtons();
        displayOrder(order);
        await doneBtnClicked();
        await transition();
    }
    gameOver();
}

// Count down one second
function tick() {
    timeLeft--;
    updateTimerText(timeLeft);
    if (timeLeft <= 0) {
        gameOver();
    }
}

// Update the text of the on-screen timer element
function updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = ("0" + time % 60).slice(-2);
    document.getElementById("timer").innerHTML = "Remaining Time: " + minutes + ":" + seconds;
}

// Generates a random order consisting of a flavor, a topping, and a temperature
function generateOrder() {
    const randFlav = ingredients.flavors[rand(0,8)];
    const randTop = ingredients.toppings[rand(0,8)];
    const randTemp = ingredients.temperatures[rand(0,3)];
    return {
        flavor: randFlav,
        topping: randTop,
        temperature: randTemp,
    }
}

// Generates a random integer between the lower (inclusive) and upper bound (exclusive), excluding the given single number to exclude
function rand(lower, upper, exclude) {
    let number = Math.floor(Math.random() * upper) + lower;
    if (exclude) {
        while (number === exclude) {
            number = Math.floor(Math.random() * upper) + lower;
        }
    }
    return number;
}

// Set up onclick functions for done and trash buttons
function setupButtons(order) {
    const doneBtn = document.getElementById("doneBtn");
    doneBtn.onclick = () => {
        submitOrder(currentTea, order);
        // Disable the done button
        doneBtn.disabled = true;
    }
    const trashBtn = document.getElementById("trashBtn");
    trashBtn.onclick = () => {
        sounds.sfx["trash"].play();
        trashed = true;
        clearCup();
        activateIngredientButtons();
    }
}

// Wait for 1 second, then clear the cup (used to wait for transition)
function clearCupAfter1s() {
    return new Promise((resolve) => {
        setTimeout(() => {
            clearCup();
            resolve();
        }, 1000);
    });
}

// Clear the cup (remove tea, toppings, and temperature)
function clearCup() {
    const tea = document.getElementById("tea");
    tea.src = "";
    tea.alt = "";
    Array.from(document.getElementsByClassName("topping")).forEach((topping) => {
        topping.src = "";
        topping.alt = "";
    });
    const temp = document.getElementById("temperature");
    temp.src = "";
    temp.alt = "";
    currentTea = {flavor: "", topping: "", temperature: ""};
}

// Checks if the tea that the player made matches the ordered tea, then adds to player's money based on that
function submitOrder(playerTea, orderTea) {
    // Add to tea count
    teaCount++;
    // Go through each of the keys in playerTea and count how many values match orderTea.
    const correct = Object.keys(playerTea).reduce((accum, curr) => {
        return playerTea[curr].name === orderTea[curr].name ? accum + 1 : accum;
    }, 0);
    if (correct === 3) { // 3 correct, give $3
        if (trashed === false) { // If player gets 3 correct and didn't hit trash this round, show perfect and add to perfect count
            sounds.sfx["perfect"].play();
            displayPerfect();
            perfectCount++;
        }
        displayPrice(3);
        changeCustomerImage("happy");
        money += 3;
        updateMoneyCounter(money);
    } else if (correct === 2) { // 2 correct = give $2
        sounds.sfx["swoosh"].play();
        displayPrice(2);
        money += 2;
        updateMoneyCounter(money);
    } else if (correct === 1) { // 1 correct = give $1
        sounds.sfx["swoosh"].play();
        displayPrice(1);
        changeCustomerImage("angry");
        money += 1;
        updateMoneyCounter(money);
    } else { // 0 correct = give $0
        sounds.sfx["fail"].play();
        changeCustomerImage("angry");
        displayPrice(0);
    }
}

// Show the "perfect" text if the tea was made correctly
function displayPerfect() {
    const ele = document.getElementById("perfect");
    ele.src = "./img/perfect.png";
    ele.alt = "perfect";
    ele.classList.remove("perfect-animation");
    // Animation replay trick - code citation: https://css-tricks.com/restart-css-animation/
    ele.offsetWidth;
    ele.classList.add("perfect-animation");
    setTimeout(hidePerfect, 600);
}

// Show the price text, with how much money you made from this tea
function displayPrice(amount) {
    const ele = document.getElementById("priceText");
    ele.innerHTML = "+ $" + amount;
    ele.classList.remove("perfect-animation");
    ele.offsetWidth;
    ele.classList.add("perfect-animation");
    setTimeout(hidePrice, 600);
}

// Change the customer's image to either their "happy" expression (when you make their tea perfectly) or "angry" version (when you make their tea badly)
function changeCustomerImage(expression) {
    const ele = document.getElementById("customer");
    const customer = ingredients.customers.find(cust => cust.name === ele.alt);
    ele.src = customer[expression];
}

// Remove the "perfect" text
function hidePerfect() {
    const ele = document.getElementById("perfect");
    ele.src = "";
    ele.alt = "";
}

// Remove the "price" text
function hidePrice() {
    const ele = document.getElementById("priceText");
    ele.innerHTML = "";
}

// Updates the money counter in the DOM to display the given value
function updateMoneyCounter(value) {
    document.getElementById("moneyCounter").innerHTML = "$" + value;
}

// Makes all icons in the ingredient panel of the game clickable
function activateIngredientButtons() {
    ingredients.flavors.forEach((flavor) => {
        const btn = document.getElementById(flavor.iconId);
        btn.onclick = () => {
            sounds.sfx["tea"].play();
            fillTea(flavor);
        };
    });
    ingredients.toppings.forEach((topping) => {
        const btn = document.getElementById(topping.iconId);
        btn.onclick = () => {
            sounds.sfx["topping"].play();
            addTopping(topping);
        };
    });
    ingredients.temperatures.forEach((temp) => {
        const btn = document.getElementById(temp.iconId);
        btn.onclick = () => {
            sounds.sfx["temperature"].play();
            addTemperature(temp);
        };
    });
}

// Fills the cup with the given tea flavor and deactivates flavor buttons
function fillTea(flavor) {
    const ele = document.getElementById("tea");
    ele.src = flavor.img;
    ele.alt = flavor.name;
    currentTea.flavor = flavor;
    deactivateButtons(ingredients.flavors);
}

// Adds the given topping to the cup and deactivates topping buttons
function addTopping(topping) {
    let elementId = "";
    if (topping.name === "peach jelly" || topping.name === "grass jelly" || topping.name === "coffee jelly") {
        elementId = "jelly";
    } else if (topping.name === "red bean") {
        elementId = "redBean";
    } else if (topping.name === "whipped cream") {
        elementId = "whippedCream";
    } else {
        elementId = "boba";
    }
    const ele = document.getElementById(elementId);
    ele.src = topping.img;
    ele.alt = topping.name;
    currentTea.topping = topping;
    deactivateButtons(ingredients.toppings);
}

// Adds the given temperature to the cup and deactivates temperature buttons
function addTemperature(temp) {
    const ele = document.getElementById("temperature");
    if (temp.name === "cold" || temp.name === "hot") {
        ele.src = temp.img;
        ele.alt = temp.name;
    }
    currentTea.temperature = temp;
    deactivateButtons(ingredients.temperatures);
}

// Removes onclick functions of all icons of the given array
function deactivateButtons(elements) {
    elements.forEach((element) => {
        document.getElementById(element.iconId).onclick = null;
    });
}

// Removes onclick functions of all icons
function deactivateAllButtons() {
    deactivateButtons(ingredients.toppings);
    deactivateButtons(ingredients.flavors);
    deactivateButtons(ingredients.temperatures);
}

// Displays the given order in the order panel of the game
function displayOrder(order) {
    const flavorOrder = document.getElementById("flavorOrder");
    flavorOrder.src = order.flavor.icon;
    flavorOrder.alt = order.flavor.name + " icon";
    const toppingOrder = document.getElementById("toppingOrder");
    toppingOrder.src = order.topping.icon;
    toppingOrder.alt = order.topping.name + " icon";
    const tempOrder = document.getElementById("tempOrder");
    tempOrder.src = order.temperature.icon;
    tempOrder.alt = order.temperature.name + " icon";
}

// Wait for the done button to be clicked - before moving onto the next game round
function doneBtnClicked() {
    // Code idea citation: https://stackoverflow.com/questions/54916739/wait-for-click-event-inside-a-for-loop-similar-to-prompt
    return new Promise((resolve) => {
        const doneBtn = document.getElementById("doneBtn");
        function handleClick() {
            doneBtn.removeEventListener('click', handleClick);
            resolve();
        }
        doneBtn.addEventListener('click', handleClick);
    });
}

// Animation of cup and customer when the game first starts (no slide out)
function initialTransition() {
    // Cup in
    const cupEle = document.getElementById("cupOfTea");
    cupEle.offsetWidth;
    cupEle.classList.add("enter-left");
    // Select a random customer and customer in
    getRandomCustomer();
    const custEle = document.getElementById("customer");
    custEle.classList.add("enter-right");
}

// Runs both the cup and customer transition concurrently
async function transition() {
    cupTransition();
    await customerTransition();
    // Reenable the done button
    doneBtn.disabled = false;
}

// Transition cup (between rounds)
async function cupTransition() {
    // Old cup exit animation
    const ele = document.getElementById("cupOfTea");
    ele.classList.remove("enter-left");
    ele.classList.remove("exit-left");
    ele.offsetWidth;
    ele.classList.add("exit-left");

    await clearCupAfter1s();
    
    // New cup enter animation
    ele.offsetWidth;
    ele.classList.add("enter-left");
    activateIngredientButtons();
}

// Transition customer (between rounds)
async function customerTransition() {
    const ele = document.getElementById("customer");
    // Old customer exit animation
    ele.classList.remove("enter-right");
    ele.classList.remove("exit-right");
    ele.classList.add("exit-right");

    await getRandomCustomerAfter1s();
    sounds.sfx["bell"].play();
    
    // New customer enter animation
    ele.classList.add("enter-right");
}

// Wait for 1 second, then get a new customer (used to wait for transition)
function getRandomCustomerAfter1s() {
    return new Promise((resolve) => {
        setTimeout(() => {
            getRandomCustomer();
            resolve();
        }, 1000);
    });
}

// Get a random new customer and change the customer's image (after finishing an order)
function getRandomCustomer() {
    const ele = document.getElementById("customer");
    // Don't allow the same customer twice in a row
    let exclude = -1;
    switch (ele.alt) {
        case "penny":
            exclude = 0;
            break;
        case "vivian":
            exclude = 1;
            break;
        case "fariha":
            exclude = 2;
            break;
        case "jason":
            exclude = 3;
            break;
        case "henry":
            exclude = 4;
            break;
        case "kevin":
            exclude = 5;
            break;
    }
    const randomCustomer = ingredients.customers[rand(0,6,exclude)];
    ele.src = randomCustomer.default;
    ele.alt = randomCustomer.name;
}