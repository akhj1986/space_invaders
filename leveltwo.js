const initCanvas = (function() {
  const ctx = document.getElementById("gamespace").getContext("2d");
  const cH = ctx.canvas.height;
  const cW = ctx.canvas.width;
  const stars = [];

  function addStar() {
    const x = Math.floor(Math.random() * cW + 1);
    const y = Math.floor(Math.random() * cH - 100);
    const s = Math.floor(Math.random() * 10 + 1);
    if (stars.length < 1000) {
      stars.push({ x: x, y: y, s: s });
    }
  }
  function spaceFly() {
    addStar();
    addStar();
    addStar();
    addStar();
    addStar();
    for (i = 0; i < stars.length; i++) {
      ctx.fillStyle = "rgba(255,255,255,0.75";
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

  const colors = ["#134b06", "#7c8f00", "#5d002c", "#81625d"];

  const enemies = [
    {
      x: cW * 0.08,
      y: -10,
      w: 30,
      h: 15,
      clr: colors[Math.floor(Math.random() * colors.length)]
    },
    {
      x: cW * 0.2,
      y: -10,
      w: 30,
      h: 15,
      clr: colors[Math.floor(Math.random() * colors.length)]
    },
    {
      x: cW * 0.3,
      y: -10,
      w: 30,
      h: 15,
      clr: colors[Math.floor(Math.random() * colors.length)]
    },
    {
      x: cW * 0.4,
      y: -10,
      w: 30,
      h: 15,
      clr: colors[Math.floor(Math.random() * colors.length)]
    },
    {
      x: cW * 0.5,
      y: -10,
      w: 30,
      h: 15,
      clr: colors[Math.floor(Math.random() * colors.length)]
    },
    {
      x: cW * 0.6,
      y: -10,
      w: 30,
      h: 15,
      clr: colors[Math.floor(Math.random() * colors.length)]
    },
    {
      x: cW * 0.7,
      y: -10,
      w: 30,
      h: 15,
      clr: colors[Math.floor(Math.random() * colors.length)]
    },
    {
      x: cW * 0.8,
      y: -10,
      w: 30,
      h: 15,
      clr: colors[Math.floor(Math.random() * colors.length)]
    },
    {
      x: cW * 0.9,
      y: -10,
      w: 30,
      h: 15,
      clr: colors[Math.floor(Math.random() * colors.length)]
    },
    {
      x: cW * 0.08,
      y: -10,
      w: 30,
      h: 15,
      clr: colors[Math.floor(Math.random() * colors.length)]
    },
    {
      x: cW * 0.2,
      y: -60,
      w: 30,
      h: 15,
      clr: colors[Math.floor(Math.random() * colors.length)]
    },
    {
      x: cW * 0.3,
      y: -60,
      w: 30,
      h: 15,
      clr: colors[Math.floor(Math.random() * colors.length)]
    },
    {
      x: cW * 0.4,
      y: -60,
      w: 30,
      h: 15,
      clr: colors[Math.floor(Math.random() * colors.length)]
    },
    {
      x: cW * 0.5,
      y: -60,
      w: 30,
      h: 15,
      clr: colors[Math.floor(Math.random() * colors.length)]
    },
    {
      x: cW * 0.6,
      y: -60,
      w: 30,
      h: 15,
      clr: colors[Math.floor(Math.random() * colors.length)]
    },
    {
      x: cW * 0.7,
      y: -60,
      w: 30,
      h: 15,
      clr: colors[Math.floor(Math.random() * colors.length)]
    },
    {
      x: cW * 0.8,
      y: -60,
      w: 30,
      h: 15,
      clr: colors[Math.floor(Math.random() * colors.length)]
    },
    {
      x: cW * 0.9,
      y: -60,
      w: 30,
      h: 15,
      clr: colors[Math.floor(Math.random() * colors.length)]
    }
  ];

  function Enemies() {
    for (var i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      ctx.fillStyle = e.clr;
      ctx.fillRect(e.x, (e.y += 0.5), e.w, e.h);
      //console.log(e);
      if (e.y >= cH) {
        clearInterval(animateInterval);
        ctx.fillStyle = "red";
        ctx.font = "bold 60px Arial, sans serif";
        ctx.fillText("You lose!", cW * 0.5 - 120, cH * 0.4, 400);
        ctx.fillStyle = "blue";
        ctx.font = "bold 30px Arial, sans serif";
        ctx.fillText("Press enter to continue", cW * 0.5 - 200, cH * 0.6, 400);

        setTimeout(reload, 3000);
        document.addEventListener("keydown", function(event) {
          const key = event.keyCode;
          if (key === 13) {
            window.open("index.html", "_self");
          }
        });
      }
    }
  }

  const playerOne = { x: cW * 0.5, y: cH - 40, w: 40, h: 20, dir: "" };
  function playerRender() {
    p = playerOne;
    ctx.fillStyle = "#3e6f9d";
    ctx.fillRect(p.x, p.y, p.w, p.h);
    if (p.dir === "left" && p.x > -20) {
      p.x -= 5;
    }
    if (p.dir === "right" && p.x < cW - 20) {
      p.x += 5;
    }
    if (p.dir === "up" && p.y > -10) {
      p.y -= 5;
    }
    if (p.dir === "down" && p.y < cH - 10) {
      p.y += 5;
    }
    crashDetect(p.x, p.y, p.w, p.h);
  }

  let score = 45;

  function hitDetect(m, mi) {
    for (var i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (
        m.x + m.w >= e.x &&
        m.x < e.x + e.w &&
        m.y + m.h >= e.y &&
        m.y < e.y + e.h
      ) {
        console.log("hello");
        missiles.splice(mi, 1);
        enemies.splice(i, 1);
        score += 5;
        document.getElementById("score").innerHTML = "Score: " + score;
      }
      if (enemies.length === 0) {
        clearInterval(animateInterval);
        ctx.fillStyle = "blue";
        ctx.font = "bold 40px Arial, sans serif";
        ctx.fillText("On to the next level!", cW * 0.5 - 200, cH * 0.4, 400);
        ctx.fillStyle = "blue";
        ctx.font = "bold 30px Arial, sans serif";
        ctx.fillText("Press enter to continue", cW * 0.5 - 200, cH * 0.6, 400);

        setTimeout(reload, 3000);
        document.addEventListener("keydown", function(event) {
          const key = event.keyCode;
          if (key === 13) {
            window.open("leveltwo.html", "_self");
          }
        });
      }
    }
  }

  function reload() {
    console.log("hello silly man");
  }

  function crashDetect(x, y, w, h) {
    for (var i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (x + w >= e.x && x < e.x + e.w && y + h >= e.y && y < e.y + e.h) {
        console.log("Crash!");
        clearInterval(animateInterval);
        ctx.fillStyle = "red";
        ctx.font = "bold 60px Arial, sans serif";
        ctx.fillText("You lose!", cW * 0.5 - 120, cH * 0.4, 400);
        ctx.fillStyle = "blue";
        ctx.font = "bold 30px Arial, sans serif";
        ctx.fillText("Press enter to continue", cW * 0.5 - 200, cH * 0.6, 400);

        setTimeout(reload, 3000);
        document.addEventListener("keydown", function(event) {
          const key = event.keyCode;
          if (key === 13) {
            window.open("index.html", "_self");
          }
        });
      }
    }
  }

  const missiles = [];
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
      //console.log(m.x);
    }
  }

  function animate() {
    ctx.clearRect(0, 0, cW, cH);
    spaceFly();
    playerRender();
    Missile();
    Enemies();
  }

  const animateInterval = setInterval(animate, 30);

  document.addEventListener("keydown", function(event) {
    const keyNum = event.keyCode;

    if (keyNum === 32) {
      console.log(keyNum);
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

  document.addEventListener("keyup", function(event) {
    let keyStop = event.keyCode;
    if (keyStop !== 32) {
      playerOne.dir = "";
    }
  });
  return {
    animateInterval
  };
})();

// window.addEventListener("load", function(event) {
//   initCanvas.animateInterval;
// });
