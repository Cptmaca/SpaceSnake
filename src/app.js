// TODO:
// high scores and player names (and tracking who played, when etc.) - hidden anon button (on the astronaut below)
// legenda explicativa controles (arrows up down etc.) - pode já colocar as setas como botôes de controle para mobile. talvez alterar width tb
// host online
// crazy big snake game mode (start length)
// add sounds
//resize design componentes (header, text etc.) to be relative, and fit in a mobile screen (or even desktop screen). It is too big right now.
//instead of px, use some relative sizing for headers etc, so you can change them all by a single parameter
//  fix the black border corners in the snake
// identify the carina nebula credits

// cookies for player name in session


//this function scales the viewport dynamically
// it reads the initial viewport scale and the sreen width, and
//calculates screen width. Then it sets the correct scale
//considering screen width and 560px that is the game grid width
//scale has to have 2 decimal places
function viewportScale() {
    const viewport = document.getElementById("myViewport") 
    let currentViewportAttribute = viewport.getAttribute("content");
    // console.log(currentViewportAttribute);
    let currentScaleString = currentViewportAttribute.slice(currentViewportAttribute.length-4, currentViewportAttribute.length);
    let currentScale = Number(currentScaleString);
    // console.log("currentScale: ", currentScale);




    if(window.innerWidth !== undefined && window.innerHeight !== undefined) { 
        var w = window.innerWidth;
        var h = window.innerHeight;
    } else {  
        var w = document.documentElement.clientWidth;
        var h = document.documentElement.clientHeight;
    }

    let realW = w*currentScale;
    let realH = h*currentScale;
    let newScale = Math.floor(realW / 560 / 1.1 * 100) /100;
    console.log("newScale: ", newScale);

    let newViewportAttribute = "user-scalable=no, initial-scale=" + newScale;
    // console.log("new attr", newViewportAttribute);

    viewport.setAttribute('content', newViewportAttribute);

    // console.log("real w, h: ", w*currentScale, h*currentScale);

    // var txt = "Page size: width=" + Math.floor(w*0.57) + ", height=" + Math.floor(h*0.57);
    // document.getElementById("demo").innerHTML = txt;
}

document.addEventListener("DOMContentLoaded", () => {

    const grid = document.querySelector(".grid")
    const gameSpeed = 150
    let score = 0
    let intervalID = 0
    const scoreDisplay = document.querySelector("#score")
    const width = 20
    const gridCellWidth = Math.floor(560/width) //parameter to fit my header LUL

    grid.style.width = width * gridCellWidth + "px"
    grid.style.height = width * gridCellWidth + "px"



    //for the game pad
    let gamepadLeft = document.getElementById("game-pad-left-id")
    let gamepadUp = document.getElementById("game-pad-up-id")
    let gamepadRight = document.getElementById("game-pad-right-id")
    let gamepadDown = document.getElementById("game-pad-down-id")
    

    //for the game over div
    let gameOverBox = document.getElementById("game-over-box-id")
    let playAgainBox = document.getElementById("play-again-id")
    gameOverBox.style.display = "none"
    playAgainBox.style.display = "none"
    // layout of grid and what is in the squares

    //blank for testing
    // const layout = [
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    //     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4
    // ]

    let layout = []
    for (i = 0; i < width ** 2; i++)
        layout[i] = 4


    // 0 - pac-dots
    // 1 - wall
    // 2 - ghost-lair
    // 3 - apple
    // 4 - empty

    let indexes = []
    for (i = 0; i < width ** 2; i++)
        indexes[i] = i
    const squares = []
    let apples = []

    //draw the grid and render it
    function createBoard() {
        for (let i = 0; i < layout.length; i++) {
            const square = document.createElement('div')
            grid.appendChild(square)
            squares.push(square)

            square.style.width = gridCellWidth + "px"
            square.style.height = gridCellWidth + "px"

            // create map
            switch (layout[i]) {
                case 0:
                    squares[i].classList.add('pac-dot')
                    break
                case 1:
                    squares[i].classList.add('wall')
                    break
                case 2:
                    squares[i].classList.add('ghost-lair')
                    break
                case 3:
                    squares[i].classList.add('apple')
                    apples.push(i)
                    break
                case 4:
                    squares[i].classList.add('empty')
                    break
            }
        }

    }

    createBoard()
    //directions
    const left = -1
    const up = -width
    const right = 1
    const down = width
    const directions = [left, up, right, down]
    let isGameOver = false


    //create snake
    let snake = []
    // let start = 392
    let start = width * Math.floor(width / 2) //starts at middle height
    let startLength = Math.floor(width / 2)
    for (i = 0; i < startLength; i++)
        snake.push(i + start - 1)
    // let snake = [479, 480, 481, 482, 483, 484]
    let snakeHead = snake[snake.length - 1]
    let lastHead = snakeHead
    let snakeIntervalId = 0
    let currentDirection = right
    let inputDirection = currentDirection
    squares[snakeHead].classList.add("snake")

    //create first apple in random location after board is created

    // generate an array with the squares where there is no snake, pick a random value there
    let validApplePositions = indexes.filter(item => !snake.includes(item))
    apples.push(validApplePositions[Math.floor(Math.random() * validApplePositions.length)]) //generates apple in random position


    // apples[0] = Math.floor(Math.random() * width ** 2)
    // console.log(apples[0], "hi")
    squares[apples[0]].classList.remove('empty')
    squares[apples[0]].classList.add('astronaut-bg')
    // const astronaut = document.createElement("i")
    // squares[apples[0]].appendChild(astronaut)
    // squares[apples[0]].classList.add("fas fa-user-astronaut")
    squares[apples[0]].innerHTML = '<i class="fas fas fa-sun" color="white"></i>'


    function clearSnake() {
        snake.forEach(element => squares[element].classList.remove("snake"))
        lastHead = snakeHead
    }

    function drawSnake() {
        if (isGameOver) {
            snake.pop() //we need to print the dead snake, but the head will be in an invalid posistion.
            // therefore, pop the head.
            snake.forEach(element => squares[element].classList.add("dead-snake"))
        }
        else
            snake.forEach(element => squares[element].classList.add("snake"))
    }

    drawSnake()
    clearSnake()


    //random snake
    function randomDirection() {
        //legal directions:
        // write a loop for all possible directions. Test if each one of them
        // results in a element of the snake array. if not, append to legalDirections
        // how to test: snakehead + direction not contained in the snake array
        let legalDirections = []

        for (let i = 0; i < directions.length; i++) {
            if (!snake.includes(snakeHead + directions[i]))
                legalDirections.push(directions[i])
            console.log(legalDirections)
        }

        // return random direction from the legal directions array
        return legalDirections[Math.floor(Math.random() * legalDirections.length)]
    }

    intervalID = setInterval(moveSnake, gameSpeed)


    // //move snake

    // clearRestart()

    // this function ends the game
    function gameOver() {
        console.log("inside game over")
        isGameOver = true
        clearInterval(intervalID)
        gamepadLeft.removeEventListener("click", () => {directionInput(37);})
        gamepadUp.removeEventListener("click", () => {directionInput(38);})
        gamepadRight.removeEventListener("click", () => {directionInput(39);})
        gamepadDown.removeEventListener("click", () => {directionInput(40);})
        document.removeEventListener('keyup', directionInput)
        const refreshPage = () => { location.reload(); }
        setTimeout(function () {
            gameOverBox.style.display = "block";            
        }, 500)
        window.navigator.vibrate([200, 100, 200, 100, 200]);
        setTimeout(function () {
            playAgainBox.style.display = "block";
        }, 1500)
        playAgainBox.addEventListener("click", refreshPage)


    }

    function checkForGameOver() {
        // snake crashes into itself
        let snakeBody = snake.slice()
        snakeBody.pop() //this is the body without the head
        if (snakeBody.includes(snakeHead))
            gameOver()

        // snake crashes into wall
        // map topWall, bottomWall, rightWall, leftWall in layout []
        // read layout [snakeHead], and each of the 4 walls will have a specific forbidden
        // direction, or game over direction
        // get snakeHead, find forbidden direction, check if currentDirection is a forbidden direction
        // make it a 2 row array, where the 2 dimension lists forbidden directions
        // you can also use a 3 row array, becuse at the corners you have 2 forbidden diretions
        // *multidimensional array os objects is too complicated. Find the walls by using maths and % and division.


        // essa lógica não está boa. não é snakehead em posição legal e proxima direçao ruim. 
        // tem que ser snakehead em posição ilegal direto

        //outra ideia: currentHead e lastHead. para right e left. E não printa currentHead ilegal

        //bottom
        if (lastHead >= width ** 2 - width && snakeHead == lastHead + down)
            gameOver()

        //top
        if (lastHead < width && snakeHead == lastHead + up)
            gameOver()

        //left
        if ((lastHead % width) == 0 && snakeHead == lastHead + left)
            gameOver()

        //right
        if ((lastHead % width) == (width - 1) && snakeHead == lastHead + right)
            gameOver()

        // console.log(snakeHead)
    }

    function moveSnake() {
        let enlarge = false
        clearSnake()


        // currentDirection = randomDirection()

        //you can't move the snake onto itself
        if (!snake.includes(snakeHead + inputDirection))
            currentDirection = inputDirection
        else
            //this discards the input and makes sure the snake doesn't 
            // move direction later when it is valid
            inputDirection = currentDirection

        if (currentDirection == left)
            snakeHead -= 1
        if (currentDirection == up)
            snakeHead -= width
        if (currentDirection == right)
            snakeHead += 1
        if (currentDirection == down)
            snakeHead += width

        // if head eats apple
        if (apples.includes(snakeHead)) {
            enlarge = true;
            squares[snakeHead].classList.remove('astronaut-bg')
            squares[snakeHead].innerHTML = ""
            squares[snakeHead].classList.add("empty")
            apples = apples.filter(item => item !== snakeHead) //removes the snakeHead apple

            // generate an array with the squares where there is no snake, pick a random value there
            let validApplePositions = indexes.filter(item => !snake.includes(item))
            apples.push(validApplePositions[Math.floor(Math.random() * validApplePositions.length)]) //generates apple in random position

            // console.log("filtered", indexes.filter(item => !snake.includes(item)))
            // console.log("unfiltered", indexes)
            // console.log("snake", snake)
            // console.log(validApplePositions)
            // console.log(apples[apples.length -1])

            //adds apple icon and class
            squares[apples[apples.length - 1]].classList.remove("empty")
            squares[apples[apples.length - 1]].classList.add('astronaut-bg')
            squares[apples[apples.length - 1]].innerHTML = '<i class="fas fas fa-sun" color="white"></i>'
            score += 1
            scoreDisplay.innerHTML = score
        }

        // do not remove tail if enlarge == true
        if (!enlarge)
            snake.shift()

        snake.push(snakeHead)
        checkForGameOver()
        drawSnake()
        // console.log(lastHead, snakeHead)

    }

    // function clearRestart() {
    //     clearInterval(intervalID)
    //     intervalID = setInterval(moveSnake, 500, currentDirection);
    // }

    function directionInput(e) {
        switch (e.keyCode || e) {
            case 37:
                inputDirection = left
                break
            case 38:
                inputDirection = up
                break
            case 39:
                inputDirection = right
                break
            case 40:
                inputDirection = down
                break
        }

    }


    gamepadLeft.addEventListener("click", () => {directionInput(37);})
    gamepadUp.addEventListener("click", () => {directionInput(38);})
    gamepadRight.addEventListener("click", () => {directionInput(39);})
    gamepadDown.addEventListener("click", () => {directionInput(40);})
    document.addEventListener("keyup", directionInput)


})