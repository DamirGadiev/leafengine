/**
 * Created by llsiriusll06 on 10.05.15.
 */
'use strict';

// Wolrd constructor
var World = function(game, level) {
  this.game = game;
  this.level = (typeof level !== "undefined") ? level : 0;
  this.ground = {};
};

World.prototype.createGround = function() {
  // just to save link to world itself;
  var that = this;
  var mapLoadInterval = setInterval(function() {
    if (that.map !== false) {
      // Select texture
      // TODO: apply level mapping from JSON
      var loader = new THREE.TextureLoader();
      var grass = loader.load("../assets/grass.jpg");
      // assuming you want the texture to repeat in both directions:
      grass.wrapS = THREE.RepeatWrapping;
      grass.wrapT = THREE.RepeatWrapping;

      // how many times to repeat in each direction;
      grass.repeat.set(10, 10);
      grass.anisotropy = 1;

      var geometry = new THREE.PlaneGeometry(1050, 1050, that.dim, that.dim);
      for (var i = 0, l = geometry.vertices.length; i < l; i++) {
        geometry.vertices[i].z = that.map[i];
      }
      var material = new THREE.MeshPhongMaterial({
        map: grass,
        opacity: 1/*transparent: true*/
      });
      var grid = new THREE.Mesh(geometry, material);
      grid.rotation.order = 'YXZ';
      grid.position.y = -5;
      grid.rotation.y = -Math.PI / 2;
      grid.rotation.x = -Math.PI / 2;
      grid.castShadow = true;
      grid.receiveShadow = true;


      that.game.scene.add(grid);

      var size = 500;
      var step = 20;

      var gridHelper = new THREE.GridHelper(size, step);
      that.game.scene.add(gridHelper);

      that.ground = grid;
      clearInterval(mapLoadInterval);
    }
  }, 25);
};

World.prototype.addTrees = function() {
  var that = this;
  var tree1 = new Tree(1, -15, 5, -42, 20, 30, 'white', 6);
    tree1.render(that.game.scene);
    var tree2 = new Tree(1, -55, 0, -30, 12, 14, 'yellow', 2);
    tree2.render(that.game.scene);
    var tree3 = new Tree(1, -16, 0, -28, 12, 20, '#F4BC14', 3);
    tree3.render(that.game.scene);
    var tree4 = new Tree(1, -34, 0, -37, 12, 25, '#FA9AED', 4);
    tree4.render(that.game.scene);
    var tree5 = new Tree(1, 45, 5, 15, 20, 33, '#F4F014', 8);
    tree5.render(that.game.scene);
};

World.prototype.addLamp = function() {
  var that = this;
  var lamp = new Lamp(that, 20, 5, 35, "yellow", 5, 25);
  lamp.render();
  var lamp1 = new Lamp(that, 30, 5, -35, "blue", 5, 45);
  lamp1.render();
  //var lamp2 = new Lamp(that, 20, 5, 0, "red", 3, 25);
  //lamp2.render();
  //var lamp3 = new Lamp(that, 20, 5,-10, "green", 3, 25);
  //lamp3.render();
};

World.prototype.addHouse = function() {
  var house = new House(this.game.scene, 60, 10, -45, 30, 30, 60);
  house.render();
};


World.prototype.loadMap = function() {
  var that = this;
  that.map = false;
  that.dim = 9;
  getJSON("http://localhost:3000/map/level" + that.level + ".json",
    function(data) {
      that.map = data.level;
      that.dim = data.dim;
    },
    function(status) {
      console.log(status);
    });
};

World.prototype.levelInit = function() {
  this.loadMap();
  this.createGround();
  this.addTrees();
  this.addHouse();
  //this.addLamp();
};
