let Color = {
  None: [0x1a, 0x1a, 0x1a, 255],
  Wall: [0x4e, 0x4a, 0x4e, 0xff],
  Sand: [0xd2, 0x7d, 0x2c, 0xff],
};
let canvas;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth();
  canvas = createImage(500, 500);
  fillRect(0, 0, canvas.width, canvas.height, Color.None);

  document.getElementById('reset-button').onclick = () => {
    canvas.loadPixels();
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        setPixel(x, y, Color.None);
      }
    }
    canvas.updatePixels();
    image(canvas, 0, 0, canvas.width, canvas.height);
  };

  document.getElementById('color-picker').oninput = () => {
    fillRect(event.currentTarget.value);
    const code = event.currentTarget.value;
    const red = parseInt(code.substring(1, 3), 16);
    const green = parseInt(code.substring(3, 5), 16);
    const blue = parseInt(code.substring(5, 7), 16);
    setNewColor([red, green, blue, 255]);
  };
}

function mouseDragged() {
  if (colorCompare(getPixel(mouseX, mouseY), Color.Sand)) {
    return;
  }

  fillRect(mouseX, mouseY, 5, 5, Color.Wall);
}

function draw() {
  canvas.loadPixels();
  const fromX = floor(canvas.width / 3);
  const toX = floor((canvas.width / 3) * 2);
  for (let x = fromX; x <= toX; x++) {
    if (random() < 0.1) {
      setPixel(x, 0, Color.Sand);
    }
  }
  for (let y = canvas.height - 1; y >= 0; y--) {
    for (let x = 0; x < canvas.width; x++) {
      fall(x, y);
    }
  }
  canvas.updatePixels();
  image(canvas, 0, 0, canvas.width, canvas.height);
}

function fillRect(x, y, width, height, color) {
  canvas.loadPixels();
  for (let ty = y; ty < y + height; ty++) {
    for (let tx = x; tx < x + width; tx++) {
      setPixel(tx, ty, color);
    }
  }
  canvas.updatePixels();
  image(canvas, 0, 0, canvas.width, canvas.height);
}

function fall(x, y) {
  const cur = getPixel(x, y);
  if (!colorCompare(cur, Color.Sand)) {
    return;
  }
  if (canvas.height - 1 <= y) {
    setPixel(x, y, Color.None);
  } else if (colorCompare(getPixel(x, y + 1), Color.None)) {
    setPixel(x, y + 1, cur);
    setPixel(x, y, Color.None);
  } else {
    const tx = x + floor(random(-4, 4));
    if (colorCompare(getPixel(tx, y), Color.None)) {
      setPixel(x, y, Color.None);
      setPixel(tx, y, Color.Sand);
    }
  }
}

function setNewColor(newColor) {
  canvas.loadPixels();
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      if (colorCompare(getPixel(x, y), Color.Sand)) {
        setPixel(x, y, newColor);
      }
    }
  }
  canvas.updatePixels();
  image(canvas, 0, 0, canvas.width, canvas.height);
  Color.Sand = newColor;
}

function colorCompare(a, b) {
  return a[0] == b[0] && a[1] == b[1] && a[2] == b[2];
}

function getPixel(x, y) {
  const i = (y * canvas.width + x) * 4;
  return [
    canvas.pixels[i],
    canvas.pixels[i + 1],
    canvas.pixels[i + 2],
    canvas.pixels[i + 3],
  ];
}

function setPixel(x, y, color) {
  if (x <= 0 || x >= canvas.width || y < 0 || y > canvas.height) {
    return;
  }

  const i = (y * canvas.width + x) * 4;
  canvas.pixels[i + 0] = color[0];
  canvas.pixels[i + 1] = color[1];
  canvas.pixels[i + 2] = color[2];
  canvas.pixels[i + 3] = color[3];
}
