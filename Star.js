class Star {
    constructor(){
        this.type = 'star';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.vertices = [
            [-1, (1.0 + Math.sqrt(5.0)) / 2.0, 0], [1, (1.0 + Math.sqrt(5.0)) / 2.0, 0], [-1, -(1.0 + Math.sqrt(5.0)) / 2.0, 0], [1, -(1.0 + Math.sqrt(5.0)) / 2.0, 0],
            [0, -1, (1.0 + Math.sqrt(5.0)) / 2.0], [0, 1, (1.0 + Math.sqrt(5.0)) / 2.0], [0, -1, -(1.0 + Math.sqrt(5.0)) / 2.0], [0, 1, -(1.0 + Math.sqrt(5.0)) / 2.0],
            [(1.0 + Math.sqrt(5.0)) / 2.0, 0, -1], [(1.0 + Math.sqrt(5.0)) / 2.0, 0, 1], [-(1.0 + Math.sqrt(5.0)) / 2.0, 0, -1], [-(1.0 + Math.sqrt(5.0)) / 2.0, 0, 1]
        ];
        this.indices = [
            [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
            [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
            [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
            [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
        ];
    }

    midpoint(v1, v2) {
        return v1.map((val, idx) => (val + v2[idx]) / 2);
    }

    normalize(v) {
        const length = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
        return v.map(val => val / length);
    }

    subdivide() {
        let newVertices = this.vertices.slice(); // Copy original vertices
        let newIndices = [];
        
        this.indices.forEach(triangle => {
            let v1 = this.vertices[triangle[0]];
            let v2 = this.vertices[triangle[1]];
            let v3 = this.vertices[triangle[2]];

            // Calculate midpoints and normalize them
            let a = this.normalize(this.midpoint(v1, v2));
            let b = this.normalize(this.midpoint(v2, v3));
            let c = this.normalize(this.midpoint(v3, v1));

            // Add new vertices if they don't already exist and get their indices
            let ai = newVertices.findIndex(vertex => vertex.every((val, idx) => val === a[idx]));
            if (ai === -1) { ai = newVertices.length; newVertices.push(a); }

            let bi = newVertices.findIndex(vertex => vertex.every((val, idx) => val === b[idx]));
            if (bi === -1) { bi = newVertices.length; newVertices.push(b); }

            let ci = newVertices.findIndex(vertex => vertex.every((val, idx) => val === c[idx]));
            if (ci === -1) { ci = newVertices.length; newVertices.push(c); }

            // Create new indices for the four new triangles
            newIndices.push([triangle[0], ai, ci]);
            newIndices.push([triangle[1], bi, ai]);
            newIndices.push([triangle[2], ci, bi]);
            newIndices.push([ai, bi, ci]);
        });

        this.vertices = newVertices;
        this.indices = newIndices;
    }

    render(){
        this.subdivide(); // Call this to subdivide before rendering

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
