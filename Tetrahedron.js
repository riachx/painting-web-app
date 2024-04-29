class Tetrahedron {
    constructor(){
        this.type = 'tetrahedron';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        
    }
    render(){
        var rgba = this.color;

        // Define vertices of the tetrahedron
        var v0 = [0, 0, 0];
        var v1 = [0.8, 0, 0];
        var v2 = [0.4, 1, 0];
        var v3 = [0.5, -0.2, 0.3];

        // Face 1
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        drawTriangle3D([...v0, ...v1, ...v2]);

        // Face 2
        gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
        drawTriangle3D([...v1, ...v2, ...v3]);

        // Face 3
        gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
        drawTriangle3D([...v2, ...v0, ...v3]);

        // Base
        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
        drawTriangle3D([...v0, ...v1, ...v3]);
    }
}

