import green from "./img/greenTea.png";
import strawberry from "./img/strawberryTea.png";
import peach from "./img/peachTea.png";
import taro from "./img/taroTea.png";
import mango from "./img/mangoTea.png";
import lychee from "./img/lycheeTea.png";
import melon from "./img/melonTea.png";
import jasmine from "./img/jasmineTea.png";
import strawberryBoba from "./img/strawberryBoba.png";
import mangoBoba from "./img/mangoBoba.png";
import pearls from "./img/pearls.png";
import redBean from "./img/redBean.png";
import peachJelly from "./img/peachJelly.png";
import grassJelly from "./img/grassJelly.png";
import coffeeJelly from "./img/coffeeJelly.png";
import whippedCream from "./img/whippedCream.png";
import iceCubes from "./img/iceCubes.png";
import steam from "./img/steam.png";

const flavors = [
    {name: "greenTea", img: green},
    {name: "strawberryTea", img: strawberry},
    {name: "peachTea", img: peach},
    {name: "taroTea", img: taro},
    {name: "mangoTea", img: mango},
    {name: "lycheeTea", img: lychee},
    {name: "melonTea", img: melon},
    {name: "jasmineTea", img: jasmine},
]

const toppings = [
    {name: "strawberryBoba", img: strawberryBoba},
    {name: "mangoBoba", img: mangoBoba},
    {name: "pearls", img: pearls},
    {name: "redBean", img: redBean},
    {name: "peachJelly", img: peachJelly},
    {name: "grassJelly", img: grassJelly},
    {name: "coffeeJelly", img: coffeeJelly},
    {name: "whippedCream", img: whippedCream},
]

const temperatures = [
    {name: "cold", img: iceCubes},
    {name: "medium", img: ""},
    {name: "hot", img: steam},
]

export {
    flavors,
    toppings,
    temperatures
}