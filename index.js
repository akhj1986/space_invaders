const initCanvas = (function() {
  const ctx = document.getElementById("gamespace").getContext("2d");
  const cH = ctx.canvas.height;
  const cW = ctx.canvas.width;

  //  Background stars ------------------------------------------------------------------------------------------------

  const stars = [];

  function addStar() {
    const x = Math.floor(Math.random() * cW + 1);
    const y = Math.floor(Math.random() * cH);
    const s = Math.floor(Math.random() * 10 + 1);
    if (stars.length < 1000) {
      stars.push({ x: x, y: y, s: s });
    }
  }
  function spaceFly(clr) {
    addStar();
    addStar();
    addStar();
    addStar();
    addStar();

    for (i = 0; i < stars.length; i++) {
      ctx.fillStyle = clr;
      ctx.beginPath();
      //arc(x, y, radius, start-angle, endAngle, anticlockwise)
      ctx.arc(
        stars[i].x,
        (stars[i].y += stars[i].s * 0.03),
        stars[i].s * 0.09,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
      if (stars[i].y > cH) {
        stars.splice(i, 1);
      }
      document.getElementById("stars").innerHTML = "Star count:" + stars.length;
    }
  }

  // Enemy objects ------------------------------------------------------------------------------------------------------

  const colors = ["#134b06", "#7c8f00", "#5d002c", "#81625d"];
  let speed = 0.3;
  let enemyWidth = 43;
  let enemyColumns = 9;
  const xDeterminer =
    (cW - enemyColumns * enemyWidth) / (enemyColumns + 1) / cW;
  const xAdd = xDeterminer + enemyWidth / cW;
  const enemiesTemplate = [];
  enemiesTemplate.push(
    { x: 0, y: -10 },
    { x: 1, y: -10 },
    { x: 2, y: -10 },
    { x: 3, y: -10 },
    { x: 4, y: -10 },
    { x: 5, y: -10 },
    { x: 6, y: -10 },
    { x: 7, y: -10 },
    { x: 8, y: -10 }
  );

 
  let enemies = [];

  // let boss = [];
  // function createBoss() {
  //   boss = [
  //     {
  //       w: 80,
  //       h: 100,
  //       x: cW / 2 + 40,
  //       y: -200,
  //       health: 20
  //     }
  //   ];
  // }

  function bossRender() {
    let y = boss.y;
    fillStyle = "red";
    ctx.fillRect(200, (y += speed), boss[0].w, boss[0].h);
    console.log("hello", boss[0].x);
  }

  function createEnemies() {
    enemies = enemiesTemplate.map(obj => ({
      x: cW * (xDeterminer + xAdd * obj.x),
      y: obj.y,
      w: enemyWidth,
      h: 15,
      clr: colors[Math.floor(Math.random() * colors.length)]
    }));
  }

  function Enemies(level) {
    for (var i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      ctx.fillStyle = e.clr;
      ctx.fillRect(e.x, (e.y += speed), e.w, e.h);
      if (e.y >= cH) {
        lose(level);
      }
    }
  }

  // player object and render -----------------------------------------------------------------------------------------

  const playerOne = { x: cW * 0.5, y: cH - 40, w: 40, h: 20, dir: "" };
  function playerRender(level) {
    p = playerOne;
    ctx.fillStyle = "#3e6f9d";
    ctx.fillRect(p.x, p.y, p.w, p.h);
    if (p.dir === "left" && p.x > -20) {
      p.x -= 10;
    }
    if (p.dir === "right" && p.x < cW - 20) {
      p.x += 10;
    }
    if (p.dir === "up" && p.y > -10) {
      p.y -= 5;
    }
    if (p.dir === "down" && p.y < cH - 10) {
      p.y += 5;
    }
    crashDetect(p.x, p.y, p.w, p.h, level);
  }

  // missile shot detection and projection ----------------------------------------------------------------------------

  let missiles = [];
  let shots = 0;
  let score = 0;

  function Missile(level) {
    for (var i = 0; i < missiles.length; i++) {
      const m = missiles[i];
      ctx.fillStyle = "#ff5a00";
      ctx.fillRect(m.x, (m.y -= 8), m.w, m.h);
      if (m.y < 0) {
        missiles.splice(i, 1);
      }
      hitDetect(missiles[i], i, level);
    }
  }

  function hitDetect(m, mi, level) {
    for (var i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      const eT = enemiesTemplate[i];
      if (
        m.x + m.w >= e.x &&
        m.x < e.x + e.w &&
        m.y + m.h >= e.y &&
        m.y < e.y + e.h
      ) {
        missiles.splice(mi, 1);
        enemies.splice(i, 1);
        enemiesTemplate.splice(i, 1);
        score += Math.round(10 - 0.025 * e.y);
        document.getElementById("score").innerHTML = "Score: " + score;
      }
      if (enemies.length === 0 && boss.length === 0) {
        win(level);
      }
    }
  }

  // crash detection and explosion ---------------------------------------------------------------------------------------

  function crashDetect(x, y, w, h, level) {
    for (var i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (
        x + w - 3 >= e.x &&
        x + 3 < e.x + e.w &&
        y + h - 3 >= e.y &&
        y + 3 < e.y + e.h
      ) {
        explosion(x + w * 0.5, y + h * 0.5);
        lose(level);
      }
    }
  }

  const negPos = [-1, 1];
  const shrapnel = [];
  const fireColor = [
    "rgba(255, 203, 5, 1)",
    "rgba(211, 84, 0, .9)",
    "rgba(248, 148, 6, 1)",
    "rgba(255, 203, 5, 1)",
    "rgba(242, 38, 19, 1)",
    "rgba(207, 0, 15, 1)"
  ];

  function makeShrapnel(x, y) {
    shrapnel.push({
      x: x,
      y: y,
      r: Math.random() * 3 + 1,
      xD: Math.random() * negPos[Math.floor(Math.random() * negPos.length)],
      yD: Math.random() * negPos[Math.floor(Math.random() * negPos.length)],
      clr: fireColor[Math.floor(Math.random() * fireColor.length + 0.1)]
    });
  }

  function explosion(x, y) {
    function explode() {
      makeShrapnel(x, y);
      makeShrapnel(x, y);
      makeShrapnel(x, y);
      makeShrapnel(x, y);
      for (var i = 0; i < shrapnel.length; i++) {
        const s = shrapnel[i];
        ctx.fillStyle = s.clr;
        ctx.beginPath();
        ctx.arc((s.x += s.xD), (s.y += s.yD), s.r * 0.3, 0, Math.PI * 2, false);
        ctx.fill();
        if (s.x < 0) {
          shrapnel.splice(i, 1);
        }
        if (s.x > cW) {
          shrapnel.splice(i, 1);
        }
        if (s.y < 0) {
          shrapnel.splice(i, 1);
        }
        if (s.y > cH) {
          shrapnel.splice(i, 1);
        }
      }
    }

    setInterval(explode, 5);
  }

  // animation functions -----------------------------------------------------------------------------------------------
  function animate(colour, level) {
    ctx.clearRect(0, 0, cW, cH);
    spaceFly(colour);
    playerRender(level);
    Missile(level);
    Enemies(level);
    bossRender();
  }

  let starColor = "rgba(255,255,255,0.75";
  let levelDeterminer = "one";

  const animateInit = setInterval(
    () => animate(starColor, levelDeterminer),
    30
  );

  let animateInitTwo = "";
  let animateInitThree = "";
  let animateInitFour = "";
  let animateInitFive = "";
  let animateInitSix = "";
  let animateInitSeven = "";
  let animateInitEight = "";
  let animateInitNine = "";
  let animateInitTen = "";

  // Movement controls ------------------------------------------------------------------------------------------------

  document.addEventListener("keyup", function(event) {
    let keyStop = event.keyCode;
    if (keyStop !== 32) {
      playerOne.dir = "";
    }
    if (keyStop === 32) {
      missiles.push({
        x: playerOne.x + playerOne.w * 0.5,
        y: playerOne.y,
        w: 3,
        h: 7
      });
      shots = shots + 1;
      document.getElementById("missiles").innerHTML =
        "Total missiles fired: " + shots;
    }
  });

  document.addEventListener("keydown", function(event) {
    const keyNum = event.keyCode;
    if (keyNum === 37) {
      playerOne.dir = "left";
    }

    if (keyNum === 39) {
      playerOne.dir = "right";
    }

    if (keyNum === 38) {
      playerOne.dir = "up";
    }
    if (keyNum === 40) {
      playerOne.dir = "down";
    }
  });

  window.addEventListener("load", createEnemies());

  // lose and win functions -------------------------------------------------------------------------------------------

  function lose(level) {
    if (level === "one") {
      clearInterval(animateInit);
    }
    if (level === "two") {
      clearInterval(animateInitTwo);
    }
    if (level === "three") {
      clearInterval(animateInitThree);
    }
    if (level === "four") {
      clearInterval(animateInitFour);
    }
    if (level === "five") {
      clearInterval(animateInitFive);
    }
    if (level === "six") {
      clearInterval(animateInitSix);
    }
    if (level === "seven") {
      clearInterval(animateInitSeven);
    }
    if (level === "eight") {
      clearInterval(animateInitEight);
    }
    if (level === "nine") {
      clearInterval(animateInitNine);
    }
    if (level === "ten") {
      clearInterval(animateInitTen);
    }
    ctx.fillStyle = "red";
    ctx.font = "bold 60px Arial, sans serif";
    ctx.fillText("You lose!", cW * 0.2, cH * 0.3, 400);
    ctx.fillStyle = "white";
    ctx.font = "bold 40px Arial, sans serif";
    ctx.fillText(`You scored ${score} points`, cW * 0.2, cH * 0.45);
    ctx.fillStyle = "blue";
    ctx.font = "bold 30px Arial, sans serif";
    ctx.fillText("Press enter to continue", cW * 0.2, cH * 0.55, 400);

    document.addEventListener("keydown", function(event) {
      const key = event.keyCode;
      if (key === 13) {
        window.open("index.html", "_self");
      }
    });
  }

  function win(level) {
    ctx.font = "bold 40px Arial, sans serif";
    ctx.fillStyle = "red";
    ctx.fillText(`Level ${level} complete!`, cW * 0.5 - 200, cH * 0.4, 400);
    ctx.fillStyle = "blue";
    ctx.font = "bold 30px Arial, sans serif";
    ctx.fillText("Press enter to continue", cW * 0.5 - 200, cH * 0.6, 400);
    missiles.splice(0, missiles.length);

    // level Two initialisation --------------------------------------------------------------------------------------

    if (level === "one") {
      clearInterval(animateInit);
      levelDeterminer = "two";
      speed += 0.05;
      document.addEventListener("keydown", function(event) {
        const key = event.keyCode;
        if (key === 13 && levelDeterminer === "two") {
          enemiesTemplate.push(
            { x: 0, y: -10 },
            { x: 1, y: -10 },
            { x: 2, y: -10 },
            { x: 3, y: -10 },
            { x: 4, y: -10 },
            { x: 5, y: -10 },
            { x: 6, y: -10 },
            { x: 7, y: -10 },
            { x: 8, y: -10 },
            { x: 0, y: -40 },
            { x: 1, y: -40 },
            { x: 2, y: -40 },
            { x: 3, y: -40 },
            { x: 4, y: -40 },
            { x: 5, y: -40 },
            { x: 6, y: -40 },
            { x: 7, y: -40 },
            { x: 8, y: -40 }
          );
          animateInitTwo = setInterval(
            () => animate(starColor, levelDeterminer),
            30
          );
          createEnemies();
          createBoss();
        }
      });
    }

    // level Three initialisation ---------------------------------------------------------------------------------------

    if (level === "two") {
      clearInterval(animateInitTwo);
      levelDeterminer = "three";
      speed += 0.05;
      document.addEventListener("keydown", function(event) {
        const key = event.keyCode;
        if (key === 13 && levelDeterminer === "three") {
          enemiesTemplate.push(
            { x: 0, y: -10 },
            { x: 1, y: -10 },
            { x: 2, y: -10 },
            { x: 3, y: -10 },
            { x: 4, y: -10 },
            { x: 5, y: -10 },
            { x: 6, y: -10 },
            { x: 7, y: -10 },
            { x: 8, y: -10 },
            { x: 0, y: -40 },
            { x: 1, y: -40 },
            { x: 2, y: -40 },
            { x: 3, y: -40 },
            { x: 4, y: -40 },
            { x: 5, y: -40 },
            { x: 6, y: -40 },
            { x: 7, y: -40 },
            { x: 8, y: -40 },
            { x: 0, y: -70 },
            { x: 1, y: -70 },
            { x: 2, y: -70 },
            { x: 3, y: -70 },
            { x: 4, y: -70 },
            { x: 5, y: -70 },
            { x: 6, y: -70 },
            { x: 7, y: -70 },
            { x: 8, y: -70 },
            { x: 0, y: -100 },
            { x: 1, y: -100 },
            { x: 2, y: -100 },
            { x: 3, y: -100 },
            { x: 4, y: -100 },
            { x: 5, y: -100 },
            { x: 6, y: -100 },
            { x: 7, y: -100 },
            { x: 8, y: -100 }
          );
          animateInitThree = setInterval(
            () => animate(starColor, levelDeterminer),
            30
          );
          createEnemies();
        }
      });
    }

    // level Four initialisation ----------------------------------------------------------------------------------------
    if (level === "three") {
      clearInterval(animateInitThree);
      levelDeterminer = "four";
      speed += 0.05;
      document.addEventListener("keydown", function(event) {
        const key = event.keyCode;
        if (key === 13 && levelDeterminer === "four") {
          enemiesTemplate.push(
            { x: 0, y: -10 },
            { x: 1, y: -10 },
            { x: 2, y: -10 },
            { x: 3, y: -10 },
            { x: 4, y: -10 },
            { x: 5, y: -10 },
            { x: 6, y: -10 },
            { x: 7, y: -10 },
            { x: 8, y: -10 },
            { x: 0, y: -40 },
            { x: 1, y: -40 },
            { x: 2, y: -40 },
            { x: 3, y: -40 },
            { x: 4, y: -40 },
            { x: 5, y: -40 },
            { x: 6, y: -40 },
            { x: 7, y: -40 },
            { x: 8, y: -40 },
            { x: 0, y: -70 },
            { x: 1, y: -70 },
            { x: 2, y: -70 },
            { x: 3, y: -70 },
            { x: 4, y: -70 },
            { x: 5, y: -70 },
            { x: 6, y: -70 },
            { x: 7, y: -70 },
            { x: 8, y: -70 },
            { x: 0, y: -130 },
            { x: 1, y: -130 },
            { x: 2, y: -130 },
            { x: 3, y: -130 },
            { x: 4, y: -130 },
            { x: 5, y: -130 },
            { x: 6, y: -130 },
            { x: 7, y: -130 },
            { x: 8, y: -130 },
            { x: 0, y: -160 },
            { x: 1, y: -160 },
            { x: 2, y: -160 },
            { x: 3, y: -160 },
            { x: 4, y: -160 },
            { x: 5, y: -160 },
            { x: 6, y: -160 },
            { x: 7, y: -160 },
            { x: 8, y: -160 }
          );
          animateInitFour = setInterval(
            () => animate(starColor, levelDeterminer),
            30
          );
          createEnemies();
        }
      });
    }

    // level Five initialisation ----------------------------------------------------------------------------------------

    if (level === "four") {
      clearInterval(animateInitFour);
      levelDeterminer = "five";
      speed += 0.05;
      document.addEventListener("keydown", function(event) {
        const key = event.keyCode;
        if (key === 13 && levelDeterminer === "five") {
          enemiesTemplate.push(
            { x: 0, y: -10 },
            { x: 1, y: -10 },
            { x: 2, y: -10 },
            { x: 3, y: -10 },
            { x: 4, y: -10 },
            { x: 5, y: -10 },
            { x: 6, y: -10 },
            { x: 7, y: -10 },
            { x: 8, y: -10 },
            { x: 0, y: -40 },
            { x: 1, y: -40 },
            { x: 2, y: -40 },
            { x: 3, y: -40 },
            { x: 4, y: -40 },
            { x: 5, y: -40 },
            { x: 6, y: -40 },
            { x: 7, y: -40 },
            { x: 8, y: -40 },
            { x: 0, y: -70 },
            { x: 1, y: -70 },
            { x: 2, y: -70 },
            { x: 3, y: -70 },
            { x: 4, y: -70 },
            { x: 5, y: -70 },
            { x: 6, y: -70 },
            { x: 7, y: -70 },
            { x: 8, y: -70 },
            { x: 0, y: -130 },
            { x: 1, y: -130 },
            { x: 2, y: -130 },
            { x: 3, y: -130 },
            { x: 4, y: -130 },
            { x: 5, y: -130 },
            { x: 6, y: -130 },
            { x: 7, y: -130 },
            { x: 8, y: -130 },
            { x: 0, y: -160 },
            { x: 1, y: -160 },
            { x: 2, y: -160 },
            { x: 3, y: -160 },
            { x: 4, y: -160 },
            { x: 5, y: -160 },
            { x: 6, y: -160 },
            { x: 7, y: -160 },
            { x: 8, y: -160 },
            { x: 0, y: -190 },
            { x: 1, y: -190 },
            { x: 2, y: -190 },
            { x: 3, y: -190 },
            { x: 4, y: -190 },
            { x: 5, y: -190 },
            { x: 6, y: -190 },
            { x: 7, y: -190 },
            { x: 8, y: -190 }
          );
          animateInitFive = setInterval(
            () => animate(starColor, levelDeterminer),
            30
          );
          createEnemies();
        }
      });
    }

    // level Six initialisation ----------------------------------------------------------------------------------------

    if (level === "five") {
      clearInterval(animateInitFive);
      levelDeterminer = "six";
      speed += 0.05;
      starColor = "rgba(207, 0, 15, 0.75)";
      document.addEventListener("keydown", function(event) {
        const key = event.keyCode;
        if (key === 13 && levelDeterminer === "six") {
          enemiesTemplate.push(
            { x: 0, y: -10 },
            { x: 1, y: -10 },
            { x: 2, y: -10 },
            { x: 3, y: -10 },
            { x: 4, y: -10 },
            { x: 5, y: -10 },
            { x: 6, y: -10 },
            { x: 7, y: -10 },
            { x: 8, y: -10 },
            { x: 0, y: -40 },
            { x: 1, y: -40 },
            { x: 2, y: -40 },
            { x: 3, y: -40 },
            { x: 4, y: -40 },
            { x: 5, y: -40 },
            { x: 6, y: -40 },
            { x: 7, y: -40 },
            { x: 8, y: -40 },
            { x: 0, y: -70 },
            { x: 1, y: -70 },
            { x: 2, y: -70 },
            { x: 3, y: -70 },
            { x: 4, y: -70 },
            { x: 5, y: -70 },
            { x: 6, y: -70 },
            { x: 7, y: -70 },
            { x: 8, y: -70 },
            { x: 0, y: -130 },
            { x: 1, y: -130 },
            { x: 2, y: -130 },
            { x: 3, y: -130 },
            { x: 4, y: -130 },
            { x: 5, y: -130 },
            { x: 6, y: -130 },
            { x: 7, y: -130 },
            { x: 8, y: -130 },
            { x: 0, y: -160 },
            { x: 1, y: -160 },
            { x: 2, y: -160 },
            { x: 3, y: -160 },
            { x: 4, y: -160 },
            { x: 5, y: -160 },
            { x: 6, y: -160 },
            { x: 7, y: -160 },
            { x: 8, y: -160 },
            { x: 0, y: -190 },
            { x: 1, y: -190 },
            { x: 2, y: -190 },
            { x: 3, y: -190 },
            { x: 4, y: -190 },
            { x: 5, y: -190 },
            { x: 6, y: -190 },
            { x: 7, y: -190 },
            { x: 8, y: -190 }
          );
          animateInitSix = setInterval(
            () => animate(starColor, levelDeterminer),
            30
          );
          createEnemies();
        }
      });
    }

    // level Seven initialisation ---------------------------------------------------------------------------------------

    if (level === "six") {
      clearInterval(animateInitSix);
      levelDeterminer = "seven";
      speed += 0.05;
      document.addEventListener("keydown", function(event) {
        const key = event.keyCode;
        if (key === 13 && levelDeterminer === "seven") {
          enemiesTemplate.push(
            { x: 0, y: -10 },
            { x: 1, y: -10 },
            { x: 2, y: -10 },
            { x: 3, y: -10 },
            { x: 4, y: -10 },
            { x: 5, y: -10 },
            { x: 6, y: -10 },
            { x: 7, y: -10 },
            { x: 8, y: -10 },
            { x: 0, y: -40 },
            { x: 1, y: -40 },
            { x: 2, y: -40 },
            { x: 3, y: -40 },
            { x: 4, y: -40 },
            { x: 5, y: -40 },
            { x: 6, y: -40 },
            { x: 7, y: -40 },
            { x: 8, y: -40 },
            { x: 0, y: -70 },
            { x: 1, y: -70 },
            { x: 2, y: -70 },
            { x: 3, y: -70 },
            { x: 4, y: -70 },
            { x: 5, y: -70 },
            { x: 6, y: -70 },
            { x: 7, y: -70 },
            { x: 8, y: -70 },
            { x: 0, y: -130 },
            { x: 1, y: -130 },
            { x: 2, y: -130 },
            { x: 3, y: -130 },
            { x: 4, y: -130 },
            { x: 5, y: -130 },
            { x: 6, y: -130 },
            { x: 7, y: -130 },
            { x: 8, y: -130 },
            { x: 0, y: -160 },
            { x: 1, y: -160 },
            { x: 2, y: -160 },
            { x: 3, y: -160 },
            { x: 4, y: -160 },
            { x: 5, y: -160 },
            { x: 6, y: -160 },
            { x: 7, y: -160 },
            { x: 8, y: -160 },
            { x: 0, y: -220 },
            { x: 1, y: -220 },
            { x: 2, y: -220 },
            { x: 3, y: -220 },
            { x: 4, y: -220 },
            { x: 5, y: -220 },
            { x: 6, y: -220 },
            { x: 7, y: -220 },
            { x: 8, y: -220 },
            { x: 0, y: -250 },
            { x: 1, y: -250 },
            { x: 2, y: -250 },
            { x: 3, y: -250 },
            { x: 4, y: -250 },
            { x: 5, y: -250 },
            { x: 6, y: -250 },
            { x: 7, y: -250 },
            { x: 8, y: -250 }
          );
          animateInitSeven = setInterval(
            () => animate(starColor, levelDeterminer),
            30
          );
          createEnemies();
        }
      });
    }

    // level Eight initialisation ----------------------------------------------------------------------------------------

    if (level === "seven") {
      clearInterval(animateInitSeven);
      levelDeterminer = "eight";
      speed += 0.05;
      document.addEventListener("keydown", function(event) {
        const key = event.keyCode;
        if (key === 13 && levelDeterminer === "eight") {
          enemiesTemplate.push(
            { x: 0, y: -10 },
            { x: 1, y: -10 },
            { x: 2, y: -10 },
            { x: 3, y: -10 },
            { x: 4, y: -10 },
            { x: 5, y: -10 },
            { x: 6, y: -10 },
            { x: 7, y: -10 },
            { x: 8, y: -10 },
            { x: 0, y: -40 },
            { x: 1, y: -40 },
            { x: 2, y: -40 },
            { x: 3, y: -40 },
            { x: 4, y: -40 },
            { x: 5, y: -40 },
            { x: 6, y: -40 },
            { x: 7, y: -40 },
            { x: 8, y: -40 },
            { x: 0, y: -70 },
            { x: 1, y: -70 },
            { x: 2, y: -70 },
            { x: 3, y: -70 },
            { x: 4, y: -70 },
            { x: 5, y: -70 },
            { x: 6, y: -70 },
            { x: 7, y: -70 },
            { x: 8, y: -70 },
            { x: 0, y: -100 },
            { x: 1, y: -100 },
            { x: 2, y: -100 },
            { x: 3, y: -100 },
            { x: 4, y: -100 },
            { x: 5, y: -100 },
            { x: 6, y: -100 },
            { x: 7, y: -100 },
            { x: 8, y: -100 },
            { x: 0, y: -130 },
            { x: 1, y: -130 },
            { x: 2, y: -130 },
            { x: 3, y: -130 },
            { x: 4, y: -130 },
            { x: 5, y: -130 },
            { x: 6, y: -130 },
            { x: 7, y: -130 },
            { x: 8, y: -130 },
            { x: 0, y: -160 },
            { x: 1, y: -160 },
            { x: 2, y: -160 },
            { x: 3, y: -160 },
            { x: 4, y: -160 },
            { x: 5, y: -160 },
            { x: 6, y: -160 },
            { x: 7, y: -160 },
            { x: 8, y: -160 },
            { x: 0, y: -190 },
            { x: 1, y: -190 },
            { x: 2, y: -190 },
            { x: 3, y: -190 },
            { x: 4, y: -190 },
            { x: 5, y: -190 },
            { x: 6, y: -190 },
            { x: 7, y: -190 },
            { x: 8, y: -190 }
          );
          animateInitEight = setInterval(
            () => animate(starColor, levelDeterminer),
            30
          );
          createEnemies();
        }
      });
    }

    // level Nine initialisation -----------------------------------------------------------------------------------------

    if (level === "eight") {
      clearInterval(animateInitEight);
      levelDeterminer = "nine";
      speed += 0.05;
      document.addEventListener("keydown", function(event) {
        const key = event.keyCode;
        if (key === 13 && levelDeterminer === "nine") {
          enemiesTemplate.push(
            { x: 0, y: -10 },
            { x: 1, y: -10 },
            { x: 2, y: -10 },
            { x: 3, y: -10 },
            { x: 4, y: -10 },
            { x: 5, y: -10 },
            { x: 6, y: -10 },
            { x: 7, y: -10 },
            { x: 8, y: -10 },
            { x: 0, y: -40 },
            { x: 1, y: -40 },
            { x: 2, y: -40 },
            { x: 3, y: -40 },
            { x: 4, y: -40 },
            { x: 5, y: -40 },
            { x: 6, y: -40 },
            { x: 7, y: -40 },
            { x: 8, y: -40 },
            { x: 0, y: -70 },
            { x: 1, y: -70 },
            { x: 2, y: -70 },
            { x: 3, y: -70 },
            { x: 4, y: -70 },
            { x: 5, y: -70 },
            { x: 6, y: -70 },
            { x: 7, y: -70 },
            { x: 8, y: -70 },
            { x: 0, y: -100 },
            { x: 1, y: -100 },
            { x: 2, y: -100 },
            { x: 3, y: -100 },
            { x: 4, y: -100 },
            { x: 5, y: -100 },
            { x: 6, y: -100 },
            { x: 7, y: -100 },
            { x: 8, y: -100 },
            { x: 0, y: -130 },
            { x: 1, y: -130 },
            { x: 2, y: -130 },
            { x: 3, y: -130 },
            { x: 4, y: -130 },
            { x: 5, y: -130 },
            { x: 6, y: -130 },
            { x: 7, y: -130 },
            { x: 8, y: -130 },
            { x: 0, y: -160 },
            { x: 1, y: -160 },
            { x: 2, y: -160 },
            { x: 3, y: -160 },
            { x: 4, y: -160 },
            { x: 5, y: -160 },
            { x: 6, y: -160 },
            { x: 7, y: -160 },
            { x: 8, y: -160 },
            { x: 0, y: -190 },
            { x: 1, y: -190 },
            { x: 2, y: -190 },
            { x: 3, y: -190 },
            { x: 4, y: -190 },
            { x: 5, y: -190 },
            { x: 6, y: -190 },
            { x: 7, y: -190 },
            { x: 8, y: -190 },
            { x: 0, y: -220 },
            { x: 1, y: -220 },
            { x: 2, y: -220 },
            { x: 3, y: -220 },
            { x: 4, y: -220 },
            { x: 5, y: -220 },
            { x: 6, y: -220 },
            { x: 7, y: -220 },
            { x: 8, y: -220 }
          );
          animateInitNine = setInterval(
            () => animate(starColor, levelDeterminer),
            30
          );
          createEnemies();
        }
      });
    }

    // level Ten initialisation -----------------------------------------------------------------------------------------

    if (level === "nine") {
      clearInterval(animateInitNine);
      levelDeterminer = "ten";
      speed += 0.05;
      document.addEventListener("keydown", function(event) {
        const key = event.keyCode;
        if (key === 13 && levelDeterminer === "ten") {
          enemiesTemplate.push(
            { x: 0, y: -10 },
            { x: 1, y: -10 },
            { x: 2, y: -10 },
            { x: 3, y: -10 },
            { x: 4, y: -10 },
            { x: 5, y: -10 },
            { x: 6, y: -10 },
            { x: 7, y: -10 },
            { x: 8, y: -10 },
            { x: 0, y: -40 },
            { x: 1, y: -40 },
            { x: 2, y: -40 },
            { x: 3, y: -40 },
            { x: 4, y: -40 },
            { x: 5, y: -40 },
            { x: 6, y: -40 },
            { x: 7, y: -40 },
            { x: 8, y: -40 },
            { x: 0, y: -70 },
            { x: 1, y: -70 },
            { x: 2, y: -70 },
            { x: 3, y: -70 },
            { x: 4, y: -70 },
            { x: 5, y: -70 },
            { x: 6, y: -70 },
            { x: 7, y: -70 },
            { x: 8, y: -70 },
            { x: 0, y: -12 },
            { x: 1, y: -12 },
            { x: 2, y: -12 },
            { x: 3, y: -12 },
            { x: 4, y: -12 },
            { x: 5, y: -12 },
            { x: 6, y: -12 },
            { x: 7, y: -12 },
            { x: 8, y: -12 },
            { x: 0, y: -42 },
            { x: 1, y: -42 },
            { x: 2, y: -42 },
            { x: 3, y: -42 },
            { x: 4, y: -42 },
            { x: 5, y: -42 },
            { x: 6, y: -42 },
            { x: 7, y: -42 },
            { x: 8, y: -42 },
            { x: 0, y: -72 },
            { x: 1, y: -72 },
            { x: 2, y: -72 },
            { x: 3, y: -72 },
            { x: 4, y: -72 },
            { x: 5, y: -72 },
            { x: 6, y: -72 },
            { x: 7, y: -72 },
            { x: 8, y: -72 },
            { x: 0, y: -44 },
            { x: 1, y: -44 },
            { x: 2, y: -44 },
            { x: 3, y: -44 },
            { x: 4, y: -44 },
            { x: 5, y: -44 },
            { x: 6, y: -44 },
            { x: 7, y: -44 },
            { x: 8, y: -44 },
            { x: 0, y: -74 },
            { x: 1, y: -74 },
            { x: 2, y: -74 },
            { x: 3, y: -74 },
            { x: 4, y: -74 },
            { x: 5, y: -74 },
            { x: 6, y: -74 },
            { x: 7, y: -74 },
            { x: 8, y: -74 },
            { x: 0, y: -73 },
            { x: 1, y: -73 },
            { x: 2, y: -73 },
            { x: 3, y: -73 },
            { x: 4, y: -73 },
            { x: 5, y: -73 },
            { x: 6, y: -73 },
            { x: 7, y: -73 },
            { x: 8, y: -73 }
          );
          animateInitTen = setInterval(
            () => animate(starColor, levelDeterminer),
            30
          );
          createEnemies();
        }
      });
    }

    // Game end ------------------------------------------------------------------------------------------------------

    if (level === "Ten") {
      clearInterval(animateInitTen);
      levelDeterminer = "win";
      document.addEventListener("keydown", function(event) {
        const key = event.keyCode;
        if (key === 13 && levelDeterminer === "win") {
          ctx.clearRect(0, 0, cW, cH);
          ctx.fillText(
            "You are victorious! Congratulations!",
            cW * 0.5 - 200,
            cH * 0.4,
            400
          );
        }
      });
    }
  }

  return {
    animateInit
  };
})();
