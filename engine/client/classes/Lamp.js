/**
 * Created by llsiriusll06 on 16.05.15.
 */
var Lamp = function (world, x, y, z, color, size, radial) {
    this.id = 'test';
    this.world = world;
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = color;
    this.size = size;
    this.radial = radial;
};

Lamp.prototype.render = function () {
    var that = this;
    var scene = this.world.game.scene;
    var loader = new THREE.TextureLoader();

    // light source
    var bluePoint = new THREE.PointLight(that.color, that.size, that.radial);
    bluePoint.position.set(that.x, that.y, that.z);
    scene.add(bluePoint);
    // scene.add(new THREE.PointLightHelper(bluePoint, 1));
    var lightTex = loader.load('../assets/particle.png');
    // particle
    var particleGeometry = new THREE.Geometry();
    var particleMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: that.size * 15,
        map: lightTex,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    var vertex = new THREE.Vector3();
    vertex.x = that.x;
    vertex.y = that.y;
    vertex.z = that.z;
    particleGeometry.vertices.push(vertex);
    var particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    var skin = loader.load("../assets/kora.jpg");
    // assuming you want the texture to repeat in both directions:
    skin.wrapS = THREE.RepeatWrapping;
    skin.wrapT = THREE.RepeatWrapping;
    skin.repeat.set(2, 2);
    var geometry = new THREE.CylinderGeometry(0.2, 0.2, 9, 32);
    var material = new THREE.MeshLambertMaterial({map: skin});
    var cylinder = new THREE.Mesh(geometry, material);

    cylinder.position.x = that.x;
    cylinder.position.y = that.y - 5;
    cylinder.position.z = that.z;
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    scene.add(cylinder);
};