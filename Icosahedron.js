// got help with chatGPT to help with the math in this

class Icosahedron {
    constructor(){
        this.type = 'icosahedron';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        const t = (1.0 + Math.sqrt(5.0)) / 2.0; // golden ratio

        // vertices of an icosahedron
        this.vertices = [
            [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
            [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
            [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
        ].map(v => this.normalize(v)); // normalize vertices to push them out to the surface of a sphere

        // indices for the 20 triangular faces of the icosahedron
        this.indices = [
            [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
            [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
            [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
            [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
        ];
    }

    normalize(v) {
        const length = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
        return v.map(val => val / length);
    }

    render(){
        this.indices.forEach(tri => {
            gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
            gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
            drawTriangle3D([
                ...this.vertices[tri[0]],
                ...this.vertices[tri[1]],
                ...this.vertices[tri[2]]
            ]);
        });
    }
}
