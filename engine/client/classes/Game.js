/**
 * Main entry point of client-part game engine.
 * Created by llsiriusll06 on 10.05.15.
 */
'use strict';

var Game = function () {
    this.name = 'Book';
    this.scene = {};
    this.user = false;
    this.container = {};
    this.players = [];
    this.players_array = [];
};

Game.prototype.addScene = function () {
    this.scene = new THREE.Scene();
    console.log("BOOK:: scene initiated...");
};

Game.prototype.addCamera = function () {

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

Game.prototype.addLight = function () {
    var that = this;
    if (this.scene) {
        var ambientLight = new THREE.AmbientLight(0x212223);
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(-40, 40, 50);
        directionalLight.castShadow = true;
        //add to scene
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(100, 1000, 100);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;

        spotLight.shadow.camera.near = 500;
        spotLight.shadow.camera.far = 4000;
        spotLight.shadow.camera.fov = 30;

        that.scene.add(spotLight);
        // that.scene.add(ambientLight);
        that.scene.add(directionalLight);
    }
};

Game.prototype.addRenderer = function () {
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

Game.prototype.addControls = function () {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
};

Game.prototype.render = function () {
    var that = this;
    var render = function () {
        requestAnimationFrame(render);
        that.update();
        if (that.user && that.user != {} && typeof that.user.motion == 'function') {
            that.user.motion();
            that.setFocus(that.user.mesh);
        }
        that.renderer.render(that.scene, that.camera);
    };
    render();
};

Game.prototype.update = function () {
    var that = this;
    socket.emit("update state");
    socket.on("update state", function (server_state) {
        var players = server_state.users;
        if (players.length !== 0 && that.user !== false) {
            for (var i in players) {
                if (players[i].id !== that.user.id) {
                    if (that.players_array.length == 0 || that.players_array.indexOf(players[i].id) == -1) {
                        that.addGhostPlayer(players[i]);
                    }
                }
            }
        }
    });
};

Game.prototype.checkLevel = function () {
    this.level = getParameterByName("level");
};

Game.prototype.addWorld = function () {
    var that = this;
    this.checkLevel();
    this.world = new World(that, that.level);
    console.log(this.world);
    this.world.levelInit();
};

Game.prototype.addPlayer = function (player) {
    var that = this;
    var user = false;
    console.log(player);
    console.log(that.user == false);
    console.log("added regular");
    // Check if player is host and add uuid to each player.
    if (player.id && that.user == false) {
        user = new Player(that.scene, player.id);
        user.render();
        console.log("jee");
    }
    else {
         console.error("No player to add");
         console.trace();
    }
    if (user !== false) {
        that.user = user;
        return true;
    }
    return false;
};

Game.prototype.addGhostPlayer = function (player) {
    var that = this,
        user = false;
    console.log(player);
    // Check if player is host and add uuid to each player.
    user = new Player(that.scene, player.id);
    user.render();

    //else {
      //  console.error("No player to add")
    //}
    if (user !== false) {
        console.log("added ghost");
        that.players.push(user);
        that.players_array.push(player.id)
    }
    return false;
};

Game.prototype.addPlayers = function () {
    var that = this;
};

Game.prototype.setContainer = function () {
    this.container = jQuery('canvas');
};

Game.prototype.setControls = function () {
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

Game.prototype.setFocus = function (object) {
    // Updating the camera to follow and look at a given Object3D / Mesh
    'use strict';
    this.camera.position.set(object.position.x, object.position.y + 128, object.position.z - 256);
    this.camera.lookAt(object.position);
};

Game.prototype.setSocket = function () {
    this.io = io();
};


Game.prototype.init = function () {
    // Start game server loop
    var that = this;
    socket.emit("game connect");
    socket.on("game connect", function (player) {
        console.log("again called");
        that.addPlayer(player);
        that.setFocus(that.user.mesh);
        that.setControls();
    });
    this.addScene();
    this.addCamera();
    this.addLight();
    this.addRenderer();
    this.setContainer();
    this.setAspect();
    this.setSocket();
};

