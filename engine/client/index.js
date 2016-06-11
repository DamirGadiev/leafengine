// setting up local namespace with anonymous function.
(function () {
    'use strict';
    console.log("BOOK::app started");
    var game = new Game();
    game.init();
    game.render();
    game.addWorld();

})();