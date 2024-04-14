// ColoredPoint.js (c) 2012 matsuda

// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
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

function setupWebGL(){
    // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true} );
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

}

function connectVariablesToGLSL(){

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

    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const DRAWING = 3;

let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSeg = 5;
let g_selectedEyes = 0;

function addActionsForHtmlUI(){

  document.getElementById('green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
  document.getElementById('red').onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };

  document.getElementById('clearButton').onclick = function() { g_shapesList = []; renderAllShapes(); };

  document.getElementById('moveEyes').onclick = function() {
    // Change g_selectedEyes to move the eyes
    //g_selectedEyes += 0.1; // Adjust this value to control the offset

    // Update only the eyes for all drawing shapes
    g_shapesList.forEach(function(shape) {
        if (shape.type === 'drawing') {
            shape.drawEyes(); // Re-draw eyes with the updated position
            
            if(g_selectedEyes == 0){
              g_selectedEyes += 0.1;
            } else {
              g_selectedEyes -= 0.1;
            }
        }
    });

    // Redraw all shapes with updated eyes
    renderAllShapes();
};

  document.getElementById('pointButton').onclick = function() { g_selectedType=POINT }
  document.getElementById('triButton').onclick = function() { g_selectedType=TRIANGLE }
  document.getElementById('circleButton').onclick = function() { g_selectedType=CIRCLE }
  document.getElementById('drawingButton').onclick = function() {let drawing = new Drawing();
    g_shapesList.push(drawing); // Add the drawing to the list of shapes
    renderAllShapes(); }

  document.getElementById('starButton').addEventListener('click', function() {
      requestAnimationFrame(animateStar);
  });


  document.getElementById('redSlide').addEventListener('mouseup',function() {g_selectedColor[0] = this.value/100; });
  document.getElementById('greenSlide').addEventListener('mouseup',function() {g_selectedColor[1] = this.value/100; });
  document.getElementById('blueSlide').addEventListener('mouseup',function() {g_selectedColor[2] = this.value/100; });
  document.getElementById('sizeSlide').addEventListener('mouseup',function() {g_selectedSize = this.value; });
  document.getElementById('segSlide').addEventListener('mouseup',function() {g_selectedSeg = this.value; });
  

}


function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x,y]);
}

var g_shapesList =[];

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];

function click(ev) {
  
  let [x,y] = convertCoordinatesEventToGL(ev);

  let point;
  if(g_selectedType == POINT){
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } else if (g_selectedType == CIRCLE) {
    point = new Circle();
  } else if (g_selectedType==DRAWING){
    point = new Drawing();
 }
  point.position=[x,y];
  point.color=g_selectedColor.slice();
  point.size = g_selectedSize;
  point.segments = g_selectedSeg;
  g_shapesList.push(point);

  //draw every shape
  renderAllShapes();
}
  

function renderAllShapes(){

  var startTime = performance.now();

  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {

    g_shapesList[i].render();
    
  }

  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
  
}



function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm){
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}

function main() {
  
  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) {click(ev)}};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}
