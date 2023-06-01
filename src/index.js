import * as ingredients from "./ingredients.js";

let money = 0;
let currentTea = {flavor: "", topping: "", temperature: ""};
let timeLeft = 120; // Timer for the game, in seconds
let timer;

// Call the main line of execution only when the DOM has completely loaded
document.addEventListener('DOMContentLoaded', main);

async function main() {
    timer = setInterval(tick, 1000);
    await customerTransition();
    while (timeLeft > 0) {
        const order = generateOrder();
        setupButtons(order);
        activateIngredientButtons();
        displayOrder(order);
        await doneBtnClicked();
        cupTransition();
        await customerTransition();
    }
    gameOver();
}

// Count down one second
function tick() {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = ("0" + timeLeft % 60).slice(-2);
    document.getElementById("timer").innerHTML = "Remaining Time: " + minutes + ":" + seconds;
    if (timeLeft <= 0) {
        gameOver();
    }
}

// Show the game over screen (once the timer runs out)
function gameOver() {
    clearInterval(timer);
    // TODO
    console.log("game over");
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
        while (number == exclude) {
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
        clearCup();
        activateIngredientButtons();
    }
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
    // Go through each of the keys in playerTea and count how many values match orderTea.
    const correct = Object.keys(playerTea).reduce((accum, curr) => {
        return playerTea[curr].name === orderTea[curr].name ? accum + 1 : accum;
    }, 0);
    if (correct === 3) { // 3 correct = perfect, give $3
        displayPerfect();
        displayPrice(3);
        money += 3;
        updateMoneyCounter(money);
    } else if (correct === 2) { // 2 correct = give $2
        displayPrice(2);
        money += 2;
        updateMoneyCounter(money);
    } else if (correct === 1) { // 1 correct = give $1
        displayPrice(1);
        money += 1;
        updateMoneyCounter(money);
    } else { // 0 correct = give $0
        displayPrice(0);
    }
    // TODO possibly do something here?
}

// Show the "perfect" text if the tea was made correctly
function displayPerfect() {
    const ele = document.getElementById("perfect");
    ele.src = "./img/perfect.png";
    ele.alt = "perfect";
    ele.classList.remove("perfect-animation");
    // Code trick citation: https://css-tricks.com/restart-css-animation/
    void ele.offsetWidth;
    ele.classList.add("perfect-animation");
    setTimeout(hidePerfect, 600);
}

// Show the price text, with how much money you made from this tea
function displayPrice(amount) {
    const ele = document.getElementById("priceText");
    ele.innerHTML = "+ $" + amount;
    ele.classList.remove("perfect-animation");
    void ele.offsetWidth;
    ele.classList.add("perfect-animation");
    setTimeout(hidePrice, 600);
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
        btn.onclick = () => {fillTea(flavor)};
    });
    ingredients.toppings.forEach((topping) => {
        const btn = document.getElementById(topping.iconId);
        btn.onclick = () => {addTopping(topping)};
    });
    ingredients.temperatures.forEach((temp) => {
        const btn = document.getElementById(temp.iconId);
        btn.onclick = () => {addTemperature(temp)};
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

// Reset the cup after finishing an order
function cupTransition() {
    // TODO possibly add animation here (finished cup slide out)
    clearCup();
    // TODO possibly add animation here (blank cup slide in)
    activateIngredientButtons();
}

// Get a random new customer after finishing an order
async function customerTransition() {
    const ele = document.getElementById("customer");
    ele.classList.remove("enter-right");
    ele.classList.remove("exit-right");
    void ele.offsetWidth;
    ele.classList.add("exit-right");

    await getNewCustomer();
    
    void ele.offsetWidth;
    ele.classList.add("enter-right");
}

// Change the customer's image
function getNewCustomer() {
    return new Promise((resolve) => {
        setTimeout(changeImage, 1000);
        function changeImage() {
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
            resolve();
        }
    });
}