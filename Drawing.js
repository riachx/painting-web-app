class Drawing {
    constructor() {
        this.type = 'drawing';
        this.color = [0.0, 0.1, 0.0, 1.0]; // Color for the face outline and features
        this.backgroundColor = [1.0, 0.4, 0.1, 1.0]; // Background color, orange
        this.radius = 0.5;
        this.segments = 36; 
    }
    render() {
        // Clear the background to a solid color
        gl.uniform4f(u_FragColor, this.backgroundColor[0], this.backgroundColor[1], this.backgroundColor[2], this.backgroundColor[3]);
        
        const baseColor = [0.3, 0.6, 0.92, 1.0]; // Bright green
        gl.uniform4f(u_FragColor, baseColor[0], baseColor[1], baseColor[2], baseColor[3]);
        
        drawTriangle([1, -1, 1, 1, -1, -1]);
        drawTriangle([-1, 1, 1, 1, -1, -1]);
       
        
        const baseColor2 = [0.5, 0.8, 0.3, 1.0]; // Bright green
        gl.uniform4f(u_FragColor, baseColor2[0], baseColor2[1], baseColor2[2], baseColor2[3]);
        
        drawTriangle([-1, -0.5, 0, -0.5, 0, -1]);
        drawTriangle([1, -0.5, 0, -0.5, 0, -1]);


        const baseColor3 = [0.6, 0.9, 0.4, 1.0]; // Bright green
        gl.uniform4f(u_FragColor, baseColor3[0], baseColor3[1], baseColor3[2], baseColor3[3]);
        
        drawTriangle([-1, -0.5, 0, -1, -1, -1]);
        drawTriangle([1, -0.5, 0, -1, 1, -1]);



        this.drawArms();
        this.drawShirt();
        this.drawBaseBody();
        
        this.drawEyes();
        
        this.drawPupils();
        this.drawMouth();
        this.drawBlush();

        this.drawStar(0.0, -0.2, 0.18, 0.05, 3);
    }

    drawCircle(cx, cy, radius, segments) {
        var angleStep = 2 * Math.PI / segments;
        var prevX = cx + radius;
        var prevY = cy;
        for (var i = 1; i <= segments; i++) {
            var angle = i * angleStep;
            var x = cx + Math.cos(angle) * radius;
            var y = cy + Math.sin(angle) * radius;
            drawTriangle([cx, cy, prevX, prevY, x, y]);
            prevX = x;
            prevY = y;
        }
    }

    drawSemiCircle(cx, cy, radius, segments) {
        var angleStep = Math.PI / segments;
        var prevX = cx - radius;
        var prevY = cy;
        for (var i = 1; i <= segments; i++) {
            var angle = i * angleStep;
            var x = cx - radius + Math.cos(angle) * radius;
            var y = cy + Math.sin(angle) * radius;
            drawTriangle([cx, cy, prevX, prevY, x, y]);
            prevX = x;
            prevY = y;
        }
    }

    drawBaseBody() { //219,218,214
        const baseColor = [0.85, 0.85, 0.8, 1.0]; // Bright green
        gl.uniform4f(u_FragColor, baseColor[0], baseColor[1], baseColor[2], baseColor[3]);
        //drawTriangle([-0.15, -0.12, 0.3, -0.12, 0, 0.12]); // Upper right decorative triangle
       
        //head
        drawTriangle([-0.12, 0, 0, 0.2, 0, 0]);
        drawTriangle([0.12, 0, 0, 0.2, 0, 0]);

        drawTriangle([-0.12, 0, -0.3, 0.1, 0, 0.2]);
        drawTriangle([0.12, 0, 0.3, 0.1, 0, 0.2]);

        drawTriangle([-0.3, 0.1, -0.35, 0.2, 0, 0.2]);
        drawTriangle([0.3, 0.1, 0.35, 0.2, 0, 0.2]);

        drawTriangle([0, 0.5, 0.35, 0.2, -0.35, 0.2]);

        drawTriangle([0.35, 0.2, 0.3, 0.4, 0, 0.4]);
        drawTriangle([-0.35, 0.2, -0.3, 0.4, 0, 0.4]);

        // top point, right point, left point
        drawTriangle([0, 0.5, 0.3, 0.4, -0.3, 0.4]);

        //ears
        drawTriangle([0.2, 0.65, 0.27, 0.4, 0, 0.45]);
        drawTriangle([-0.2, 0.65, -0.27, 0.4, 0, 0.45]);

        

        // body
       

        // legs
        drawTriangle([-0.05, -0.4, -0.15, -0.65, -0.05, -0.65]);
        drawTriangle([-0.15, -0.4, -0.15, -0.65, -0.05, -0.4]);

        drawTriangle([0.05, -0.4, 0.15, -0.65, 0.05, -0.65]);
        drawTriangle([0.15, -0.4, 0.15, -0.65, 0.05, -0.4]);
        //feet
        this.drawCircle(0.1,-0.6,0.08,6);
        this.drawCircle(-0.1,-0.6,0.08,6);

        const baseColor2 = [0.84, 0.75, 0.69, 1];  // Bright green
        gl.uniform4f(u_FragColor, baseColor2[0], baseColor2[1], baseColor2[2], baseColor2[3]);
        
        drawTriangle([0.18, 0.55, 0.23, 0.39, 0.05, 0.45]);
        drawTriangle([-0.18, 0.55, -0.23, 0.39, -0.05, 0.45]);
        

       
    }
    drawArms(){
         //hands
         const baseColor = [0.85, 0.85, 0.8, 1.0]; // Bright green
        gl.uniform4f(u_FragColor, baseColor[0], baseColor[1], baseColor[2], baseColor[3]);
        
         drawTriangle([0.45, -0.24, 0.4, -0.3, 0.08, 0]);
         drawTriangle([-0.45, -0.24, -0.4, -0.3, -0.08, 0]);
         this.drawCircle(0.39,-0.25,0.06,6);
         this.drawCircle(-0.39,-0.25,0.06,6);
    }
    drawShirt(){

        const baseColor = [1, 0.4, 0.5, 1.0];
        gl.uniform4f(u_FragColor, baseColor[0], baseColor[1], baseColor[2], baseColor[3]);
        
        drawTriangle([-0.35, -0.4, 0.35, -0.4, 0, 0.3]);
        //sleeves
        drawTriangle([0, -0.4, 0.35, -0.1, 0.15, 0]);
        drawTriangle([0, -0.4, -0.35, -0.1, -0.15, 0]);
    }
    drawEyes() {
        const baseColor = [1.0, 1.0, 1.0, 1.0]; // Bright green
        gl.uniform4f(u_FragColor, baseColor[0], baseColor[1], baseColor[2], baseColor[3]);
        
        //1st eye
        drawTriangle([0.1, 0.15, 0.07, 0.2, 0.1, 0.23]);
        
        drawTriangle([0.1, 0.15, 0.2, 0.15, 0.1, 0.23]);
        drawTriangle([0.2, 0.23, 0.2, 0.15, 0.1, 0.23]);

        drawTriangle([0.2, 0.15, 0.23, 0.2, 0.2, 0.23]);

        //2nd eye
        drawTriangle([-0.1, 0.15, -0.07, 0.2, -0.1, 0.23]);
        
        drawTriangle([-0.1, 0.15, -0.2, 0.15, -0.1, 0.23]);
        drawTriangle([-0.2, 0.23, -0.2, 0.15, -0.1, 0.23]);

        drawTriangle([-0.2, 0.15, -0.23, 0.2, -0.2, 0.23]);
        
    }
    drawPupils() { // 35 104 147, #236893
        const baseColor = [0.12, 0.41, 0.61, 1]; // Bright green
        gl.uniform4f(u_FragColor, baseColor[0], baseColor[1], baseColor[2], baseColor[3]);
        
        let p = g_selectedEyes - 0.07;
        drawTriangle([0.17+p, 0.15, 0.14+p, 0.2, 0.17+p, 0.23]);
        drawTriangle([0.16+p, 0.15, 0.2+p, 0.15, 0.17+p, 0.23]);
        drawTriangle([0.2+p, 0.23, 0.2+p, 0.15, 0.17+p, 0.23]);
        drawTriangle([0.2+p, 0.15, 0.23+p, 0.2, 0.2+p, 0.23]);

        
        p = g_selectedEyes;
        drawTriangle([-0.17+p, 0.15, -0.14+p, 0.2, -0.17+p, 0.23]);
        drawTriangle([-0.16+p, 0.15, -0.2+p, 0.15, -0.16+p, 0.23]);
        drawTriangle([-0.2+p, 0.23, -0.2+p, 0.15, -0.16+p, 0.23]);
        drawTriangle([-0.2+p, 0.15, -0.23+p, 0.2, -0.2+p, 0.23]);
        
    }

    drawMouth(){
        const baseColor = [0.12, 0.41, 0.61, 1]; 
        gl.uniform4f(u_FragColor, baseColor[0], baseColor[1], baseColor[2], baseColor[3]);
       
        drawTriangle([0,0.1, 0.07, 0.08, 0.07, 0.07]);
        drawTriangle([0,0.1, 0.07, 0.08, 0, 0.13]);

        drawTriangle([0,0.1, -0.07, 0.08, -0.07, 0.07]);
        drawTriangle([0,0.1, -0.07, 0.08, 0, 0.13]);
        
    }

    drawBlush() { // 35 104 147, #236893
        const baseColor = [0.84, 0.75, 0.69, 1]; 
        gl.uniform4f(u_FragColor, baseColor[0], baseColor[1], baseColor[2], baseColor[3]);
        let y = -0.08;

        drawTriangle([0.17, 0.15+y, 0.14, 0.2+y, 0.17, 0.23+y]);
        drawTriangle([0.16, 0.15+y, 0.2, 0.15+y, 0.16, 0.23+y]);
        drawTriangle([0.2, 0.23+y, 0.2, 0.15+y, 0.16, 0.23+y]);
        drawTriangle([0.2, 0.15+y, 0.23, 0.2+y, 0.2, 0.23+y]);

        let p = 0;
        
        drawTriangle([-0.17+p, 0.15+y, -0.14+p, 0.2+y, -0.17+p, 0.23+y]);
        drawTriangle([-0.16+p, 0.15+y, -0.2+p, 0.15+y, -0.16+p, 0.23+y]);
        drawTriangle([-0.2+p, 0.23+y, -0.2+p, 0.15+y, -0.16+p, 0.23+y]);
        drawTriangle([-0.2+p, 0.15+y, -0.23+p, 0.2+y, -0.2+p, 0.23+y]);
        
    }
     drawStar(cx, cy, outerRadius, innerRadius, numPoints) {
        const baseColor = [0.9, 0.9, 0.3, 1]; // Bright green
        gl.uniform4f(u_FragColor, baseColor[0], baseColor[1], baseColor[2], baseColor[3]);
        
        const step = Math.PI / numPoints;
        const skip = step * 2;
    
        let vertices = [];
    
        for (let i = 0; i < Math.PI * 2; i += step) {
            // Outer vertex
            const outerX = cx + Math.cos(i) * outerRadius;
            const outerY = cy + Math.sin(i) * outerRadius;
            // Inner vertex between two outer vertices
            const innerX = cx + Math.cos(i + step / 2) * innerRadius;
            const innerY = cy + Math.sin(i + step / 2) * innerRadius;
            
            // Next outer vertex
            const nextOuterX = cx + Math.cos(i + skip) * outerRadius;
            const nextOuterY = cy + Math.sin(i + skip) * outerRadius;
            
            // Add the triangle vertices (first triangle)
            vertices.push(outerX, outerY, cx, cy, innerX, innerY);
            // Add the triangle vertices (second triangle)
            vertices.push(innerX, innerY, cx, cy, nextOuterX, nextOuterY);
    
            // Draw the triangles forming the star
            drawTriangle(vertices.slice(-6)); // last 3 vertices added
        }
    }

}

function drawRectangle(coords) {
    const [x, y, width, height] = coords;
    const vertices = [
        x, y,
        x + width, y,
        x, y + height,
        x + width, y,
        x + width, y + height,
        x, y + height
    ];
    drawTriangle(vertices);
}
