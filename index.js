
var player;
var balas = [];
var balas2 = [];
var enemigos = [];



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
        this.player = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.player.setAttributeNS(null, "width", this.width);
        this.player.setAttributeNS(null, "height", this.height);
        this.player.setAttributeNS(null, "x", this.x);
        this.player.setAttributeNS(null, "y", this.y);
        this.player.setAttributeNS(null, "velX", this.velX);
        this.player.setAttributeNS(null, "fill", this.fill);

        document.getElementsByTagName('svg')[0].appendChild(this.player);
    }

    
    mueveIzquierda() {
        this.x += this.velX;
        this.player.setAttribute("x", this.x);
    }


    comprobarColision() {
        if (this.x <= 0) {
            this.x += 20;
        }
        if (this.x >= document.getElementById("svg").getBoundingClientRect().width - (this.width + 2)) {
            this.x -= 20;
        }
    }


    mueveDerecha() {
        this.x -= this.velX;
        this.player.setAttribute("x", this.x);
    }


    disparar() {
        balas.push(new Disparo(20, 40, this.x + this.width / 2, this.y, 5, "url(#pattern2)", 1));
    }


    getId() {
        return this.id;
    }
}




//Clase Enemigo
class Enemigo {
    constructor(width, height, x, y, velX, fill, id) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.fill = fill;
        this.id = id;


        //Crear representacion en pantalla
        this.enemigo = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.enemigo.setAttributeNS(null, "width", this.width);
        this.enemigo.setAttributeNS(null, "height", this.height);
        this.enemigo.setAttributeNS(null, "x", this.x);
        this.enemigo.setAttributeNS(null, "y", this.y);
        this.enemigo.setAttributeNS(null, "velX", this.velX);
        this.enemigo.setAttributeNS(null, "fill", this.fill);
        this.enemigo.setAttributeNS(null, "id", this.id);
        document.getElementsByTagName('svg')[0].appendChild(this.enemigo);
    }


    movimiento() {
        this.x += this.velX;
        this.enemigo.setAttributeNS(null, "x", this.x);
    }


    bajarEjeY() {
        this.y += this.height / 2;
        this.enemigo.setAttributeNS(null, "y", this.y);
        if(this.y>=player.y){
            perder();
        }
    }


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
        this.disparo = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.disparo.setAttributeNS(null, "width", this.width);
        this.disparo.setAttributeNS(null, "height", this.height);
        this.disparo.setAttributeNS(null, "x", this.x);
        this.disparo.setAttributeNS(null, "y", this.y);
        this.disparo.setAttributeNS(null, "velY", this.velY);
        this.disparo.setAttributeNS(null, "fill", this.fill);
        this.disparo.setAttributeNS(null, "id", this.id);
        document.getElementsByTagName('svg')[0].appendChild(this.disparo);
    }


    animar1() {
        this.y -= this.velY;
        this.disparo.setAttribute("y", this.y);
    }


    animar2() {
        this.y += this.velY;
        this.disparo.setAttribute("y", this.y);
    }


    colisiona(marcianos) {
        marcianos.forEach((marciano) => {
            if (this.x > marciano.x && this.x < marciano.x + marciano.width) {
                if (this.y >= marciano.y && this.y < marciano.y + marciano.height) {
                    marcianos.splice(marciano.id-1, 1);
                    console.log(marcianos);
                    marciano.enemigo.parentNode.removeChild(marciano.enemigo);
                }
            }
        })
    }


    colisionaPlayer() {
        if (this.x > player.x && this.x < player.x + player.width) {
            if (this.y >= player.y && this.y < player.y + player.height) {
               perder();
            }
        }
    }

}





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
    balas.forEach((bala) => {
        bala.colisiona(enemigos);
    })
    ganar();
}



//Funcion que crea al jugador
function crearPlayer() {
    player = new Jugador(150, 100, document.getElementById("svg").getBoundingClientRect().width / 2 - 45, 620, 20, "url(#pattern1)");
}



//Funcíon que controla al charizard
function controlPlayer() {
    window.addEventListener("keydown", (tecla) => {
        if (tecla.key == "d" || tecla.key == "D" || tecla.key == "ArrowRight") {
            this.player.mueveIzquierda();
        }
        if (tecla.key === "a" || tecla.key == "A" || tecla.key == "ArrowLeft") {
            this.player.mueveDerecha();
        }
        if (tecla.key == " ") {
            this.player.disparar(tecla);
        }
        this.player.comprobarColision();
    });
}



//Funcion que crea al enemigo y moverlos
function crearEnemigo() {
    for (i = 1; i <= 8; i++) {
        enemigos.push(new Enemigo(80, 100, 50 + (i * 100), 10, 2, "url(#pattern3)", i));
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
    if (enemigos.length == 0) {
        document.getElementById("svg").style.visibility = "hidden";
        document.body.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('img/fondoWon.gif')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
    }
}

//Perder
function perder(){
    // document.getElementById("svg").parentNode.removeChild(document.getElementsByTagName("rect"));
    document.getElementById("svg").style.visibility = "hidden";
    document.body.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('img/fondoLose.gif')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
}