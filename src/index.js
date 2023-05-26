import * as ingredients from "./ingredients.js";

function main() {
    // TODO: have a timer, run the game loop while the timer is above 0 seconds
    const order = generateOrder();
    displayOrder(order);
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
    flavorOrder.alt = order.flavor.name;
    const toppingOrder = document.getElementById("toppingOrder");
    toppingOrder.src = order.topping.icon;
    toppingOrder.alt = order.topping.name;
    const tempOrder = document.getElementById("tempOrder");
    tempOrder.src = order.temp.icon;
    tempOrder.alt = order.temp.name;
}

// Call the main line of execution only when the DOM has completely loaded
document.addEventListener('DOMContentLoaded', main);