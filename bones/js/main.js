var lesson11 = {
  scene: null, camera: null, renderer: null,
  container: null, controls: null,
  clock: null, stats: null,

  init: function() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xc8e0ff, 0.0003);

    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 1000;
    this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    this.scene.add(this.camera);
    this.camera.position.set(100, 0, 0);
    this.camera.lookAt(new THREE.Vector3(0,0,0));

    this.renderer = new THREE.WebGLRenderer({ antialias:true });
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.renderer.setClearColor(this.scene.fog.color);

    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.container.appendChild(this.renderer.domElement);

    THREEx.WindowResize(this.renderer, this.camera);

    this.controls = new THREE.OrbitControls(this.camera);
    this.controls.target = new THREE.Vector3(0, 0, 0);
    this.controls.maxDistance = 150;

    // Prepare clock
    this.clock = new THREE.Clock();
    // Add lights
    this.scene.add( new THREE.AmbientLight(0xFFFFFF));
    // Load Json model
    this.loadJsonModel();
    // Load Dae model
    // this.loadDaeModel();
  },
  loadJsonModel: function() {

    var jsonLoader = new THREE.JSONLoader(true);
    jsonLoader.load('models/girl.json', function(geometry, materials) {
      materials.forEach(function(mat) {
        mat.skinning = true;
      });
      var modelMesh = new THREE.SkinnedMesh(
        geometry, new THREE.MeshFaceMaterial(materials)
      );
      var mixer = new THREE.AnimationMixer(modelMesh);
      var ani = geometry.animations[0];
      var action = mixer.clipAction(ani);
      action.play();
      var scale = 30;
      modelMesh.position.set(0, -20, 0);
      modelMesh.scale.set(scale, scale, scale);
      lesson11.scene.add(modelMesh);
      lesson11.mixer = mixer;
    });

  },
   loadDaeModel: function() {
    var daeLoader = new THREE.ColladaLoader();
    daeLoader.options.convertUpAxis = true;
    daeLoader.load('models/robot/robot.dae', function(collada) {
      var modelMesh = collada.scene;
      modelMesh.traverse( function (child) {
        if (child instanceof THREE.SkinnedMesh) {
          var animation = new THREE.Animation(child, child.geometry.animation);
          animation.play();
        }
      } );

      var scale = 2.7;
      modelMesh.position.set(0, -20, 0);
      modelMesh.scale.set(scale, scale, scale);

      lesson11.scene.add(modelMesh);
    });
  }
};


function animate() {
  requestAnimationFrame(animate);
  render();
  update();
}

function update() {
  var delta = lesson11.clock.getDelta();
  lesson11.controls.update(delta);
  if(lesson11.mixer){
    lesson11.mixer.update(delta);
  }
  THREE.AnimationHandler.update(delta);
}

function render() {
  if (lesson11.renderer) {
    lesson11.renderer.render(lesson11.scene, lesson11.camera);
  }
}

function initializeLesson() {
  lesson11.init();
  animate();
}

if (window.addEventListener)
  window.addEventListener('load', initializeLesson, false);
else if (window.attachEvent)
  window.attachEvent('onload', initializeLesson);
else window.onload = initializeLesson;
