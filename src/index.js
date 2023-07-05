import * as ingredients from "./ingredients.js";

//const timeLimit = 120; // Total number of seconds the game lasts for
const timeLimit = 5; // TODO for testing
let money = 0; // Money the player has made so far
let currentTea = {flavor: "", topping: "", temperature: ""}; // Tea that the player has built so far
let timeLeft = timeLimit; // Amount of seconds left on the game timer, in seconds
let timer; // The actual timer "object"
let trashed = false; // Tracks if you hit trash during this round
let teaCount = 0;// The number of teas that the customer has made since they started playing
let perfectCount = 0; // The number of perfect teas that the customer has made since they started playing

const bgMusic = new Audio('./sfx/TalkingCuteChiptune.mp3');
const startSfx = new Audio('./sfx/harp-start.mp3');
const endSfx = new Audio('./sfx/harp-end.mp3');
const buttonSfx = new Audio('./sfx/button.mp3');
const bellSfx = new Audio('./sfx/bell.mp3');
const teaSfx = new Audio('./sfx/water-pour.mp3');
const toppingSfx = new Audio('./sfx/bubble-pop.mp3');
const tempSfx = new Audio('./sfx/blip.mp3');
const trashSfx = new Audio('./sfx/trash.mp3');
const perfectSfx = new Audio('./sfx/perfect.mp3');
const failSfx = new Audio('./sfx/fail.mp3');
const swooshSfx = new Audio('./sfx/swoosh.mp3');

// Call the main line of execution only when the DOM has completely loaded
document.addEventListener('DOMContentLoaded', main);

function main() {
    /* Google Chrome blocks music autoplay so will have to find some work around
    bgMusic.play();
    */
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
        startSfx.play();
        bellSfx.play();
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
        buttonSfx.play();
        // Hide start menu screen
        gameStartEle.classList.add("invisible");
        tutorial();
    }
    // Activate credits button
    const creditsBtn = document.getElementById("creditsBtn");
    creditsBtn.onclick = () => {
        buttonSfx.play();
        // Hide start menu screen
        gameStartEle.classList.add("invisible");
        credits();
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
        buttonSfx.play();
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
        buttonSfx.play();
        gameStartMenu();
    }
}

// Get rid of the game to show the game over screen (once the timer runs out)
function gameOver() {
    endSfx.play();
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
        buttonSfx.play();
        restartGame();
    }
    // Activate back to menu button
    const backBtn = document.getElementById("backBtn3");
    backBtn.onclick = () => {
        // Hide game over screen
        gameOverEle.classList.add("invisible");
        buttonSfx.play();
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
    // Start over by resetting the timer and global variables, then running the main function
    timeLeft = timeLimit;
    money = 0;
    currentTea = {flavor: "", topping: "", temperature: ""};
    trashed = false;
    teaCount = 0;
    perfectCount = 0;
    gameLoop();
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
    }
    const trashBtn = document.getElementById("trashBtn");
    trashBtn.onclick = () => {
        trashSfx.play();
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
            perfectSfx.play();
            displayPerfect();
            perfectCount++;
        }
        displayPrice(3);
        changeCustomerImage("happy");
        money += 3;
        updateMoneyCounter(money);
    } else if (correct === 2) { // 2 correct = give $2
        swooshSfx.play();
        displayPrice(2);
        money += 2;
        updateMoneyCounter(money);
    } else if (correct === 1) { // 1 correct = give $1
        swooshSfx.play();
        displayPrice(1);
        changeCustomerImage("angry");
        money += 1;
        updateMoneyCounter(money);
    } else { // 0 correct = give $0
        failSfx.play();
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
            teaSfx.play();
            fillTea(flavor);
        };
    });
    ingredients.toppings.forEach((topping) => {
        const btn = document.getElementById(topping.iconId);
        btn.onclick = () => {
            toppingSfx.play();
            addTopping(topping);
        };
    });
    ingredients.temperatures.forEach((temp) => {
        const btn = document.getElementById(temp.iconId);
        btn.onclick = () => {
            tempSfx.play();
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
    bellSfx.play();
    
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