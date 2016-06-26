/**
 * Main entry point of client-part game engine.
 * Created by llsiriusll06 on 10.05.15.
 */
'use strict';

/**
 * Main game client-holder class.
 * @constructor
 */
var Game = function () {
    this.name = 'Book';
    this.scene = {};
    this.user = false;
    this.container = {};
    this.players = [];
    this.players_array = [];
};

/**
 * Add scene
 * Wrapper around three.js scene object.
 */
Game.prototype.addScene = function () {
    this.scene = new THREE.Scene();
    console.log("BOOK:: scene initiated...");
};

/**
 * Add camera
 * Wrapper around three.js camera actions
 */
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

/**
 * Game render method, main client game loop lives here.
 */
Game.prototype.render = function () {
    // Save game object.
    var that = this;
    var render = function () {
        // Time loop
        requestAnimationFrame(render);
        // Call scene updates to render them.
        that.update();
        if (that.user && that.user != {} && typeof that.user.motion == 'function') {
            // Process user motion.
            that.user.motion();
            // Set focus to current user.
            that.setFocus(that.user.mesh);
        }
        // Render updated scene.
        that.renderer.render(that.scene, that.camera);
    };
    render();
};

Game.prototype.update = function () {
    // Save game object.
    var that = this;
    // Emit socket event update state.
    socket.emit("update state");
    // Catch socket event update state.
    socket.on("update state", function (server_state) {
        // Process game state returned from server
        // and get available players.
        var players = server_state.users;
       // console.log("UPDADE: servers state", server_state);
        // Check if we alerady have players
        // and game contains current user.
        if (players.length !== 0 && that.user !== false) {
            // Traverse those players.
            for (var i in players) {
                // If player returned from server is not current user.
                if (players[i].id !== that.user.id) {
                    // Check if there are no players in game or if they are, but not with current uuid.
                    if (that.players_array.length == 0 || that.players_array.indexOf(players[i].id) == -1) {
                        // Add ghosts to game and render them.
                        that.addGhostPlayer(players[i]);
                    }
                    for (var j in that.players) {
                        if (that.players[j].id == players[i].id) {
                            //@TODO: add more clear way of setting possitions.
                            that.players[j].mesh.rotation._x = players[i].rotation._x;
                            that.players[j].mesh.rotation._y = players[i].rotation._y;
                            that.players[j].mesh.rotation._z = players[i].rotation._z;
                            that.players[j].mesh.position.x = players[i].mesh.x;
                            that.players[j].mesh.position.y = players[i].mesh.y;
                            that.players[j].mesh.position.z = players[i].mesh.z;
                            that.players[j].feet.left.position.x = players[i].feet_left.x;
                            that.players[j].feet.left.position.y = players[i].feet_left.y;
                            that.players[j].feet.left.position.z = players[i].feet_left.z;
                            that.players[j].feet.right.position.x = players[i].feet_right.x;
                            that.players[j].feet.right.position.y = players[i].feet_right.y;
                            that.players[j].feet.right.position.z = players[i].feet_right.z;
                            that.players[j].hands.left.position.x = players[i].hand_left.x;
                            that.players[j].hands.left.position.y = players[i].hand_left.y;
                            that.players[j].hands.left.position.z = players[i].hand_left.z;
                            that.players[j].hands.right.position.x = players[i].hand_right.x;
                            that.players[j].hands.right.position.y = players[i].hand_right.y;
                            that.players[j].hands.right.position.z = players[i].hand_right.z;
                        }
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
    console.log("ADD_PLAYER:method called");
    var that = this;
    var user = false;
    console.log("ADD_PLAYER:player object");
    console.log("====================================================");
    console.log(player);
    console.log("====================================================");
    console.log(that.user == false);
    // Check if player is host and add uuid to each player.
    if (player.id && that.user == false) {
        console.log("ADD_PLAYER:id and game main player exists");
        user = new Player(that.scene, player.id);
        console.log("ADD_PLAYER:new player created", user);
        user.render();
        console.log("ADD_PLAYER:new player renderred");
    }
    else {
         console.error("ADD_PLAYER:No player to add");
         console.trace();
    }
    if (user !== false) {
        console.log("ADD_PLAYER:current player successfully created and added to game");
        that.user = user;
        return true;
    }
    return false;
};

Game.prototype.addGhostPlayer = function (player) {
    console.log("ADD_GHOST:method called");
    var that = this,
        user = false;

    console.log("ADD_GHOST:player object");
    console.log("====================================================");
    console.log(player);
    console.log("====================================================");
    // Check if player is host and add uuid to each player.
    console.log("ADD_GHOST:add new player object to scene");
    user = new Player(that.scene, player.id);
    user.render();

    //else {
      //  console.error("No player to add")
    //}
    if (user !== false) {
        console.log("ADD_GHOST:player succesfully created and added to game.");
        that.players.push(user);
        console.log("ADD_GHOST:players pool", that.players);
        that.players_array.push(player.id);
        console.log("ADD_GHOST:players array pool", that.players_array);
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
    console.log("SET_ASPECT:game object passed to aspect", this);
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

/**
 * Init methods
 */
Game.prototype.init = function () {
    // Start game server loop
    var that = this;
    console.log("INIT:game start, creating game connect event...");
    socket.emit("game connect");
    socket.on("game connect", function (player) {
        console.log("INIT: game connect socket called");
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

