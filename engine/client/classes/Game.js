/**
 * Main entry point of client-part game engine.
 * Created by llsiriusll06 on 10.05.15.
 */
'use strict';

var Game = function() {
  this.name = 'Book';
  this.scene = {};
  this.user = {};
  this.container = {};
};

Game.prototype.addScene = function() {
  this.scene = new THREE.Scene();
  console.log("BOOK:: scene initiated...");
};

Game.prototype.addCamera = function() {

  //aspect ratio
  var that = this,
      aspect = window.innerWidth / window.innerHeight,
      d = 50;

  var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);
  console.log("BOOK:: camera initiated...");

  camera.position.set(-400, 400, 400);
  camera.rotation.order = 'YXZ';
  camera.rotation.y = -Math.PI / 4;
  camera.rotation.x = Math.atan(-1 / Math.sqrt(2));

  that.camera = camera;
};

Game.prototype.addLight = function() {
  var that = this;
  if (this.scene) {
    var ambientLight = new THREE.AmbientLight(0x212223);
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-40, 40, 50);
    directionalLight.castShadow = true;
    //add to scene
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 100, 1000, 100 );
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    that.scene.add( spotLight );
   // that.scene.add(ambientLight);
    that.scene.add(directionalLight);
  }
};

Game.prototype.addRenderer = function() {
  var that = this;
  var renderer = new THREE.WebGLRenderer();

  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = false;

  renderer.shadowCameraNear = 3;
  renderer.shadowCameraFar = that.camera.far;
  renderer.shadowCameraFov = 10;

  renderer.shadowMapBias = 0.0039;
  renderer.shadowMapDarkness = 5;
  renderer.shadowMapWidth = 124;
  renderer.shadowMapHeight = 124;

  renderer.setSize(window.innerWidth, window.innerHeight);
  if (document) {
    document.body.appendChild(renderer.domElement);
  }
  that.renderer = renderer;
};

Game.prototype.addControls = function() {
  this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
};

Game.prototype.render = function() {
  var that = this;
  var render = function () {
    requestAnimationFrame(render);
    that.user.motion();
    that.setFocus(that.user.mesh);
    //that.update();
    that.renderer.render(that.scene, that.camera);
  };
  render();
};

Game.prototype.checkLevel = function() {
  this.level = getParameterByName("level");
};

Game.prototype.addWorld = function() {
  var that = this;
  this.checkLevel();
  this.world = new World(that, that.level);
  console.log(this.world);
  this.world.levelInit();
};

Game.prototype.addPlayer = function () {
  var that = this;
  var user = new Player(that.scene);
  user.render();
  this.user = user;
};

Game.prototype.setContainer = function() {
  this.container = jQuery('canvas');
};

Game.prototype.setControls = function() {
  'use strict';
  // Within jQuery's methods, we won't be able to access "this"
  var user = this.user,
  // State of the different controls
      controls = {
        left: false,
        up: false,
        right: false,
        down: false
      },
      that = this;
  // When the user presses a key
  jQuery(document).keydown(function (e) {
    var prevent = true;
    // Update the state of the attached control to "true"
    switch (e.keyCode) {
      case 37:
        controls.left = true;
        break;
      case 38:
        controls.up = true;
        break;
      case 39:
        controls.right = true;
        break;
      case 40:
        controls.down = true;
        break;
      default:
        prevent = false;
    }
    // Avoid the browser to react unexpectedly
    if (prevent) {
      e.preventDefault();
    } else {
      return;
    }
    // Update the character's direction
    user.setDirection(controls);
  });
  // When the user releases a key
  jQuery(document).keyup(function (e) {
    var prevent = true;
    // Update the state of the attached control to "false"
    switch (e.keyCode) {
      case 37:
        controls.left = false;
        break;
      case 38:
        controls.up = false;
        break;
      case 39:
        controls.right = false;
        break;
      case 40:
        controls.down = false;
        break;
      default:
        prevent = false;
    }
    // Avoid the browser to react unexpectedly
    if (prevent) {
      e.preventDefault();
    } else {
      return;
    }
    // Update the character's direction
    user.setDirection(controls);
  });
  // On resize
  jQuery(window).resize(function () {
    // Redefine the size of the renderer
    that.setAspect();
  });
};

// Defining the renderer's size
Game.prototype.setAspect = function () {
  'use strict';
  console.log(this);
  var that = this;
  // Fit the container's full width
  var w = that.container.width(),
  // Fit the initial visible area's height
      h = jQuery(window).height() - that.container.offset().top - 20;
  // Update the renderer and the camera
  this.renderer.setSize(w, h);
  this.camera.aspect = w / h;
  this.camera.updateProjectionMatrix();
};

Game.prototype.setFocus = function(object) {
  // Updating the camera to follow and look at a given Object3D / Mesh
  'use strict';
  this.camera.position.set(object.position.x, object.position.y + 128, object.position.z - 256);
  this.camera.lookAt(object.position);
};

Game.prototype.setSocket = function() {
  this.io = io();
};


Game.prototype.init = function() {
  this.addScene();
  this.addCamera();
  this.addLight();
  this.addRenderer();
 // this.addControls();
  this.addPlayer();
  this.setContainer();
  this.setAspect();
  this.setFocus(this.user.mesh);
  this.setControls();
  this.setSocket();
};

