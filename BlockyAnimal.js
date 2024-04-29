// ColoredPoint.js (c) 2012 matsuda

// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let shift = false;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);


}

function connectVariablesToGLSL() {

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, "u_GlobalRotateMatrix");
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}


let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_globalAngle = 0;
let g_yellowAngle = 0;
let g_armAngle = 0;
let g_yellowAnimation = false;
let g_armAnimation = false;
let g_sphereAngle = 10;


function addActionsForHtmlUI() {

  document.getElementById('animationYellowOffButton').onclick = function () { g_yellowAnimation = false; };
  document.getElementById('animationYellowOnButton').onclick = function () { g_yellowAnimation = true; };

  document.getElementById('animationArmsOffButton').onclick = function () { g_armAnimation = false; };
  document.getElementById('animationArmsOnButton').onclick = function () { g_armAnimation = true; };


  document.getElementById('yellowSlide').addEventListener('mousemove', function () { g_yellowAngle = this.value; renderAllShapes(); });

  document.getElementById('angleSlide').addEventListener('mousemove', function () { g_globalAngle = this.value; renderAllShapes(); });
  document.getElementById('armSlide').addEventListener('mousemove', function () { g_armAngle = this.value; renderAllShapes(); });


}


function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  return ([x, y]);
}

var g_shapesList = [];

function click(ev) {

  let [x, y] = convertCoordinatesEventToGL(ev);

  let point;
  if (g_selectedType == POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } else if (g_selectedType == CIRCLE) {
    point = new Circle();
  } else if (g_selectedType == DRAWING) {
    point = new Drawing();
  }
  point.position = [x, y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  point.segments = g_selectedSeg;
  g_shapesList.push(point);

  //draw every shape
  renderAllShapes();
}


function renderAllShapes() {

  var startTime = performance.now();

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);




  /*var body = new Cube();
  body.color = [1,0,0,1];
  body.matrix.translate(-0.25,-0.5,0);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(0.5,-0.3,-0.5);
  body.render();

  // yellow
  var leftArm = new Cube();
  leftArm.color = [0.42,0.45,1,1];
  leftArm.matrix.setTranslate(0,-0.5,0);
  leftArm.matrix.rotate(-5,1,0,0);
  
  leftArm.matrix.rotate(-g_yellowAngle,0,0,1);

  var yellowCoordinatesMat = new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(0.25,0.7,0.5);
  leftArm.matrix.translate(-0.5,0,0);
  leftArm.render();

  // pink
  var box = new Cube();
  box.color = [1,0,1,1];
  box.matrix = yellowCoordinatesMat;
  box.matrix.translate(0,0.65,0);
  box.matrix.rotate(g_magentaAngle,0,0,1);
  box.matrix.scale(0.3,0.3,0.3);
  box.matrix.translate(-0.5,0,-0.001);
  box.render();*/

  addEars1([0.3, 0.55, 1, 1]);
  addEars2([0.89, 0.28, 0.25, 1]);
  addEars3([1, 0.5, 0.5, 1]);

  var skirt = new Cylinder();
  skirt.matrix.scale(0.2, 0.45, 0.2);

  if (shift) {
    skirt.color = [45 * Math.sin(g_seconds) / 10 + 5, 45 * Math.sin(g_seconds) / 20, 45 * Math.sin(g_seconds) / 50, 1];

  } else {
    skirt.color = [1, 0.3, 0.4, 1];
  }

  skirt.matrix.translate(0, -0.5, 0);
  skirt.render();

  var sleeve = new Cube();


  if (shift) {
    sleeve.color = [45 * Math.sin(g_seconds) / 10 + 5, 45 * Math.sin(g_seconds) / 20, 45 * Math.sin(g_seconds) / 50, 1];

  } else {
    sleeve.color = [1, 0.3, 0.4, 1];
  }

  sleeve.matrix.rotate(-1 * g_yellowAngle / 4, 0, 0, 1);
  if (g_armAnimation) {
    sleeve.matrix.rotate(g_armAngle / 4, 1, 0, 1);
  }
  sleeve.matrix.scale(0.17, 0.09, 0.17);
  sleeve.matrix.translate(-1.1, -0.9, -0.3);
  sleeve.render();

  var sleeve2 = new Cube();
  sleeve2.matrix.rotate(1 * g_yellowAngle / 4, 0, 0, 1);
  if (g_armAnimation) {
    sleeve2.matrix.rotate(g_armAngle / 4, 1, 0, 1);
  }


  if (shift) {
    sleeve2.color = [45 * Math.sin(g_seconds) / 10 + 5, 45 * Math.sin(g_seconds) / 20, 45 * Math.sin(g_seconds) / 50, 1];

  } else {
    sleeve2.color = [1, 0.3, 0.4, 1];
  }
  sleeve2.matrix.scale(0.17, 0.09, 0.17);
  sleeve2.matrix.translate(0.1, -0.9, -0.3);
  sleeve2.render();

  var head = new Sphere();
  head.matrix.scale(0.3, 0.25, 0.3);
  head.color = [0.3, 0.55, 1, 1];
  head.matrix.translate(0, 1, 0);
  head.render();

  addLeftArm(0.5, g_yellowAngle, g_armAngle);
  addRightArm(-0.5, g_yellowAngle, g_armAngle);
  addLeftLeg(g_yellowAngle);
  addRightLeg(g_yellowAngle);

  addEyes();

  addMouth();

  var grass = new Sphere();
  grass.color = [0.47, 0.98, 0.36, 1];
  grass.matrix.scale(0.6, 0.6, 0.6);
  grass.matrix.translate(0, -1.95, 0);
  grass.matrix.rotate(g_sphereAngle, 1, 0, 0);
  grass.render();


  var sky = new Cube();
  sky.color = [0.3, 0.85, 1, 1];
  sky.matrix.scale(2, 2, 0.2);
  sky.matrix.translate(-0.5, -0.5, 3);
  sky.render();




  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10, "numdot");

}
function addMouth() {
  var m1 = new Cube();
  m1.color = [0.2, 0.2, 1, 1];
  m1.matrix.scale(0.03, 0.02, 0.03);
  m1.matrix.translate(-0.5, 7, -8);
  m1.render();

  var m2 = new Cube();
  m2.color = [0.2, 0.2, 1, 1];
  m2.matrix.rotate(-30, 0, 0, 1);
  m2.matrix.scale(0.03, 0.02, 0.03);
  m2.matrix.translate(-2.1, 6.2, -8);
  m2.render();

  var m3 = new Cube();
  m3.color = [0.2, 0.2, 1, 1];
  m3.matrix.rotate(-40, 0, 0, 1);
  m3.matrix.scale(0.04, 0.02, 0.03);
  m3.matrix.translate(-1.5, 5.5, -8);
  m3.render();

  var m4 = new Cube();
  m4.color = [0.2, 0.2, 1, 1];
  m4.matrix.rotate(-20, 0, 0, 1);
  m4.matrix.scale(0.03, 0.02, 0.03);
  m4.matrix.translate(0.4, 5.7, -8);
  m4.render();

  var m5 = new Cube();
  m5.color = [0.2, 0.2, 1, 1];
  m5.matrix.rotate(0, 0, 0, 1);
  m5.matrix.scale(0.035, 0.02, 0.03);
  m5.matrix.translate(2.2, 4.5, -8);
  m5.render();

  var m6 = new Cube();
  m6.color = [0.2, 0.2, 1, 1];
  m6.matrix.rotate(40, 0, 0, 1);
  m6.matrix.scale(0.04, 0.02, 0.03);
  m6.matrix.translate(3.5, 0, -8);
  m6.render();

  var m7 = new Cube();
  m7.color = [0.2, 0.2, 1, 1];
  m7.matrix.rotate(120, 0, 0, 1);
  m7.matrix.scale(0.04, 0.02, 0.03);
  m7.matrix.translate(1, -9, -8);
  m7.render();

  /////////////////////////////

  var M3 = new Cube();
  M3.color = [0.2, 0.2, 1, 1];
  M3.matrix.rotate(50, 0, 0, 1);
  M3.matrix.scale(0.04, 0.02, 0.03);
  M3.matrix.translate(1.9, 4.5, -8);
  M3.render();

  var M4 = new Cube();
  M4.color = [0.2, 0.2, 1, 1];
  M4.matrix.rotate(40, 0, 0, 1);
  M4.matrix.scale(0.03, 0.02, 0.03);
  M4.matrix.translate(0.9, 5, -8);
  M4.render();

  var M5 = new Cube();
  M5.color = [0.2, 0.2, 1, 1];
  M5.matrix.scale(0.035, 0.02, 0.03);
  M5.matrix.translate(-2.4, 4.3, -8);
  M5.render();

  var M6 = new Cube();
  M6.color = [0.2, 0.2, 1, 1];
  M6.matrix.rotate(-40, 0, 0, 1);
  M6.matrix.scale(0.04, 0.02, 0.03);
  M6.matrix.translate(-4, 0.3, -8);
  M6.render();

  var M7 = new Cube();
  M7.color = [0.2, 0.2, 1, 1];
  M7.matrix.rotate(-120, 0, 0, 1);
  M7.matrix.scale(0.04, 0.02, 0.03);
  M7.matrix.translate(-1.8, -8, -8);
  M7.render();
}

function addEyes() {



  /*var w1 = new Tetrahedron();
  w1.color = [1,1,1,1];
  w1.matrix.scale(0.12,0.03,0.05);
  w1.matrix.translate(-1.5,10,-5.5);
  w1.render();*/
  var w1 = new Sphere();
  w1.latitudeBands = 4;
  w1.longitudeBands = 4;
  w1.color = [1, 1, 1, 1];
  w1.matrix.scale(0.06, 0.08, 0.02);
  w1.matrix.rotate(-10, 1, 0, 1);
  w1.matrix.translate(-2.9, 4.6, -12.4);
  w1.render();

  var w2 = new Sphere();
  w2.latitudeBands = 4;
  w2.longitudeBands = 4;
  w2.color = [1, 1, 1, 1];
  w2.matrix.scale(0.06, 0.08, 0.02);
  w2.matrix.rotate(10, 1, 0, 1);
  w2.matrix.translate(2.9, 1.5, -13.15);
  w2.render();

  var b1 = new Sphere();
  b1.latitudeBands = 4;
  b1.longitudeBands = 4;
  b1.color = [0, 0, 0, 1];
  b1.matrix.scale(0.04, 0.06, 0.02);
  b1.matrix.rotate(-10, 1, 0, 1);
  b1.matrix.translate(-4.6, 5.3, -13);
  b1.render();

  var b2 = new Sphere();
  b2.latitudeBands = 4;
  b2.longitudeBands = 4;
  b2.color = [0, 0, 0, 1];
  b2.matrix.scale(0.04, 0.06, 0.02);
  b2.matrix.rotate(10, 1, 0, 1);
  b2.matrix.translate(4, 2.1, -14);
  b2.render();

  var tri1 = new Tetrahedron();
  tri1.color = [1, 1, 1, 1];
  tri1.matrix.scale(0.08, 0.03, 0.02);
  tri1.matrix.translate(1.8, 8.3, -14.6);
  tri1.render();

  var tri2 = new Tetrahedron();
  tri2.color = [1, 1, 1, 1];
  tri2.matrix = tri1.matrix;
  tri2.matrix.translate(-3.8, 0, 0);
  tri2.render();








}
function addEars1(color) {

  var tri = new Tetrahedron();
  tri.color = color;
  tri.matrix.scale(0.3, 0.4, 0.4);
  tri.matrix.translate(0.05, 0.95, 0);
  tri.render();

  var tri2 = new Tetrahedron();
  tri2.color = color;
  tri2.matrix.scale(0.3, 0.4, 0.4);
  tri2.matrix.translate(-0.85, 0.95, 0);
  tri2.render();

}

function addEars2(color) {

  var tri = new Tetrahedron();
  tri.color = color;
  tri.matrix.scale(0.28, 0.35, 0.4);
  tri.matrix.translate(0.09, 0.95, -0.03);
  tri.render();

  var tri2 = new Tetrahedron();
  tri2.color = color;
  tri2.matrix.scale(0.28, 0.35, 0.4);
  tri2.matrix.translate(-0.9, 0.95, -0.03);
  tri2.render();

}

function addEars3(color) {

  var tri = new Tetrahedron();
  tri.color = color;
  tri.matrix.scale(0.23, 0.32, 0.3);
  tri.matrix.translate(0.2, 0.85, -0.08);
  tri.render();

  var tri2 = new Tetrahedron();
  tri2.color = color;
  tri2.matrix.scale(0.23, 0.32, 0.3);
  tri2.matrix.translate(-1, 0.85, -0.08);
  tri2.render();

}

function addLeftArm(p, angle, armAngle) {
  var cube = new Cube();
  cube.color = [0.3, 0.55, 1, 1];

  cube.matrix.rotate(-23 - angle / 3, 0, 0, 1);
  cube.matrix.rotate( angle / 3, 1, 0, 0);
  cube.matrix.rotate(armAngle / 3, 1, 0, 1);
  cube.matrix.scale(0.07, 0.18, 0.07);
  cube.matrix.translate(-2.6 + p, -1.58, -0.08);

  cube.render();

  var cube3 = new Cube();
  cube3.color = [1, 0.5, 0.5, 1];
  cube3.matrix = cube.matrix;
  cube3.matrix.scale(1.25, 0.25, 0.5);
  cube3.matrix.translate(-0.6 + p, 0.2, -0.08);
  cube3.render();


  var cube2 = new Cube();
  cube2.matrix = cube3.matrix;
  cube2.color = [0.3, 0.55, 1, 1];
  cube2.matrix.scale(1.5, 2, 2);
  cube2.matrix.translate(-0.2, -1, 0);
  cube2.render();

}


function addRightArm(p, angle, armAngle) {

  var cube = new Cube();
  cube.color = [0.3, 0.55, 1, 1];
  cube.matrix.rotate(23 + angle / 3, 0, 0, 1);
  cube.matrix.rotate( -angle / 3, 1, 0, 0);
  cube.matrix.rotate(armAngle / 3, 1, 0, 1);

  cube.matrix.scale(0.07, 0.14, 0.07);
  cube.matrix.translate(1.5 + p, -1.6, -0.08);
  cube.render();

  var cube3 = new Cube();
  cube3.matrix = cube.matrix;
  cube3.color = [1, 0.5, 0.5, 1];
  //cube3.matrix.rotate(25 + angle/3,0,0,1);
  cube3.matrix.scale(1.2, 0.35, 0.5);
  cube3.matrix.translate(0.5 + p, -1, -0.08);
  cube3.render();


  var cube2 = new Cube();
  cube2.matrix = cube3.matrix;
  cube2.color = [0.3, 0.55, 1, 1];
  cube2.matrix.scale(1.5, 2, 2);
  cube2.matrix.translate(-0.1, -1, 0);
  cube2.render();



}


function addLeftLeg(angle) {

  var cube = new Cube();
  cube.color = [0.3, 0.55, 1, 1];
  cube.matrix.scale(0.1, 0.18, 0.1);
  cube.matrix.translate(-1.3, -2.9 + angle / 500, -0.8 - angle / 100);
  cube.matrix.rotate(5 + angle / 1.5, 1, 0, 0);
  cube.render();

  var legMat = new Matrix4(cube.matrix);

  var pink = new Cube();
  pink.color = [1, 0.5, 0.5, 1];
  pink.matrix = legMat;
  pink.matrix.scale(1.2, 0.3, 1.2);
  pink.matrix.translate(-0.1, -0.8, -0.1);
  pink.render();

  var foot = new Cube();
  foot.matrix = legMat;
  foot.color = [0.3, 0.55, 1, 1];
  foot.matrix.scale(0.9, 3.5, 0.7)
  foot.matrix.rotate(-20 + angle / 2, 1, 0, 0);
  foot.matrix.translate(0, -0.95, 0.2);
  foot.render();
}



function addRightLeg(angle) {
  var cube = new Cube();
  cube.color = [0.3, 0.55, 1, 1];
  cube.matrix.scale(0.1, 0.18, 0.1);
  cube.matrix.translate(0.5, -2.9 - angle / 500, -0.8 + angle / 100);
  cube.matrix.rotate(5 - angle / 1.5, 1, 0, 0);
  cube.render();

  var legMat = new Matrix4(cube.matrix);

  var pink = new Cube();
  pink.color = [1, 0.5, 0.5, 1];
  pink.matrix = legMat;
  pink.matrix.scale(1.2, 0.3, 1.2);
  pink.matrix.translate(-0.1, -0.8, -0.1);
  pink.render();

  var foot = new Cube();
  foot.matrix = legMat;
  foot.color = [0.3, 0.55, 1, 1];
  foot.matrix.scale(0.9, 3.5, 0.7)
  foot.matrix.rotate(-20 + angle / 2, 1, 0, 0);
  foot.matrix.translate(0, -0.95, 0.2);
  foot.render();


}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}

function shiftClickAnimation() {
  var hand = new Cube();
  hand.color = [0.42, 0.57, 1, 1];
  hand.matrix.scale(0.2, 0.17, 0.1);
  hand.matrix.translate(0.5, -4, -0.48 + 20 / 100);
  hand.matrix.rotate(20 / 2 - 25, 1, 0, 0);
  hand.render();

  console.log(Math.random());
}

function mouseDown(event) {
  if (event.shiftKey) {
    shift = true;
    console.log("Shift-click detected!");
  }

}

function setupMouseControls() {
  canvas.addEventListener('mousedown', mouseDown);
}



function main() {

  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();
  setupMouseControls();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);

  requestAnimationFrame(tick);
}

var g_startTime = performance.now() / 1000;
var g_seconds = performance.now() / 1000 - g_startTime;

function tick() {

  g_seconds = performance.now() / 1000 - g_startTime;
  //console.log(g_seconds);
  updateAnimationAngles();
  renderAllShapes();
  requestAnimationFrame(tick);

}

function updateAnimationAngles() {
  if (g_yellowAnimation) {
    g_yellowAngle = (45 * Math.sin(3.5 * g_seconds));
    g_sphereAngle += 1.8;
  }
  if (g_armAnimation) {
    g_armAngle = (45 * Math.sin(3 * g_seconds));
  }

}

