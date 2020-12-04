var player;
var balas = [];
var balas2 = [];
var enemigos = [];
var win = true;



//Clase Jugador
class Jugador {
    constructor(width, height, x, y, velX, fill) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.fill = fill;


        //Crear representacion en pantalla
        this.VistaPlayer = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.VistaPlayer.setAttributeNS(null, "width", this.width);
        this.VistaPlayer.setAttributeNS(null, "height", this.height);
        this.VistaPlayer.setAttributeNS(null, "x", this.x);
        this.VistaPlayer.setAttributeNS(null, "y", this.y);
        this.VistaPlayer.setAttributeNS(null, "velX", this.velX);
        this.VistaPlayer.setAttributeNS(null, "fill", this.fill);

        document.getElementsByTagName('svg')[0].appendChild(this.VistaPlayer);
    }

    //Mueve al jugador a la izquierda
    mueveIzquierda() {
        this.x += this.velX;
        this.VistaPlayer.setAttribute("x", this.x);
    }

    ///Comprueba la colision del jugador con los bordes del SVG
    comprobarColision() {
        if (this.x <= 0) {
            this.x += 20;
        }
        if (this.x >= document.getElementById("svg").getBoundingClientRect().width - (this.width + 2)) {
            this.x -= 20;
        }
    }

    //Mueve al jugador a la derecha
    mueveDerecha() {
        this.x -= this.velX;
        this.VistaPlayer.setAttribute("x", this.x);
    }

    //Crea balas y la añade al array de balas del jugador
    disparar() {
        balas.push(new Disparo(20, 40, this.x + this.width / 2, this.y, 5, "url(#pattern2)", 1));
    }

}




//Clase Enemigo
class Enemigo {
    constructor(width, height, x, y, velX, fill) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.fill = fill;


        //Crear representacion en pantalla
        this.VistaEnemigo = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.VistaEnemigo.setAttributeNS(null, "width", this.width);
        this.VistaEnemigo.setAttributeNS(null, "height", this.height);
        this.VistaEnemigo.setAttributeNS(null, "x", this.x);
        this.VistaEnemigo.setAttributeNS(null, "y", this.y);
        this.VistaEnemigo.setAttributeNS(null, "velX", this.velX);
        this.VistaEnemigo.setAttributeNS(null, "fill", this.fill);
        document.getElementsByTagName('svg')[0].appendChild(this.VistaEnemigo);
    }

    //Mueve en el eje X a los enemigos
    movimiento() {
        this.x += this.velX;
        this.VistaEnemigo.setAttributeNS(null, "x", this.x);
    }


    //Mueve en el eje Y y comprueba que cuando estan a la altura del jugador, pierdes la partida
    bajarEjeY() {
        this.y += this.height / 2;
        this.VistaEnemigo.setAttributeNS(null, "y", this.y);
        if (this.y >= player.y) {
            perder();
        }
    }

    //Crea una bala y la añade al array de balas de los enemigos
    disparar() {
        balas2.push(new Disparo(20, 40, this.x + this.width / 2, this.y + this.height / 2, 5, "url(#pattern4)", 1));
    }
}





//Clase Disparo
class Disparo {
    constructor(width, height, x, y, velY, fill, id) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.velY = velY;
        this.fill = fill;
        this.id = id;


        //Crear representacion en pantalla
        this.VistaDisparo = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.VistaDisparo.setAttributeNS(null, "width", this.width);
        this.VistaDisparo.setAttributeNS(null, "height", this.height);
        this.VistaDisparo.setAttributeNS(null, "x", this.x);
        this.VistaDisparo.setAttributeNS(null, "y", this.y);
        this.VistaDisparo.setAttributeNS(null, "velY", this.velY);
        this.VistaDisparo.setAttributeNS(null, "fill", this.fill);
        this.VistaDisparo.setAttributeNS(null, "id", this.id);
        document.getElementsByTagName('svg')[0].appendChild(this.VistaDisparo);
    }


    //Mueve las balas del jugador
    animar1() {
        this.y -= this.velY;
        this.VistaDisparo.setAttribute("y", this.y);
    }


    //Mueve las balas de los enemigos
    animar2() {
        this.y += this.velY;
        this.VistaDisparo.setAttribute("y", this.y);
    }


    //comprueba que las balas del jugador colisiona con cada enemigo y lo elimina
    colisiona(marcianos) {
        let bool = false;
        marcianos.forEach((marciano, index) => {
            if (this.x > marciano.x && this.x < marciano.x + marciano.width) {
                if (this.y >= marciano.y && this.y < marciano.y + marciano.height) {
                    marcianos.splice(index, 1);
                    console.log(marcianos);
                    marciano.VistaEnemigo.parentNode.removeChild(marciano.VistaEnemigo);
                    bool = true;
                }
            }
        })
        return bool;
    }


    //Comprueba que las balas de los enemigos colisionan con el jugador
    colisionaPlayer() {
        if (this.x > player.x && this.x < player.x + player.width) {
            if (this.y >= player.y && this.y < player.y + player.height) {
                perder();
            }
        }
    }

}










//Onload
window.onload = () => {
    crearPlayer();
    crearEnemigo();
    setInterval(bucleJuego, 30);
    controlPlayer();

}



//Funcíon que mueve el juego
function bucleJuego() {
    moverEnemigos();
    enemigoDispara();
    moverDisparosEnemigos();
    moverDisparos();
    comprobarColisionBalas2();
    borrarBalas();
    ganar();
}









//Borra las balas tanto del jugador como del enemigo de sus respectivos arrays y de la vista
function borrarBalas() {
    balas.forEach((bala, index) => {
        if (bala.colisiona(enemigos)) {
            balas.splice(index, 1);
            bala.VistaDisparo.parentNode.removeChild(bala.VistaDisparo);
        } else {
            if (bala.y <= 0) {
                balas.splice(index, 1);
                bala.VistaDisparo.parentNode.removeChild(bala.VistaDisparo);
            }
        }
    })

    balas2.forEach((bala2, index) => {
        if (bala2.y >= document.getElementById('svg').getBoundingClientRect().height) {
            balas2.splice(index, 1);
            bala2.VistaDisparo.parentNode.removeChild(bala2.VistaDisparo);
        }
    })
}




//Funcion que crea al jugador
function crearPlayer() {
    player = new Jugador(150, 100, document.getElementById("svg").getBoundingClientRect().width / 2 - 45, 620, 20, "url(#pattern1)");
}



//Funcíon que controla al charizard
function controlPlayer() {
    let puedoDisparar = true;
    window.addEventListener("keydown", (tecla) => {
        if (tecla.key == "d" || tecla.key == "D" || tecla.key == "ArrowRight") {
            this.player.mueveIzquierda();
        }
        if (tecla.key === "a" || tecla.key == "A" || tecla.key == "ArrowLeft") {
            this.player.mueveDerecha();
        }
        if (tecla.key == " ") {
            if (puedoDisparar) {
                this.player.disparar(tecla);
                document.getElementById("audioDisparo").play();
                puedoDisparar = false;
                setTimeout(() => puedoDisparar = true, 1000);
            }
        }
        this.player.comprobarColision();
    });
}



//Funcion que crea al enemigo y moverlos
function crearEnemigo() {
    for (i = 1; i <= 15; i++) {
        enemigos.push(new Enemigo(80, 100, 50 + (i * 80), 10, 2, "url(#pattern3)"));
    }
}



//Función que hace que los enemigos disparen de forma aleatoria
function enemigoDispara() {
    let num = Math.round(Math.random() * (50 - 1) + 1);
    let numEnemigo = Math.round(Math.random() * (enemigos.length - 1));
    if (enemigos.length >= 1) {
        if (num == 5) {
            for (i = 0; i < enemigos.length; i++) {
                enemigos[numEnemigo].disparar();
            }
        }
    }
}



//Funcion que comprueba si las balas colisionan con el juagdor
function comprobarColisionBalas2() {
    balas2.forEach((bala2) => {
        bala2.colisionaPlayer();
    })

}



//Funcion que mueve a los enemigos
function moverEnemigos() {
    if (enemigos.length > 0) {
        enemigos.forEach((marciano) => {
            marciano.movimiento();
        })

        if (enemigos.length >= 1) {
            if ((enemigos[enemigos.length - 1].x + enemigos[enemigos.length - 1].width) >= document.getElementById("svg").getBoundingClientRect().width || enemigos[0].x <= 0) {
                for (i = 0; i < enemigos.length; i++) {
                    enemigos[i].velX *= -1;
                    enemigos[i].bajarEjeY();
                }
            }
        }
    }
}



//Anima las balas de charizard
function moverDisparos() {
    balas.forEach((bala) => {
        bala.animar1();
    })
}



//Anima las balas de dragonite
function moverDisparosEnemigos() {
    balas2.forEach((bala2) => {
        bala2.animar2();
    })
}



//Ganar
function ganar() {
    if (win == true) {
        if (enemigos.length == 0) {
            document.getElementById("svg").style.visibility = "hidden";
            document.body.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('../img/fondoWon.gif')";
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
            setTimeout(function(){ location.assign("menu.html"); },4000);
            document.getElementById("audioWin").play();
        }
    }
}



//Perder
function perder() {
    win = false;
    enemigos.forEach((enemigo, index) => {
        enemigos.splice(index, 1);
        enemigo.VistaEnemigo.parentNode.removeChild(enemigo.VistaEnemigo);
    })
    balas2.forEach((bala2, index) => {
        balas2.splice(index, 1);
        bala2.VistaDisparo.parentNode.removeChild(bala2.VistaDisparo);
    })
    document.getElementById("svg").style.visibility = "hidden";
    document.body.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('../img/fondoLose.gif')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    setTimeout(function(){ location.assign("menu.html"); },7000);
    document.getElementById("audioLose").play();
}