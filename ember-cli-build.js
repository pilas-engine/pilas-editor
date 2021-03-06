/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    emberCliFontAwesome: {
      useScss: true
    },
    nosprite: [{ 
      debug: false,
      src: [
        'images/sprites/**/*.png'
      ],
      spritePath: 'assets/ember-sprites.png',
      stylesheetPath: 'assets/ember-sprites.css',
      stylesheet: 'css',
      stylesheetOptions: {
        prefix: 'img-',
        spritePath: 'ember-sprites.png',
        pixelRatio: 1,
      },
      layoutOptions: {
        padding: 2,
      },
      optiping: (process.env.NODE_ENV === 'production'),
    }
  ]
  });

  //app.import(app.bowerDirectory + '/bootstrap/dist/css/bootstrap.css');
  //app.import(app.bowerDirectory + '/bootstrap/dist/js/bootstrap.js');
  //app.import(app.bowerDirectory + '/bootstrap/dist/fonts/glyphicons-halflings-regular.woff', {
  //  destDir: 'fonts'
  //});


  app.import('vendor/fonts/ratchicons.eot', {destDir: 'fonts'});
  app.import('vendor/fonts/ratchicons.svg', {destDir: 'fonts'});
  app.import('vendor/fonts/ratchicons.ttf', {destDir: 'fonts'});
  app.import('vendor/fonts/ratchicons.woff', {destDir: 'fonts'});

  app.import("vendor/uikit.css");
  app.import("vendor/uikit.gradient.css");
  app.import("vendor/uikit.js");

  app.import('vendor/ace.js');

  app.import('vendor/ext-language_tools.js');
  app.import('vendor/mode-typescript.js');

  //app.import('vendor/phaser.js');
  //app.import('vendor/pilasengine.js');

  app.import('vendor/theme-monokai.js');
  app.import('vendor/theme-xcode.js');

  app.import('vendor/keybinding-vim.js');

  app.import('vendor/typescriptServices.js');
  app.import('vendor/transpiler.js');



  /* Necesarios para ember-cli-jsconsole */
  /*
  app.import("./bower_components/codemirror/lib/codemirror.css");
  app.import("./bower_components/codemirror/theme/eclipse.css");
  app.import("./bower_components/codemirror/lib/codemirror.js");
  app.import("./bower_components/codemirror/addon/hint/javascript-hint.js");
  app.import("./bower_components/codemirror/addon/hint/show-hint.css");
  app.import("./bower_components/codemirror/addon/hint/show-hint.js");

  app.import("./bower_components/codemirror/mode/javascript/javascript.js");

  app.import("./bower_components/jsconsole/styles/console.css");
  app.import("./bower_components/jsconsole/dist/console.js");
  app.import("./bower_components/jsconsole/styles/gutter-icons.png", {destDir: 'assets/'});
  app.import("./bower_components/jsconsole/styles/meslo/MesloLGSDZ-Regular.woff", {destDir: 'assets/meslo'});
  */

  /* FIN: Necesarios para ember-cli-jsconsole */

  var phaserAssets = new Funnel('bower_components/phaser/', {
    srcDir: '/build',
    include: ['phaser.js'],
    destDir: '/libs/'
  });

  var gsapAssets = new Funnel('bower_components/gsap/', {
    srcDir: '/src/uncompressed',
    include: ['TweenMax.js'],
    destDir: '/libs/'
  });

  process.setMaxListeners(1000);

  return app.toTree(MergeTrees([phaserAssets, gsapAssets]));
};
