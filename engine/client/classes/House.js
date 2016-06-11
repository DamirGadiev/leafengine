/**
 * Created by llsiriusll06 on 17.05.15.
 */
var House = function (scene, x, y, z, w, h, d) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.h = h;
    this.d = d;
};

House.prototype.render = function () {
    var that = this;
    var scene = that.scene;
    var geometry = new THREE.BoxGeometry(that.w, that.h, that.d);
    var loader = new THREE.TextureLoader();
    var materials = [
        new THREE.MeshLambertMaterial({
            map: loader.load("../assets/w1.jpg")
        }),
        new THREE.MeshLambertMaterial({
            map: loader.load("../assets/w2.png")
        }),
        new THREE.MeshLambertMaterial({
            map: loader.load("../assets/wood34.jpg")
        }),
        new THREE.MeshLambertMaterial({
            map: loader.load("../assets/w2.png")
        }),
        new THREE.MeshLambertMaterial({
            map: loader.load("../assets/w1.jpg")
        }),
        new THREE.MeshLambertMaterial({
            map: loader.load("../assets/w1.jpg")
        })
    ];
    var material = new THREE.MeshFaceMaterial(materials);
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(that.x, that.y, that.z);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);
};