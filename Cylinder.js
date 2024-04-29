// got help with chatGPT to create this cylinder

class Cylinder {
    constructor(topRadius = 0.5, bottomRadius = 1.0, height = 1.0, radialDivisions = 12, heightDivisions = 1) {
      this.type = 'cylinder';
      this.topRadius = topRadius;
      this.bottomRadius = bottomRadius;
      this.height = height;
      this.radialDivisions = radialDivisions;
      this.heightDivisions = heightDivisions;
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
    }
  
    render() {
      var vertices = [];
      var indices = [];
  
      // Generate vertices and indices
      for (let y = 0; y <= this.heightDivisions; y++) {
        var v = y / this.heightDivisions;
        var radius = this.bottomRadius + (this.topRadius - this.bottomRadius) * v;
        var yPos = this.height * (v - 0.5);
  
        for (let x = 0; x <= this.radialDivisions; x++) {
          var u = x / this.radialDivisions;
          var angle = u * Math.PI * 2;
          var sin = Math.sin(angle);
          var cos = Math.cos(angle);
  
          var px = radius * cos;
          var py = yPos;
          var pz = radius * sin;
  
          vertices.push(px, py, pz);
  
          if (x < this.radialDivisions && y < this.heightDivisions) {
            var first = y * (this.radialDivisions + 1) + x;
            var second = first + (this.radialDivisions + 1);
  
            indices.push(first, second, first + 1);
            indices.push(second, second + 1, first + 1);
          }
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