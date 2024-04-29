// I used ChatGPT to help me with the math in this.
// Essentially composed of a ton of triangles that link together.
// Change topology amount in bands

class Sphere {
    constructor(radius = 1, latitudeBands = 6, longitudeBands = 6) {
      this.type = 'sphere';
      this.radius = radius;
      this.latitudeBands = latitudeBands;
      this.longitudeBands = longitudeBands;
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
    }
  
    render() {
      var vertices = [];
      var indices = [];
  
      // Generate vertices
      for (let latNumber = 0; latNumber <= this.latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / this.latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);
  
        for (let longNumber = 0; longNumber <= this.longitudeBands; longNumber++) {
          var phi = longNumber * 2 * Math.PI / this.longitudeBands;
          var sinPhi = Math.sin(phi);
          var cosPhi = Math.cos(phi);
  
          var x = cosPhi * sinTheta;
          var y = cosTheta;
          var z = sinPhi * sinTheta;
  
          vertices.push(this.radius * x);
          vertices.push(this.radius * y);
          vertices.push(this.radius * z);
        }
      }
  
      // Generate indices for triangles
      for (let latNumber = 0; latNumber < this.latitudeBands; latNumber++) {
        for (let longNumber = 0; longNumber < this.longitudeBands; longNumber++) {
          var first = (latNumber * (this.longitudeBands + 1)) + longNumber;
          var second = first + this.longitudeBands + 1;
  
          indices.push(first);
          indices.push(second);
          indices.push(first + 1);
  
          indices.push(second);
          indices.push(second + 1);
          indices.push(first + 1);
        }
      }
  
      // Draw each triangle
      for (let i = 0; i < indices.length; i += 3) {
        const index1 = indices[i] * 3;
        const index2 = indices[i + 1] * 3;
        const index3 = indices[i + 2] * 3;
        const p1 = vertices.slice(index1, index1 + 3);
        const p2 = vertices.slice(index2, index2 + 3);
        const p3 = vertices.slice(index3, index3 + 3);
  
        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        drawTriangle3D([...p1, ...p2, ...p3]);
      }
    }
  }