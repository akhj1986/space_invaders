const initCanvas = (function() {
  const ctx = document.getElementById("gamespace").getContext("2d");
  const cH = ctx.canvas.height;
  const cW = ctx.canvas.width;

  //  Background stars
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

  // Enemy objects and movement
  const colors = ["#134b06", "#7c8f00", "#5d002c", "#81625d"];

  // const enemies = [];

  // function addEnemies(qOne, qTwo) {
  //   for (var a = 0; a < qOne; a++) {
  //     const x = (a + 1) * (cW / qOne);
  //     enemies.push({
  //       x: x,
  //       y: -10,
  //       w: 30,
  //       h: 15,
  //       clr: colors[Math.floor(Math.random() * colors.length)]
  //     });
  //     const e = enemies[a];
  //     ctx.fillStyle = e.clr;
  //     ctx.fillRect(e.x, (e.y += 0.5), e.w, e.h);
  //     if (e.y >= cH) {
  //       lose();
  //     }
  //   }
  // }

  const enemiesTemplate = [];

  const enemiesLevelOne = enemiesTemplate.push(
    { x: 0.08, y: -10 },
    { x: 0.2, y: -10 },
    { x: 0.3, y: -10 },
    { x: 0.4, y: -10 },
    { x: 0.5, y: -10 },
    { x: 0.6, y: -10 },
    { x: 0.7, y: -10 },
    { x: 0.8, y: -10 },
    { x: 0.9, y: -10 }
  );

  let enemies = [];
  function createEnemies() {
    enemies = enemiesTemplate.map(obj => ({
      x: cW * obj.x,
      y: obj.y,
      w: 30,
      h: 15,
      clr: colors[Math.floor(Math.random() * colors.length)]
    }));
  }
  console.log(enemies);
  function Enemies() {
    for (var i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      ctx.fillStyle = e.clr;
      ctx.fillRect(e.x, (e.y += 0.5), e.w, e.h);
      if (e.y >= cH) {
        lose();
      }
    }
  }

  // const enemiesTwo = [0.08, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(value => ({
  //   x: cW * value,
  //   y: -10,
  //   w: 30,
  //   h: 15,
  //   clr: colors[Math.floor(Math.random() * colors.length)]
  // }));

  // player object and render
  const playerOne = { x: cW * 0.5, y: cH - 40, w: 40, h: 20, dir: "" };
  function playerRender() {
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
    crashDetect(p.x, p.y, p.w, p.h);
  }

  // missile shot detection
  let score = 0;
  function hitDetect(m, mi) {
    for (var i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      const eT = enemiesTemplate[i];
      if (
        m.x + m.w >= e.x &&
        m.x < e.x + e.w &&
        m.y + m.h >= e.y &&
        m.y < e.y + e.h
      ) {
        console.log("hello");
        missiles.splice(mi, 1);
        enemies.splice(i, 1);
        enemiesTemplate.splice(i, 1);
        score += 5;
        document.getElementById("score").innerHTML = "Score: " + score;
      }
      if (enemies.length === 0) {
        win();
      }
    }
  }

  // crash detection

  function crashDetect(x, y, w, h) {
    for (var i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (
        x + w - 3 >= e.x &&
        x + 3 < e.x + e.w &&
        y + h - 3 >= e.y &&
        y + 3 < e.y + e.h
      ) {
        explosion(x + w * 0.5, y + h * 0.5);
        lose();
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

  //const explosionInterval = setInterval(explosion(x,y), 30);

  // missile projection
  let missiles = [];
  let shots = 0;

  function Missile() {
    for (var i = 0; i < missiles.length; i++) {
      const m = missiles[i];
      ctx.fillStyle = "#ff5a00";
      ctx.fillRect(m.x, (m.y -= 8), m.w, m.h);
      if (m.y < 0) {
        missiles.splice(i, 1);
      }
      hitDetect(missiles[i], i);
    }
  }

  // lose and win functions

  function lose() {
    clearInterval(animateInterval);
    ctx.fillStyle = "red";
    ctx.font = "bold 60px Arial, sans serif";
    ctx.fillText("You lose!", cW * 0.5 - 120, cH * 0.4, 400);
    ctx.fillStyle = "blue";
    ctx.font = "bold 30px Arial, sans serif";
    ctx.fillText("Press enter to continue", cW * 0.5 - 200, cH * 0.6, 400);

    document.addEventListener("keydown", function(event) {
      const key = event.keyCode;
      if (key === 13) {
        window.open("index.html", "_self");
      }
    });
  }

  function win() {
    clearInterval(animateInterval);
    ctx.fillStyle = "blue";
    ctx.font = "bold 40px Arial, sans serif";
    ctx.fillText("On to the next level!", cW * 0.5 - 200, cH * 0.4, 400);
    ctx.fillStyle = "blue";
    ctx.font = "bold 30px Arial, sans serif";
    ctx.fillText("Press enter to continue", cW * 0.5 - 200, cH * 0.6, 400);
    missiles.splice(0, missiles.length);

    document.addEventListener("keydown", function(event) {
      const key = event.keyCode;
      if (key === 13) {
        // window.open("leveltwo.html", "_self");
        const enemiesLevelTwo = enemiesTemplate.push(
          { x: 0.08, y: -10 },
          { x: 0.2, y: -10 },
          { x: 0.3, y: -10 },
          { x: 0.4, y: -10 },
          { x: 0.5, y: -10 },
          { x: 0.6, y: -10 },
          { x: 0.7, y: -10 },
          { x: 0.8, y: -10 },
          { x: 0.9, y: -10 },
          { x: 0.08, y: -40 },
          { x: 0.2, y: -40 },
          { x: 0.3, y: -40 },
          { x: 0.4, y: -40 },
          { x: 0.5, y: -40 },
          { x: 0.6, y: -40 },
          { x: 0.7, y: -40 },
          { x: 0.8, y: -40 },
          { x: 0.9, y: -40 }
        );
        return enemiesLevelTwo, animateLevelTwo(), createEnemies();
      }
    });
  }

  // animation
  function animate() {
    ctx.clearRect(0, 0, cW, cH);
    spaceFly("rgba(255,255,255,0.75");
    playerRender();
    Missile();
    Enemies();
    //addEnemies(10, 11);
  }

  function animateLevelTwo() {
    console.log("function called!");
    function levelTwoGO() {
      ctx.clearRect(0, 0, cW, cH);
      spaceFly("rgba(246, 71, 71, 0.75)");
      playerRender();
      Missile();
      Enemies();
    }
    setInterval(levelTwoGO, 30);
  }

  const animateInterval = setInterval(animate, 30);

  // Movement controls
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
    if (keyNum === 32) {
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

  document.addEventListener("keyup", function(event) {
    let keyStop = event.keyCode;
    if (keyStop !== 32) {
      playerOne.dir = "";
    }
  });
  window.addEventListener("load", createEnemies());
  return {
    animateInterval
  };
})();
