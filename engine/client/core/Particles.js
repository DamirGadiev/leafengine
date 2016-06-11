var Particles = function (type) {
    this.type = type;
};

Particles.prototype.render = function (scene) {
    var
        particleCount = 100,
        particleGeometry = new THREE.Geometry(),
        particleMaterial = new THREE.ParticleSystemMaterial({
            color: 0xFFFFFF,
            size: 10,
            map: THREE.ImageUtils.loadTexture(
                "./particle.png"
            ),
            blending: THREE.AdditiveBlending,
            transparent: true
        });
    for (var i = 0; i < particleCount; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 50 - 10;
        vertex.y = Math.random() * 50 - 10;
        vertex.z = Math.random() * 50 - 10;
        particleGeometry.vertices.push(vertex);
    }
    var particles = new THREE.ParticleSystem(particleGeometry, particleMaterial);
    scene.add(particles);
};