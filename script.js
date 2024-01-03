const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

// размер клетки
const grid = 15;
// высота платформы
const paddleHeight = grid * 5;
// максимальное расстояние, на которое может подняться платформа
const maxPaddleY = canvas.height - grid - paddleHeight;
// скорость платформы
var paddleSpeed = 6;
// скорость мяча
var ballSpeed = 4;

// описание платформ
const leftPaddle = {
    x: grid * 2,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight,
    // на старте платформа не движется
    dy: 0
};
const LeftmaxPaddleY = canvas.height - grid - paddleHeight;

const rightPaddle = {
    x: canvas.width - grid * 3,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight * 2,
    dy: 0
};
const RightmaxPaddleY = canvas.height - grid - paddleHeight * 2;

// описание мяча
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: grid,
    height: grid,
    dx: ballSpeed,
    dy: -ballSpeed
};
// цвет мяча
var ballColor = "#ffffff";

// рекорд и текущие очки
var record = 0;
var count = 0

var Storage_size = localStorage.length;
if (Storage_size > 0) {
    record = localStorage.getItem('record');
} else {
    localStorage.setItem('record', 0);
}

var secret = false;
var secret_count = 0;



// проверка на пересечение объектов
function collides(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}


// главный цикл игры
function loop() {
    // очистка поля
    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    // продолжение движения платформ
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;
    // проверка выхода за границы
    if (leftPaddle.y < grid) {
        // снизу
        leftPaddle.y = grid;
    } else if (leftPaddle.y > LeftmaxPaddleY) {
        // сверху
        leftPaddle.y = LeftmaxPaddleY;
    }
    if (rightPaddle.y < grid) {
        // снизу
        rightPaddle.y = grid;
    } else if (rightPaddle.y > RightmaxPaddleY) {
        // сверху
        rightPaddle.y = RightmaxPaddleY;
    }

    context.fillStyle = 'white';

    context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // продолжение движения мяча
    ball.x += ball.dx;
    ball.y += ball.dy;
    rightPaddle.dy = ball.dy;
    // при столкновении со стеной
    if (ball.y < grid) {
        // снизу
        ball.y = grid;
        ball.dy *= -1;
    } else if (ball.y + grid > canvas.height - grid) {
        // сверху
        ball.y = canvas.height - grid * 2;
        ball.dy *= -1;
    }
    // если мяч вылетел слева или справа
    if ((ball.x < 0 || ball.x > canvas.width) && !ball.resetting) {
        ball.resetting = true;
        if (count > record) {
            record = count;
            localStorage.setItem('record', record);
        }
        count = 0;
        // секунда на подготовку
        setTimeout(() => {
            ball.resetting = false;
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
        }, 1000);
        secret = false;
    }

    // стокновения мяча с платформами
    if (collides(ball, leftPaddle)) {
        ball.dx *= -1;
        ball.x = leftPaddle.x + leftPaddle.width;
        count++;
        if (count >= 10) {
            secret = true;
            if (secret) {
                secret_count += 1;
                if (secret_count % 3 == 0) {
                    if (ball.dx > 0) {ball.dx++;} else {ball.dx--;}
                    if (ball.dy > 0) {ball.dy++;} else {ball.dy--;}
                    ballColor = '#' + (Math.random().toString(16) + "000000").substring(2,8).toUpperCase();
                }
            }
        }
        console.log(ball.dx);
    } else if (collides(ball, rightPaddle)) {
        ball.dx *= -1;
        ball.x = rightPaddle.x - ball.width;
    }

    // рисуем мяч
    context.fillStyle = ballColor;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
    // стены
    context.fillStyle = 'lightgrey';
    context.fillRect(0, 0, canvas.width, grid);
    context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);

    // сетка в середине
    for (let i = grid; i < canvas.height - grid; i += grid * 2) {
        context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
    }

    document.addEventListener('keydown', function(e) {
        if (e.which === 87) {
            leftPaddle.dy = -paddleSpeed;
        } else if (e.which === 83) {
            leftPaddle.dy = paddleSpeed;
        }
    });
    document.addEventListener('keyup', function(e) {
        if (e.which === 87 || e.which === 83) {
            leftPaddle.dy = 0;
        }
    });

    context.fillStyle = "#ff0000";
    context.font = "20pt monospace";
    context.fillText("Рекорд: " + record, 150, 550);
    context.fillText(count, 450, 550);
}


// начало игры
// или loop();
requestAnimationFrame(loop);