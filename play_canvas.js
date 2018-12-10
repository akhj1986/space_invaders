const initCanvas = (function() {
  const ctx = document.getElementById("my_canvas").getContext("2d");
  const cW = ctx.canvas.width;
  const cH = ctx.canvas.height;

  const myBlocks = [];

  function addBlocks(qOne, qTwo) {
    for (var a = 0; a < qOne; a++) {
      const x = (a + 1) * (cW / qOne);
      myBlocks.push({ x: x, y: 30, w: 20, h: 20, clr: "red" });
      const mB = myBlocks[a];
      ctx.fillStyle = mB.clr;
      ctx.fillRect(mB.x, mB.y, mB.w, mB.h);
    }
    for (var b = 0; b < 20; b++) {
      const x = (b + 1) * (cW / qTwo);
      myBlocks.push({ x: x, y: 60, w: 20, h: 20, clr: "blue" });
      const mB = myBlocks[b + a];
      ctx.fillStyle = mB.clr;
      ctx.fillRect(mB.x, mB.y, mB.w, mB.h);
    }
    for (var c = 0; c < qTwo; c++) {
      const xThree = (c + 1) * (cW / qOne);
      myBlocks.push({ x: xThree, y: 90, w: 20, h: 20, clr: "green" });
      const mB = myBlocks[c + a + b];
      ctx.fillStyle = mB.clr;
      ctx.fillRect(mB.x, mB.y, mB.w, mB.h);
    }
  }
  //   console.log(myBlocks);
  //   function drawBlocks() {
  //     for (var i = 0; i < myBlocks.length; i++) {
  //       const mB = myBlocks[i];
  //       console.log(mB);
  //       ctx.fillStyle = mB.clr;
  //       ctx.fillRect(mB.x, mB.y, mB.w, mB.h);
  //     }
  //   }

  function animate() {
    ctx.clearRect(0, 0, cW, cH);
    addBlocks(5, 10);
    //drawBlocks();
    console.log("crazy");
  }

  //const animateInterval = setInterval(animate, 30);
  return {
    animate
  };
})();

window.addEventListener("load", initCanvas.animate);
console.log("hello");
