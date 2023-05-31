import * as ingredients from "./ingredients.js";

let money = 0;
let currentTea = {flavor: "", topping: "", temperature: ""};

// Call the main line of execution only when the DOM has completely loaded
document.addEventListener('DOMContentLoaded', main);

async function main() {
    // TODO: have a timer, run the game loop while the timer is above 0 seconds
    while (true) {
        const order = generateOrder();
        setupButtons(order);
        activateIngredientButtons();
        displayOrder(order);
        await doneBtnClicked();
    }
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

// Generates a random integer between the lower (inclusive) and upper bound (exclusive)
function rand(lower, upper) {
    return Math.floor(Math.random() * upper) + lower;
}

// Set up onclick functions for done and trash buttons
function setupButtons(order) {
    const doneBtn = document.getElementById("doneBtn");
    doneBtn.onclick = () => {
        submitOrder(currentTea, order);
        // TODO possibly add animation here (finished cup slide out)
        clearCup();
        // TODO possibly add animation here (blank cup slide in)
        activateIngredientButtons();
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
    const topping = document.getElementById("topping");
    topping.src = "";
    topping.alt = "";
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
        money += 3;
        updateMoneyCounter(money);
    } else if (correct === 2) { // 2 correct = give $2
        money += 2;
        updateMoneyCounter(money);
    } else if (correct === 1) { // 1 correct = give $1
        money += 1;
        updateMoneyCounter(money);
    } // 0 correct = give $0
    // TODO possibly do something here?
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
    // TODO Toppings go on bottom except whipped cream
    // TODO also red bean and jelly have diff placements
    const ele = document.getElementById("topping");
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