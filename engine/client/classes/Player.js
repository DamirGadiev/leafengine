/**
 * Created by llsiriusll06 on 10.05.15.
 * Basic player class...
 */


var Player = function(scene, id) {
  this.id = id;
  this.scene = scene;
  this.position = new THREE.Vector3(0, 0, 0);
};

Player.prototype.init = function(args){
  var head = new THREE.SphereGeometry(32, 8, 8),
      hand = new THREE.SphereGeometry(8, 4, 4),
      foot = new THREE.SphereGeometry(16, 4, 4, 0, Math.PI * 2, 0, Math.PI / 2),
      nose = new THREE.SphereGeometry(4, 4, 4),
      // Set the material, the "skin"
      material = new THREE.MeshPhongMaterial(args);
  this.mesh = new THREE.Object3D();
  this.mesh.castShadow = true;
  this.mesh.position.y = 48;
  // Set and add its head
  this.head = new THREE.Mesh(head, material);
  this.head.position.y = 0;
  this.mesh.add(this.head);
  // Set and add its hands
  this.hands = {
    left: new THREE.Mesh(hand, material),
    right: new THREE.Mesh(hand, material)
  };
  this.hands.left.position.x = -40;
  this.hands.left.position.y = -8;
  this.hands.right.position.x = 40;
  this.hands.right.position.y = -8;
  this.mesh.add(this.hands.left);
  this.mesh.add(this.hands.right);
  // Set and add its feet
  this.feet = {
    left: new THREE.Mesh(foot, material),
    right: new THREE.Mesh(foot, material)
  };
  this.feet.left.position.x = -20;
  this.feet.left.position.y = -48;
  this.feet.left.rotation.y = Math.PI / 4;
  this.feet.right.position.x = 20;
  this.feet.right.position.y = -48;
  this.feet.right.rotation.y = Math.PI / 4;
  this.mesh.add(this.feet.left);
  this.mesh.add(this.feet.right);
  // Set and add its nose
  this.nose = new THREE.Mesh(nose, material);
  this.nose.position.y = 0;
  this.nose.position.z = 32;
  this.mesh.add(this.nose);
  // Set the vector of the current motion
  this.direction = new THREE.Vector3(0, 0, 0);
  // Set the current animation step
  this.step = 0;
};

Player.prototype.setDirection = function (controls) {
  'use strict';
  // Either left or right, and either up or down (no jump or dive (on the Y axis), so far ...)
  var x = controls.left ? 1 : controls.right ? -1 : 0,
      y = 0,
      z = controls.up ? 1 : controls.down ? -1 : 0;
  this.direction.set(x, y, z);
};

Player.prototype.motion = function(){
  'use strict';
  // (if any)
  if (this.direction.x !== 0 || this.direction.z !== 0) {
    // Rotate the character
     this.rotate();
    // ... we move the character
     this.move();
    return true;
  }
};

Player.prototype.rotate = function(){
  'use strict';
  // Set the direction's angle, and the difference between it and our Object3D's current rotation
  var angle = Math.atan2(this.direction.x, this.direction.z),
      difference = angle - this.mesh.rotation.y;
  // If we're doing more than a 180°
  if (Math.abs(difference) > Math.PI) {
    // We proceed to a direct 360° rotation in the opposite way
    if (difference > 0) {
      this.mesh.rotation.y += 2 * Math.PI;
    } else {
      this.mesh.rotation.y -= 2 * Math.PI;
    }
    // And we set a new smarter (because shorter) difference
    difference = angle - this.mesh.rotation.y;
    // In short : we make sure not to turn "left" to go "right"
  }
  // Now if we haven't reached our target angle
  if (difference !== 0) {
    // We slightly get closer to it
    this.mesh.rotation.y += difference / 4;
  }
};

Player.prototype.move = function(){
  'use strict';
  // We update our Object3D's position from our "direction"
  this.mesh.position.x += this.direction.x * ((this.direction.z === 0) ? 4 : Math.sqrt(8));
  this.mesh.position.z += this.direction.z * ((this.direction.x === 0) ? 4 : Math.sqrt(8));

  // Now let's use Sine and Cosine curves, using our "step" property ...
  this.step += 1 / 4;
  // ... to slightly move our feet and hands
  this.feet.left.position.setZ(Math.sin(this.step) * 16);
  this.feet.right.position.setZ(Math.cos(this.step + (Math.PI / 2)) * 16);
  this.hands.left.position.setZ(Math.cos(this.step + (Math.PI / 2)) * 8);
  this.hands.right.position.setZ(Math.sin(this.step) * 8);

  var that = this;

  var positions = {
    "mesh":that.mesh.position,
    "feet_left":that.feet.left.position,
    "feet_right":that.feet.right.position,
    "hand_left":that.hands.left.position,
    "hand_right":that.hands.left.position
  };

   socket.emit('move player', positions);
};

Player.prototype.render = function() {
  var that = this;
  that.init({color:'blue'});
  console.log("here");
  that.scene.add( this.mesh );
};
