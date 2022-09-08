let tl = gsap.timeline({ defaults: { duration: 0.5, ease: "circ.in" } });
let dogAudio = document.getElementById("dogAudio");
let duckAudio = document.getElementById("duckAudio");
let failedAudio = document.getElementById("failedAudio");
let gameAudio = document.getElementById("gameAudio");
let gameOverAudio = document.getElementById("gameOverAudio");
let shotAudio = document.getElementById("shotAudio");
let title = document.getElementById("title");
let game = document.getElementById("game");
let start = document.getElementById("start");
let restart = document.getElementById("restart");
let crosshair = document.getElementById('crosshair');
let white = document.getElementById('whiteScreen');
let finalScore = document.getElementById("finalScore");
let gameOver = document.getElementById("gameOver");
let score = document.getElementById("score");
let highScore = document.getElementById("highScore");
let record = document.getElementById("record");
let duckContainer = document.querySelector(".duckContainer");
let bullets = document.querySelectorAll(".bullet");
let bulletArr = Array.from(bullets);
let contador = 0;
let bullet = 5;

window.onload = function () {
  setTimeout(function () {
    let playPromise = title.play();
    if (playPromise !== null) {
      playPromise.catch(() => {
        title.play();
      });
    }
    tl.to(game, { filter: "brightness(1)", duration: 1 });
    tl.fromTo(
      ".dog",
      { y: "20%", opacity: 0 },
      { opacity: 1, y: 0, duration: 2 }
    );
    tl.to("#start", { display: "block", duration: 1 });
  }, 2000);
};

function empezar() {
  title.pause();
  gameAudio.play();
  start.style.animation = "none";
  tl.to("#start", { opacity: 0 });
  tl.to(".dog", { y: "20%", duration: 1 });
  tl.to(".dog", { opacity: 0 });
  tl.to(".counters", { display: "block", duration: 0.5 });
  tl.to("#bullets", { display: "flex" }, "<");
  let altScore = JSON.parse(localStorage.getItem("altscore")) || 0;
  highScore.value = "HIGH SCORE:" + altScore;
  start.style.pointerEvents = "none";
  traerPatos();
  let width = window.innerWidth;
  if(width > 1024){
    cursor();
  }


  setTimeout(finish, 45000);
}
start.addEventListener("click", empezar);

function crearPatos(array) {
  duckContainer.innerHTML = "";
  for (let index = 0; index < 10; index++) {
    array.forEach((pato) => {
      const div = `            
          <img src="${pato.imagen}" id="${pato.id}" class="duck ${pato.clase}">`;
      duckContainer.innerHTML += div;
    });
  }
  funcionesPatos();
  volar();
}

function volar() {
  let duckLeft = document.querySelectorAll(".left");
  let duckRight = document.querySelectorAll(".right");
  let ducks = document.querySelectorAll(".duck");
  let vueloLateralLeft = Math.ceil(Math.random() * -450);
  let vueloLateralRight = Math.ceil(Math.random() * 450);
  function ranDuck(aleatorio) {
    return aleatorio[Math.floor(Math.random() * aleatorio.length)];
  }
  for (i = 0; i < ducks.length; i++) {
    let duckRandomLeft = ranDuck(duckLeft);
    tl.to(duckRandomLeft, {
      y: "-1000%",
      x: vueloLateralLeft,
      duration: 1.8,
      delay: 1,
      ease: "none",
      pointerEvents: "initial",
    });
    let duckRandomRight = ranDuck(duckRight);
    tl.to(duckRandomRight, {
      y: "-1000%",
      x: vueloLateralRight,
      duration: 1.8,
      delay: 1,
      ease: "none",
      pointerEvents: "initial",
    });
    duckRandomLeft.addEventListener("click", function (e) {
      let shoted = e.target;
      shoted.src = "./resources/duckHit.png";
      tl.killTweensOf(shoted, "x,y");
      gsap.to(shoted, {
        attr: { src: "./resources/duckFall.png" },
        y: 600,
        duration: 5,
        delay: 0.5,
      });
    });
    duckRandomRight.addEventListener("click", function (e) {
      let shoted = e.target;
      shoted.src = "./resources/duckHit.png";
      tl.killTweensOf(shoted, "x,y");
      gsap.to(shoted, {
        attr: { src: "./resources/duckFall.png" },
        y: 600,
        duration: 5,
        delay: 0.5,
      });
    });
  }
  ducks.forEach((duck) => {
    duck.addEventListener(
      "click",
      function () {
        setTimeout(function(){duckAudio.play()},1000)
        contador++;
        score.value = "SCORE:" + contador;
        if (contador % 2 == 0) {
          setTimeout(function(){dogAudio.play()},1000)
          dog2 = gsap.timeline({
            repeat: 0,
          });
          dog2
            .to(".dog", { y: 0, opacity: 1, duration: 1.5, delay: 1 })
            .to(".dog", { y: "20%", opacity: 0, duration: 1.5 });
        }
      },
      { once: true }
    );
  });
  document.addEventListener("click", (e) => {
    shotAudio.play();
    ws = gsap.timeline({
      repeat: 0,
    });
    ws
      .to(whiteScreen, {opacity: 1, duration:.1,})
      .to(whiteScreen, {opacity:0})


    if (e.target.id != "right" && e.target.id != "left" && bullet > 0) {
      bullet--;
      bulletArr[bulletArr.length - 1].style.visibility = "hidden";
      bulletArr.pop();
      if (bullet === 3) {
        bl = gsap.timeline({
          repeat: -1,
        });
        bl.to(".bullet", { opacity: 0, duration: 0.4, delay: 0.5 });
      } else if (bullet == 0) {
        failedAudio.play();
        gameAudio.pause();
        tl.pause();
        bl.pause();
        ducks.forEach((d)=>{
          d.style.pointerEvents="none"
        });
        whiteScreen.style.display='none';
        shotAudio.muted="true";
        gameOverAudio.muted="true";
        crosshair.style.display="none";
        gameOver.style.display = "flex";
        finalScore.value = contador;
        let altScore = JSON.parse(localStorage.getItem("altscore")) || 0;

        if (finalScore.value > altScore) {
          record.style.visibility = "initial";
          altScore = finalScore.value;
          localStorage.setItem("altscore", altScore);
        }
      }
    }
  });
}


function funcionesPatos() {
  let duckRight = document.querySelectorAll(".right");
  let duckLeft = document.querySelectorAll(".left");
  duckRight.forEach((right) => {
    let positionDuckLeft = Math.ceil(Math.random() * 45);
    right.style.left = positionDuckLeft + "%";
  });
  duckLeft.forEach((left) => {
    let positionDuckRight = Math.ceil(Math.random() * 45);
    left.style.right = positionDuckRight + "%";
  });
}

async function traerPatos() {
  const respuesta = await fetch("./data.json");
  const data = await respuesta.json();
  crearPatos(data);
}

function finish() {
  gameOverAudio.play();
  gameAudio.pause();
  tl.pause();
  whiteScreen.style.display='none';
  shotAudio.muted="true";
  failedAudio.muted="true";
  bulletArr.forEach((e)=>{
    e.style.visibility="hidden";
  })
  let ducks = document.querySelectorAll(".duck");
  ducks.forEach((d)=>{
    d.style.pointerEvents="none"
  });
  crosshair.style.display="none";
  gameOver.style.display = "flex";
  finalScore.value = contador;
  let altScore = JSON.parse(localStorage.getItem("altscore")) || 0;

  if (finalScore.value > altScore) {
    record.style.visibility = "initial";
    altScore = finalScore.value;
    localStorage.setItem("altscore", altScore);
  }
}

function cursor(){
  crosshair.style.display="initial";
  game.style.cursor = 'none';
  window.addEventListener('mousemove', function(e){
    crosshair.style.left = e.pageX + "px";
    crosshair.style.top = e.pageY + "px";
  })
}

restart.addEventListener("click", () => {
  location.reload();
});
