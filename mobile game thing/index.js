const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
let playerSizeTracker = document.getElementById('playerSizeTracker')
let foodEaten = 0
let foodEatenTracker = document.getElementById('foodEatenTracker')
let deathMessage = document.getElementById('deathMessage')

canvas.width = 522
canvas.height = 939

function rNum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

class Entity{
    constructor({ size, position, color, velocity }){
        this.size = size
        this.position = position
        this.color = color
        this.velocity = velocity
    }
    draw(){
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.size.x, this.size.y)
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

const player = new Entity({
    size: {
        x: 50,
        y: 50
    },
    position: {
        x: canvas.width/2 - 25,
        y: canvas.height - 150
    },
    velocity: {
        x: 0,
        y: 0  
    },
    color: 'blue'
})

let badFoodSpeed = 2

let food = []
setInterval(() => {
    food.push(new Entity({ 
        size: {
            x: 15,
            y: 15
        },
        position: {
            x: rNum(15, canvas.width - 15),
            y: 0
        },
        velocity: {
            x: 0,
            y: 2
        },
        color: 'yellow'
    }))
}, 500)

let badFood = []
setInterval(() => {
    badFood.push(new Entity({ 
        size: {
            x: 25,
            y: 25
        },
        position: {
            x: rNum(25, canvas.width - 25),
            y: 0
        },
        velocity: {
            x: 0,
            y: badFoodSpeed
        },
        color: 'red'
    }))
}, 2500)

// let randomEvents = []
// setInterval(() => {
//     randomEvents.push(new Entity({
//         size: {
//             x: canvas.width/2,
//             y: 50
//         },
//         position: {
//             x: 0,
//             y: 0
//         }
//     }))
// })

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

function animate(){
    window.requestAnimationFrame(animate)
    
    badFoodSpeed += 0.0002

    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)   

    player.update()
    for (let i = 0; i < food.length; i++){
        food[i].update()
    }
    for (let i = 0; i < badFood.length; i++){
        badFood[i].update()
    }

    playerSizeTracker.innerHTML = `Size: ${player.size.x}`
    foodEatenTracker.innerHTML = `Food eaten: ${foodEaten}`

    player.velocity.x = 0

    if(keys.a.pressed) {
        player.velocity.x = -3
    }else if(keys.d.pressed) {
        player.velocity.x = 3
    }
    
    if(player.position.x + player.size.x >= canvas.width){
        player.position.x = canvas.width - player.size.x
    }else if(player.position.x <= 0){
        player.position.x = 0
    }

    for (let i = 0; i < food.length; i++) {
        if(player.position.x + player.size.x >= food[i].position.x
        && player.position.x <= food[i].position.x + food[i].size.x
        && player.position.y + player.size.x >= food[i].position.y
        && player.position.y <= food[i].position.y + food[i].size.y
        ){
            player.size.x += 3
            player.size.y += 3
            player.position.x -= 1.5
            player.position.y -= 1.5
            food[i].position.x = -500
            food[i].position.y = -500
            foodEaten++
        }
    }

    for (let i = 0; i < badFood.length; i++) {
        if(player.position.x + player.size.x >= badFood[i].position.x
        && player.position.x <= badFood[i].position.x + badFood[i].size.x
        && player.position.y + player.size.x >= badFood[i].position.y
        && player.position.y <= badFood[i].position.y + badFood[i].size.y
        ){
            player.size.x -= 15
            player.size.y -= 15
            player.position.x += 7.5
            player.position.y += 7.5
            badFood[i].position.x = -500
            badFood[i].position.y = -500
        }
    }

    if(player.size.x <= 0){
        c.fillStyle = 'black'
        c.fillRect(0, 0, canvas.width, canvas.height)

        deathMessage.style.display = 'block'

        for (let i = 0; i < badFood.length; i++) {
            badFood[i].position.x = -500
            badFood[i].position.y = -500
        }
        for (let i = 0; i < food.length; i++) {
            food[i].position.x = -500
            food[i].position.y = -500
        }
    }
}

animate()



window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            break
        case 'a':
            keys.a.pressed = true
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }
})