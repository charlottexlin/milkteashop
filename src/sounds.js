const bgMusic = new Audio('./sfx/music.mp3');

const sfx = {
    "end": new Audio('./sfx/end-chime.mp3'),
    "button": new Audio('./sfx/button.mp3'),
    "bell": new Audio('./sfx/bell.mp3'),
    "tea": new Audio('./sfx/water-pour.mp3'),
    "topping": new Audio('./sfx/bubble-pop.mp3'),
    "temperature": new Audio('./sfx/blip.mp3'),
    "trash": new Audio('./sfx/trash.mp3'),
    "perfect": new Audio('./sfx/perfect.mp3'),
    "fail": new Audio('./sfx/fail.mp3'),
    "swoosh": new Audio('./sfx/swoosh.mp3')
}

export {
   bgMusic,
   sfx
}