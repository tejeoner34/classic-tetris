// -------------------------------------------
// CONSTANTES DEL BOARD PRINCIPAL
// -------------------------------------------
const BOARD_WIDTH = 10; //ANCHO EN Nº BLOQUES
const BOARD_HEIGHT = 20; //ALTO EN Nº BLOQUES
let nextRandom = 0;
let SCORE = 0;
const scoreDOM = document.getElementById('score__board');
scoreDOM.textContent = SCORE;

let audio = document.getElementById('audio');
let play = document.getElementById('play');


function accionPlay() {
    if (!audio.paused) {
        audio.pause();
        play.value = '\u25BA';

    } else {
        audio.play();
        play.value = '||'
    }
};



play.addEventListener('click', accionPlay); // este evento sirve para parar y poner la música con el botón 





// -------------------------------------------
// CONSTANTES DEL BOARD SECUNDARIO
// -------------------------------------------
const BOARD_WIDTH_MINI_BOARD = 4;
const BOARD_HEIGHT_MINI_BOARD = 4;

// -------------------------------------------
// CREACION DEL BOARD
// ------------------------------------------- 

// Creo función para crear un bloque
function generateBoardBlock() {

    const bloque = document.createElement('div');
    bloque.classList.add('game__blocks');
    const bloqueInterior = document.createElement('div'); // este div lo creo para incluirlo dentro de bloque más grande
    bloqueInterior.classList.add('game__blocks--interior');
    bloque.appendChild(bloqueInterior);
    bloque.style.width = '25px';
    bloque.style.height = '25px';
    return bloque;
}


// creacion de funcion para generar bloques para meterlos en la última fila
function lastRow() {
    const blockNoDisplay = document.createElement('div');
    blockNoDisplay.classList.add('game__blocks');
    blockNoDisplay.classList.add('taken');
    blockNoDisplay.classList.add('tetromino');
    blockNoDisplay.style.width = '25px';
    blockNoDisplay.style.height = '25px';
    blockNoDisplay.style.display = 'none'; // tienen display none para que no sean visibles en el navegador
    return blockNoDisplay;
}

// creacion de funcion para pintar los bloques creados en lastRow en la última fila
function drawLastRow(clase, ancho) {
    for (let i = 0; i < ancho; i++) {
        document.querySelector(clase).appendChild(lastRow());
    }

}

// creamos la función para pintar los bloques en el board.
function drawBoard(containerClass, width, heigth) {

    for (let i = 0; i < width * heigth; i++) { // uso un for para recorrer todo el contenedor y que se pinten todos los bloques

        document.querySelector(containerClass).appendChild(generateBoardBlock());
    }
}

drawBoard('.game__board', BOARD_WIDTH, BOARD_HEIGHT); //ejecuto la funcion para el container principal 

drawBoard('.next-tetro__board', BOARD_WIDTH_MINI_BOARD, BOARD_HEIGHT_MINI_BOARD); // ejecuto la funcion para rellenar el contenedor de instrucciones

drawLastRow('.game__board', BOARD_WIDTH); // ejecutamos la funcion para pintar la última fila

// -------------------------------------------
// CREACION DE VARIABLES PARA IMPLEMENTAR
// -------------------------------------------

const GRID = document.querySelector('.game__board');

let BOARD = Array.from(document.querySelectorAll('.game__board .game__blocks'));
const MINI_BOARD = Array.from(document.querySelectorAll('.next-tetro__board .game__blocks'))

const SCORE_DISPLAY = document.querySelector('#score__board'); //creacionn de variable para traer el div de puntuación

// -------------------------------------------
// CREACION DE TETROMINOS
// -------------------------------------------


const J_TETROMINO = [
    [1, BOARD_WIDTH + 1, BOARD_WIDTH * 2 + 1, 2],
    [BOARD_WIDTH, BOARD_WIDTH + 1, BOARD_WIDTH + 2, BOARD_WIDTH * 2 + 2],
    [1, BOARD_WIDTH + 1, BOARD_WIDTH * 2 + 1, BOARD_WIDTH * 2],
    [BOARD_WIDTH, BOARD_WIDTH * 2, BOARD_WIDTH * 2 + 1, BOARD_WIDTH * 2 + 2]
];

const L_TETROMINO = [
    [1, 2, BOARD_WIDTH + 2, BOARD_WIDTH * 2 + 2],
    [BOARD_WIDTH, BOARD_WIDTH + 1, BOARD_WIDTH + 2, BOARD_WIDTH * 2],
    [1, BOARD_WIDTH + 1, BOARD_WIDTH * 2 + 1, BOARD_WIDTH * 2 + 2],
    [BOARD_WIDTH + 2, BOARD_WIDTH * 2, BOARD_WIDTH * 2 + 1, BOARD_WIDTH * 2 + 2]
];
const I_TETROMINO = [
    [1, BOARD_WIDTH + 1, BOARD_WIDTH * 2 + 1, BOARD_WIDTH * 3 + 1],
    [BOARD_WIDTH, BOARD_WIDTH + 1, BOARD_WIDTH + 2, BOARD_WIDTH + 3],
    [1, BOARD_WIDTH + 1, BOARD_WIDTH * 2 + 1, BOARD_WIDTH * 3 + 1],
    [BOARD_WIDTH, BOARD_WIDTH + 1, BOARD_WIDTH + 2, BOARD_WIDTH + 3]
];
const T_TETROMINO = [
    [1, BOARD_WIDTH, BOARD_WIDTH + 1, BOARD_WIDTH + 2],
    [1, BOARD_WIDTH + 1, BOARD_WIDTH + 2, BOARD_WIDTH * 2 + 1],
    [BOARD_WIDTH, BOARD_WIDTH + 1, BOARD_WIDTH + 2, BOARD_WIDTH * 2 + 1],
    [1, BOARD_WIDTH, BOARD_WIDTH + 1, BOARD_WIDTH * 2 + 1]
];
const Z_TETROMINO = [
    [0, 1, BOARD_WIDTH + 1, BOARD_WIDTH + 2],
    [2, BOARD_WIDTH + 1, BOARD_WIDTH + 2, BOARD_WIDTH * 2 + 1],
    [0, 1, BOARD_WIDTH + 1, BOARD_WIDTH + 2],
    [2, BOARD_WIDTH + 1, BOARD_WIDTH + 2, BOARD_WIDTH * 2 + 1]
];
const S_TETROMINO = [
    [1, 2, BOARD_WIDTH, BOARD_WIDTH + 1],
    [0, BOARD_WIDTH, BOARD_WIDTH + 1, BOARD_WIDTH * 2 + 1],
    [1, 2, BOARD_WIDTH, BOARD_WIDTH + 1],
    [0, BOARD_WIDTH, BOARD_WIDTH + 1, BOARD_WIDTH * 2 + 1]
];
const O_TETROMINO = [
    [0, 1, BOARD_WIDTH, BOARD_WIDTH + 1],
    [0, 1, BOARD_WIDTH, BOARD_WIDTH + 1],
    [0, 1, BOARD_WIDTH, BOARD_WIDTH + 1],
    [0, 1, BOARD_WIDTH, BOARD_WIDTH + 1]

];


// CREACION DE ARRAY DE TODAS LAS PIEZAS
const TETROMINOES = [J_TETROMINO, L_TETROMINO, I_TETROMINO, T_TETROMINO, S_TETROMINO, Z_TETROMINO, O_TETROMINO];

//DIFERENCIACION DE PIEZA QUE CAE
let currentPosition = 4;
let currentRotation = 0;

// SELECCION RANDOM DE TETROMINO 
let generateRandomTetrominoe = Math.floor(Math.random() * TETROMINOES.length);

// SELECCION RANDOM DE INDEX DE TETROMINO 
let currentTetromino = TETROMINOES[generateRandomTetrominoe][currentRotation];

// PINTAR TETROMINO SELECCIONADO EN PANTALLA
function drawTetrominoeInMainBoard() {

    currentTetromino.forEach(index => {
        BOARD[currentPosition + index].classList.add('tetromino');
    });
}
drawTetrominoeInMainBoard();

// DESPINTAR DE TETROMINO SELECCIONADO EN PANTALLA
function undrawTetrominoeInMainBoard() {
    currentTetromino.forEach(index => {
        BOARD[currentPosition + index].classList.remove('tetromino');
    })
}

// -------------------------------------------
// CREACION DE MOVIMIENTOS DE TETROMINOS
// -------------------------------------------

//CAIDA DE PIEZAS
// creacion de constante de tiempo de caida de piezas 
const TIMER = setInterval(moveDown, 1000);

// CONTROLES CON TECLAS
function control(e) {

    // incluyo el audio para que esté disponible para todos los desplazamiento de las fichas
    const move_sound = new Audio("music/samples_move.mp3");
    if (e.keyCode === 37) {
        //ejecuto el sonido de desplazmiento
        move_sound.play();
        moveLeft()
    } else if (e.keyCode == 38) {
        //incluyo el audio de las rotaciones
        const rotation_sound = new Audio("music/samples_rotate.mp3");
        rotation_sound.play();
        rotate();
    } else if (e.keyCode === 39) {
        //ejecuto el sonido de desplazmiento
        move_sound.play();
        moveRight();
    } else if (e.keyCode === 40) {
        //ejecuto el sonido de desplazmiento
        move_sound.play();
        moveDown();
    }

}
document.addEventListener('keydown', control);

// window.addEventListener("keydown", function(e) {
//     // space and arrow keys
//     if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
//         e.preventDefault();
//     }
// }, false);

window.addEventListener("keydown", function(e) {
    if (["ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp"].indexOf(e.code) > -1) {
        console.log(e.code)
        e.preventDefault();
    }
});


// CAIDA DE PIEZAS
// creacion de funcion callback  moveDown de interval para que bajen
function moveDown() {
    undrawTetrominoeInMainBoard()
    currentPosition += BOARD_WIDTH;
    drawTetrominoeInMainBoard();
    gameLoop();
}
// CONGELAMIENTO EN ULTIMA LINEA
// creacion de funcion freeze para que cuando toquen el final, frenen
function gameLoop() {
    if (currentTetromino.some(index => BOARD[currentPosition + index + 10].classList.contains('taken'))) {
        currentTetromino.forEach(i => BOARD[currentPosition + i].classList.add('taken'));

        //Incluyo el audio del freeze
        const shift_sound = new Audio("music/samples_shift.mp3");
        shift_sound.play();

        gameOver();

        //hacemos que caiga un nuevo tetromino
        generateRandomTetrominoe = nextRandom; //random tetromino generado es ahora nextRandom (0)
        nextRandom = Math.floor(Math.random() * TETROMINOES.length); //nextRandom es ahora GenerateRandom Tetro
        currentTetromino = TETROMINOES[generateRandomTetrominoe][currentRotation];
        currentPosition = 4;
        updateTetrisBoard();
        drawTetrominoeInMainBoard();
        displayShape(); //pinto en MINI_BOARD
    }
}

// MOVER IZQUIERDA
function moveLeft() {
    // despintar tetromino
    undrawTetrominoeInMainBoard()
        // sacar el lado izquierdo (indice 0,10,20,30..) y guardarlo en constante
    const IS_AT_LEFT_EDGE = currentTetromino.some(index => (currentPosition + index) % BOARD_WIDTH === 0);
    // si la posicion no és la de la variable de arriba
    if (!IS_AT_LEFT_EDGE) { currentPosition -= 1 };
    // y si alguna rotación del tetromino no es de los divs 'taken'
    if (currentTetromino.some(index => BOARD[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1;
    }
    // pintarla hacia la izquierda
    drawTetrominoeInMainBoard();
}

// MOVER DERECHA
function moveRight() {
    undrawTetrominoeInMainBoard()
        // constante si algun indice del tetromino toca la posicion -1 (que es moverse del 0(la primera)a  -1(la última))
    const IS_AT_RIGHT_EDGE = currentTetromino.some(index => (currentPosition + index) % BOARD_WIDTH === BOARD_WIDTH - 1);
    if (!IS_AT_RIGHT_EDGE) {
        currentPosition += 1
    }
    if (currentTetromino.some(index => BOARD[currentPosition + index].classList.contains('taken'))) {
        currentPosition -= 1;
    }
    drawTetrominoeInMainBoard()
}

// MOVER ARRIBA-ROTAR TETROMINO
function rotate(event) {
    const IS_AT_RIGHT_EDGE = currentTetromino.some(index => (currentPosition + index) % BOARD_WIDTH === BOARD_WIDTH - 1);
    const IS_AT_LEFT_EDGE = currentTetromino.some(index => (currentPosition + index) % BOARD_WIDTH === 0);
    // Para solventar el problema de que el tetromino I se rompa cuando lo rotamos en la posición BOARD_WIDTH -1,
    // he creado esta constante que devuelve true si estamos en BOARD_WIDTH -1
    const IS_AT_RIGHT_EDGE_MINUS_1 = currentTetromino.some(index => (currentPosition + index) % BOARD_WIDTH === BOARD_WIDTH - 2);
    undrawTetrominoeInMainBoard();

    // Condiciones para rotar la I y que no se rompa
    if (IS_AT_RIGHT_EDGE && generateRandomTetrominoe === 2 && (currentRotation === 0 || currentRotation === 2)) {
        currentPosition -= 2;
        currentRotation += 1;
        console.log(IS_AT_RIGHT_EDGE)
    } else if (IS_AT_RIGHT_EDGE_MINUS_1 && generateRandomTetrominoe === 2 && (currentRotation === 0 || currentRotation === 2)) {
        currentPosition -= 2;
        currentRotation += 1;
    } else if (IS_AT_LEFT_EDGE) {
        currentPosition += 1;
        currentRotation += 1;
    } else if (IS_AT_RIGHT_EDGE) {
        currentPosition -= 1;
        currentRotation += 1;

    } else {
        currentRotation += 1;
    }
    if (currentRotation === 4) {
        currentRotation = 0
    }

    currentTetromino = TETROMINOES[generateRandomTetrominoe][currentRotation];

    drawTetrominoeInMainBoard()
}

// -------------------------------------------
// MINIBOARD
// -------------------------------------------
//all the divs inside de div minigrid
// MINI_BOARD -selecciona todos los divs
// BOARD_WIDTH_MINI_BOARD -ancho del container
let displayIndex = 0;

//tetros sin rotacion del mini boards (elijo una sola rotacion)
const UP_NEXT_TETROMINO = [
    [1, BOARD_WIDTH_MINI_BOARD + 1, BOARD_WIDTH_MINI_BOARD * 2 + 1, 2], //J-rotacion 0
    [1, 2, BOARD_WIDTH_MINI_BOARD + 2, BOARD_WIDTH_MINI_BOARD * 2 + 2], //L-rotacion 0
    [1, BOARD_WIDTH_MINI_BOARD + 1, BOARD_WIDTH_MINI_BOARD * 2 + 1, BOARD_WIDTH_MINI_BOARD * 3 + 1], //I- rotacion 0
    [1, BOARD_WIDTH_MINI_BOARD, BOARD_WIDTH_MINI_BOARD + 1, BOARD_WIDTH_MINI_BOARD + 2], //T-rotacion  0
    [1, 2, BOARD_WIDTH_MINI_BOARD, BOARD_WIDTH_MINI_BOARD + 1], //S-rotacion 0
    [0, 1, BOARD_WIDTH_MINI_BOARD + 1, BOARD_WIDTH_MINI_BOARD + 2], //Z-rotacion 0
    [0, 1, BOARD_WIDTH_MINI_BOARD, BOARD_WIDTH_MINI_BOARD + 1] //O-rotacion 0
];

//display tetromino en Mini Board 
function displayShape() {
    MINI_BOARD.forEach(BOARD => { //selecciono del mini board todos los divs (BOARD)
            BOARD.classList.remove('tetromino'); //despinto cualquier tetro que haya
        })
        //del nuevo array de tetros, pinto el tetromino random de next random(la funcion es llamada cuando hace freeze)
    UP_NEXT_TETROMINO[nextRandom].forEach(index => {
        //por cada iteración sobre tetrominos randonm, le sumo valor index pasado arriba
        // y cada div de ese tetro del mini board toma clase tetro
        MINI_BOARD[displayIndex + index].classList.add('tetromino');
    })
}

function updateTetrisBoard() {
    let contador = 0; // Creo un contador para saber cuando completamos cuatro filas de una sola vez

    for (let i = 0; i < 199; i += BOARD_WIDTH) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
        if (row.every(i =>
                BOARD[i].classList.contains('tetromino')
            )) {

            row.forEach(i => {
                contador++; // se suma uno al contador por cada bloque que contiene la clase tetromino
                BOARD[i].classList.remove('taken');
                BOARD[i].classList.remove('tetromino');
                console.log(contador);
                if (contador === 40) {
                    const level_sound = new Audio("music/samples_level.mp3");
                    level_sound.play();
                    SCORE += 1000;
                    contador = 0; // devolvemos el contador a 0 para reiniciar el proceso
                }

            });
            SCORE += 50;
            scoreDOM.textContent = SCORE; // actualizamos el score en el DOM

            const SQUARES_REMOVED = BOARD.splice(i, BOARD_WIDTH);
            BOARD = SQUARES_REMOVED.concat(BOARD);
            BOARD.forEach(index => GRID.appendChild(index));

            //incluyo el audio del scoring
            const tetris_sound = new Audio("music/samples_tetris.mp3");
            tetris_sound.play();
        }
    }
}


// creando la función de GameOver


// creo una función para que la página se recargue y así empezar el juego
// esta función es la que voy a usar para el eventListener dentro de la función de isGameOver()
function reStart() {
    location.reload() //carga de nuevo la URL actual, como lo hace el boton de Refresh de los navegadores.
}


//creacion de una funcion que pinta en el navegador el popup de game over. También he incluido el eventListener para recargar la página
function drawGameOverBoard() {
    document.querySelector('.body_container').style.backgroundColor = '#515541';
    document.querySelector('.game__board').style.opacity = '0.3';
    document.querySelector('.next-tetro__board').style.opacity = '0.3';
    document.querySelector('.logo__container').style.opacity = '0.1';
    document.querySelector('.buttonMusic_container').style.opacity = '0.1';
    const gameOverDiv = document.createElement('div');
    gameOverDiv.classList.add('gameOverDiv');
    // gameOverDiv.textContent = 'GAME OVER';
    const gameOverH1 = document.createElement('h1');
    gameOverH1.textContent = 'GAME OVER!';
    gameOverDiv.appendChild(gameOverH1);
    const gameOverButton = document.createElement('button');
    gameOverButton.classList.add('gameOverButton');
    gameOverButton.textContent = 'RESTART';
    const gameOverScoreDiv = document.createElement('div');
    gameOverScoreDiv.classList.add('gameOverDiv__gameOverScoreDiv');
    const gameOverScore = document.createElement('p');
    gameOverScore.textContent = `SCORE:${SCORE}`;
    gameOverScore.classList.add('gameOverDiv__score');
    document.body.appendChild(gameOverDiv);
    gameOverDiv.appendChild(gameOverScoreDiv);
    gameOverDiv.appendChild(gameOverButton);
    gameOverScoreDiv.appendChild(gameOverScore);
    gameOverButton.addEventListener('click', reStart)

}

// Esta función nos devolverá true si se cumple la condición de Game Over
function isGameOver() {
    if (currentTetromino.some(i => BOARD[currentPosition + i + BOARD_WIDTH].classList.contains('taken')) && currentPosition <= BOARD_WIDTH * 2) {
        return true
    }
}

// Esta función se encarga de ejecutar las acciones necesarias una vez la función isGameOver sea true
function gameOver() {
    if (isGameOver()) {
        clearInterval(TIMER);
        // quito el sonido del tema principal
        audio.pause();
        audio.currentTime = 0;

        // incluyo el sonido del game over
        const gameOver_sound = new Audio("music/samples_gameover.mp3");
        gameOver_sound.play();
        drawGameOverBoard();
    }
}