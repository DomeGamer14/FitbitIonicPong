// (c) Dominik Walch
// ToDo: Heartcore-Mode Ball Speed wird an Puls angepasst
import document from "document";
import {
    HeartRateSensor
} from "heart-rate";
import clock from "clock";
import {
    OrientationSensor
} from "orientation";
import {
    display
} from "display";


display.autoOff = false;
display.on = true;


clock.granularity = "seconds";

let pong = document.getElementById("pong");


let rect = document.getElementById("rect");
let ball = document.getElementById("ball");
let player = document.getElementById("player");
let scoretxt = document.getElementById("score");
let winorlose = document.getElementById("winorlose");
let heartratetxt = document.getElementById("heartrate");
let leftscore = document.getElementById("leftscore");
let rightscore = document.getElementById("rightscore");
let pong = document.getElementById("pong");
let restart = document.getElementById("restart");
let btnnogyro = document.getElementById("btn-no");
let btnyesgyro = document.getElementById("btn-yes");

let btnnormal = document.getElementById("normalbtn");
let btnheartcore = document.getElementById("heartcorebtn");

restart.style.visibility = "hidden";
rect.style.visibility = "hidden";
ball.style.visibility = "hidden";
player.style.visibility = "hidden";
scoretxt.style.visibility = "hidden";
winorlose.style.visibility = "hidden";
heartratetxt.style.visibility = "hidden";
rightscore.style.visibility = "hidden";
leftscore.style.visibility = "hidden";

let gameover = false;

let updown = "down";
let leftright = "right";
let ballspeedY = 0.0;
let ballspeedX = 0.0;

const watchheight = 250;
const watchwidth = 348;

const playerwidth = 50;
const balldiameter = 20;
const ballradius = 10;

const scorewidth = 70;
const heartcoremode = true;

let heartrate = 0;
let score = 0;
let didhit = false;
let random = 0;

let gyro = false;

let diagonal = (ballradius * Math.sqrt(2)).toFixed(2);
let flaeche = (ballradius * ballradius) / 2;
let flaecheuebrig = flaeche / 2;

console.log(diagonal);
console.log(flaeche);


ball.cx = 50;

restart.onclick = function(e) {
    restartGame();
}

btnnormal.onclick = function(e) {
    
    // Falls der User Gyro im Menü ausgwählt hat
    if (btnyesgyro.value == 1) {
        gyro = true;
    } else {
        gyro = false;
    }

    heartcoremode = false;

    // Alle Game UI Elemente werden sichtbar und Menü wird unsichtbar
    rect.style.visibility = "visible";
    ball.style.visibility = "visible";
    player.style.visibility = "visible";
    scoretxt.style.visibility = "visible";
    winorlose.style.visibility = "visible";
    heartratetxt.style.visibility = "hidden";
    rightscore.style.visibility = "visible";
    leftscore.style.visibility = "visible";
    btnnormal.style.visibility = "hidden";
    btnheartcore.style.visibility = "hidden";
    restart.style.visibility = "hidden";

    ballspeedY = 1.0;
    ballspeedX = 1.0;

}

btnheartcore.onclick = function(e) {

    // Falls der User Gyro im Menü ausgwählt hat
    if (btnyesgyro.value == 1) {
        gyro = true;
    } else {
        gyro = false;
    }

    heartcoremode = true;

    // Alle Game UI Elemente (inkl Heartrate) werden sichtbar und Menü wird unsichtbar
    rect.style.visibility = "visible";
    ball.style.visibility = "visible";
    player.style.visibility = "visible";
    scoretxt.style.visibility = "visible";
    winorlose.style.visibility = "visible";
    heartratetxt.style.visibility = "visible";
    rightscore.style.visibility = "visible";
    leftscore.style.visibility = "visible";
    btnnormal.style.visibility = "hidden";
    btnheartcore.style.visibility = "hidden";
    restart.style.visibility = "hidden";

    ballspeedY = 1.0;
    ballspeedX = 1.0;

}

// Falls OrientationSensor vorhanden ist
if (OrientationSensor) {
    const orientation = new OrientationSensor({
        frequency: 20
    });
    orientation.addEventListener("reading", () => {
        // Falls der User Gyro im Menü ausgwählt hat
        if (gyro) {
            // Falls Spieler zu weit links ist
            if (player.x < 0) {
                player.x = 0;
            }
            // Falls Spieler zu weit rechts ist
            else if (player.x > watchwidth - playerwidth) {
                player.x = watchwidth - playerwidth;
            }
            // Wenn alles ok ist    
            else {
                //console.log(orientation.quaternion[1]);
                // Falls User Uhr gerade hält
                if (orientation.quaternion[1] >= -0.05 && orientation.quaternion[1] <= 0.05) {
                    player.x = player.x;
                }
                //Falls User Uhr nach vorne neigt
                else if (orientation.quaternion[1] <= 0) {
                    player.x -= 6;
                }
                //Falls User Uhr nach hinten neigt
                else {
                    player.x += 6;
                }
            }
        }
    });
    orientation.start();
}


// Bewegung des Spielers
rect.onmousemove = (event) => {

    // Falls Spieler zu weit links ist
    if (event.screenX < 0) {
        player.x = 0;
    }
    // Falls Spieler zu weit rechts ist
    else if (event.screenX > watchwidth - playerwidth) {
        player.x = watchwidth - playerwidth;
    }
    // Wenn alles ok ist
    else {
        player.x = event.screenX;
    }

}


// Jede 20ms
let timerBall = setInterval(() => {
    console.log(watchheight - ball.cy)
    random = getRandomInt(10);

    // Falls Ball den Spieler trifft
    //if (ball.cy >= watchheight - balldiameter && ball.cy <= watchheight && ball.cx + ballradius >= player.x - ballradius && ball.cx - ballradius <= player.x + playerwidth + ballradius && updown == "down") {
      if (ball.cy >= watchheight - balldiameter && ball.cy <= watchheight && ball.cx + watchheight - ball.cy + ballradius >= player.x + watchheight - ball.cy + ballradius && ball.cx - ballradius <= player.x + playerwidth + ballradius && updown == "down") {

        // Falls Ball auf der rechten Seite des Spielers auftrifft
        if (ball.cx >= player.x + playerwidth / 2) {
            leftright = "right";
        }
        // Falls Ball auf der linken Seite des Spielers auftrifft
        else {
            leftright = "left";
        }

        // Updown = up und erhöhung des Speeds
        updown = "up";
        ballspeedY += 0.2;
        ballspeedX += 0.2;

        // didhit wird auf True gesetzt da getroffen wurde
        didhit = true;

    }

    // Falls Ball ganz oben ist
    if (ball.cy <= 0 + ballradius && updown == "up") {

        // Updown = down
        updown = "down";

        // Falls Ball den linken Score |ROT| trifft
        if (ball.cx >= 0 && ball.cx <= scorewidth + ballradius) {
            score++;
            scoretxt.text = "Score: " + score;
        }
        // Falls Ball den rechten Score |ROT| trifft
        else if (ball.cx <= watchwidth && ball.cx >= watchwidth - scorewidth - ballradius) {
            score++;
            scoretxt.text = "Score: " + score;
        }
    }
    // Falls Ball Richtung unten fliegt
    if (updown == "down") {
        // Ball-Speed positiv, also nach unten
        ball.cy += ballspeedY;
    }
    // Falls Ball Richtung oben fliegt
    if (updown == "up") {
        // Ball-Speed negativ, also nach oben
        ball.cy -= ballspeedY;
    }

    // Falls Ball die rechte Wand trifft
    if (ball.cx >= watchwidth - ballradius && leftright == "right") {
        leftright = "left";
    }
    // Falls Ball die linke Wand trifft
    if (ball.cx <= 0 + ballradius && leftright == "left") {
        leftright = "right";
    }
    // Falls Ball richtung links fliegt
    if (leftright == "left") {
        // Ball-Speed negativ, also nach links
        ball.cx -= ballspeedX + ballspeedX * (random / 5);
    }
    // Falls Ball richtung rechts fliegt
    if (leftright == "right") {
        // Ball Speed positiv, also nach rechts
        ball.cx += ballspeedX + ballspeedX * (random / 5);
    }

    // Falls Ball unten aus der Welt fällt
    if (ball.cy >= watchheight) {
        // Farbe des Balls und Spieler auf schwarz und Text "You Lost!" erscheint
        gameover = true;
        if (gameover) {
            restart.style.visibility = "visible";
        }
        ball.style.visibility = "hidden";
        player.style.visibility = "hidden";
        winorlose.text = "You Lost!";
    }

}, 20);

// Falls Puls Sensor vorhanden ist und Heartcore Mode true ist
if (HeartRateSensor && heartcoremode) {
    // Neue Messung
    const hrm = new HeartRateSensor();
    // EventListener für Herzschlag
    hrm.addEventListener("reading", () => {
        if (heartcoremode) {
            heartrate = hrm.heartRate;
            heartratetxt.text = "Heartrate: " + heartrate;

            // Einstellen des Ballspeeds andhand des Pulses !! Aber nur wenn der Ball bereits einmal getroffen wurde
            if (didhit == true) {
                if (hrm.heartRate < 60) {
                    ballspeedY = 1.0;
                    ballspeedX = 1.0;
                } else if (hrm.heartRate < 80) {
                    ballspeedY = 1.5;
                    ballspeedX = 1.5;
                } else if (hrm.heartRate < 100) {
                    ballspeedY = 2.5;
                    ballspeedX = 2.5;
                } else if (hrm.heartRate < 120) {
                    ballspeedY = 3.5;
                    ballspeedX = 3.5;
                } else if (hrm.heartRate < 140) {
                    ballspeedY = 4.5;
                    ballspeedX = 4.5;
                } else if (hrm.heartRate < 160) {
                    ballspeedY = 6.0;
                    ballspeedX = 6.0;
                }
            }
        }
    });
    hrm.start();
}

function restartGame() {

    // Knöpfe werden reseted
    btnyesgyro.value = 0;
    btnnogyro.value = 1;

    gyro = false;

    // Gameover = false, sodass der Restart Button nicht nocheinmal erscheint
    gameover = false;

    // Ballspeed wird auf 0 gesetzt um Komplikationen zu vermeiden
    ballspeedY = 0.0;
    ballspeedX = 0.0;

    player.x = 348 / 2;
    ball.cx = 0;
    ball.cy = 0;

    score = 0;
    scoretxt.text = "Score: " + score;

    winorlose.text = "";
    pong.style.visibility = "visible";
    rect.style.visibility = "hidden";
    ball.style.visibility = "hidden";
    player.style.visibility = "hidden";
    scoretxt.style.visibility = "hidden";
    winorlose.style.visibility = "hidden";
    heartratetxt.style.visibility = "hidden";
    rightscore.style.visibility = "hidden";
    leftscore.style.visibility = "hidden";
    btnnormal.style.visibility = "visible";
    btnheartcore.style.visibility = "visible";
    restart.style.visibility = "hidden";
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}