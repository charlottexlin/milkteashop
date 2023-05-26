import * as ingredients from "./ingredients.js";

function main() {
    // TODO: have a timer, run the game loop while the timer is above 0 seconds
    activateIngredientButtons();
    const order = generateOrder();
    displayOrder(order);
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

// Fills the cup with the given tea flavor
function fillTea(flavor) {
    const ele = document.getElementById("tea");
    ele.src = flavor.img;
    ele.alt = flavor.name;
    deactivateButtons(ingredients.flavors);
}

// Adds the given topping to the cup
function addTopping(topping) {
    // TODO Toppings go on bottom except whipped cream
    const ele = document.getElementById("topping");
    ele.src = topping.img;
    ele.alt = topping.name;
    deactivateButtons(ingredients.toppings);
}

// Adds the given temperature to the cup
function addTemperature(temp) {
    const ele = document.getElementById("temperature");
    ele.src = temp.img;
    ele.alt = temp.name;
    deactivateButtons(ingredients.temperatures);
}

// Removes onclick functions of all icons of the given array
function deactivateButtons(elements) {
    elements.forEach((element) => {
        document.getElementById(element.iconId).onclick = null;
    });
}

// Generates a random order consisting of a flavor, a topping, and a temperature
function generateOrder() {
    const randFlav = ingredients.flavors[rand(0,8)];
    const randTop = ingredients.toppings[rand(0,8)];
    const randTemp = ingredients.temperatures[rand(0,3)];
    return {
        flavor: randFlav,
        topping: randTop,
        temp: randTemp,
    }
}

// Generates a random integer between the lower (inclusive) and upper bound (exclusive)
function rand(lower, upper) {
    return Math.floor(Math.random() * upper) + lower;
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
    tempOrder.src = order.temp.icon;
    tempOrder.alt = order.temp.name + " icon";
}

// Call the main line of execution only when the DOM has completely loaded
document.addEventListener('DOMContentLoaded', main);