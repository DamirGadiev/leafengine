var Tree = function (type, x, y, z, height, radius, color, rotate) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.z = z;
    this.height = height;
    this.radius = radius;
    this.color = color;
    this.rotate = rotate;
}

Tree.prototype.render = function (scene) {
    var that = this;
    var loader = new THREE.TextureLoader();
    switch (that.type) {
        case 1:
            // render texture
            var low_tree = loader.load("../assets/LowPolyTree_02.png");
            low_tree.wrapS = THREE.RepeatWrapping;
            low_tree.wrapT = THREE.RepeatWrapping;
            low_tree.repeat.set(1, 1);

            var treeItem1geometry = new THREE.PlaneGeometry(this.radius, this.radius, 10, 10);
            var treeItem1material = new THREE.MeshLambertMaterial({
                map: low_tree,
                opacity: 1,
                transparent: true,
                color: that.color
            });
            var treeItem1plane = new THREE.Mesh(treeItem1geometry, treeItem1material);

            treeItem1plane.rotation.order = 'YXZ';
            treeItem1plane.position.y = that.y + 11;
            treeItem1plane.position.x = that.x;
            treeItem1plane.position.z = that.z;
            treeItem1plane.rotation.y = -Math.PI / 5;
            treeItem1plane.rotation.x = -Math.PI / 5;
            treeItem1plane.rotation.z = -Math.PI / that.rotate;
            treeItem1plane.receiveShadow = true;
            treeItem1plane.castShadow = true;
            treeItem1plane.material.side = THREE.DoubleSide;


            scene.add(treeItem1plane);
            var skin = loader.load("../assets/wood34.jpg");
            // assuming you want the texture to repeat in both directions:
            skin.wrapS = THREE.RepeatWrapping;
            skin.wrapT = THREE.RepeatWrapping;
            skin.repeat.set(2, 2);
            var geometry = new THREE.CylinderGeometry(0.2, 0.5, this.height, 32);
            var material = new THREE.MeshLambertMaterial({map: skin});
            var cylinder = new THREE.Mesh(geometry, material);

            cylinder.position.x = that.x;
            cylinder.position.y = that.y;
            cylinder.position.z = that.z;
            cylinder.castShadow = true;
            cylinder.receiveShadow = true;
            scene.add(cylinder);

            break;

    }
}