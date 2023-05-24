import "./ingredients.js";

function main() {
    generateOrder();
}

// Generates a random order consisting of a flavor, a topping, and a temperature
function generateOrder() {
    const randFlav = flavors[rand(0,8)];
    const randTop = toppings[rand(0,8)];
    const randTemp = temperatures[rand(0,3)];
    return {
        flavor: randFlav,
        topping: randTop,
        temperature: randTemp,
    }
}

// Generates a random integer between the lower (inclusive) and upper bound (exclusive)
function rand(lower, upper) {
    Math.floor(Math.random() * upper) + lower;
}

// Call the main line of execution only when the DOM has completely loaded
document.addEventListener('DOMContentLoaded', main);