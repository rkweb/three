var renderer = new THREE.WebGLRenderer({
    alpha:true, 
    antialias:true
});
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, $(document).width() / $(document).height(),1,1000);
camera.position.set(-58,175,350);
camera.target = new THREE.Vector3( 0, 0, 0 );
camera.lookAt(scene.position);
renderer.setSize($(document).width(),$(document).height());

// var loader = new THREE.JSONLoader(true);
// loader.load("lb.js", function ( geometry, materials) {
//     var material = new THREE.MeshFaceMaterial(materials);
//    	var mesh = new THREE.Mesh(geometry, material);
//     mesh.scale.set(0.3, 0.3, 0.3);
//     mesh.position.set(0,0,0);
//     // console.log(mesh.material);
//     // mesh.material.materials[0].color = {'r':0.2,"g":0.1,"b":0.1};
//     scene.add(mesh);
// });


var group = new THREE.Object3D;
scene.add(group);
var texture = new THREE.TextureLoader().load("./image/grasslight-big.jpg");
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(8, 8);

var color = 0xffffff;
var ambient = 0x888888;
  geometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
  var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, 
  ambient:ambient, map:texture, side:THREE.DoubleSide}));
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0;
group.add(mesh);

// var onProgress = function ( xhr ) {  
// 	if ( xhr.lengthComputable ) {  
//     	var percentComplete = xhr.loaded / xhr.total * 100;  
//     }  
// };  
// var mtlLoader = new THREE.MTLLoader();
// mtlLoader.load('models/bmw.mtl', function(materials){
//    	materials.preload();
// 	var objLoader = new THREE.OBJLoader();
//    	objLoader.setMaterials(materials);
//    	objLoader.load('models/bmw.obj',function(obj){
// 	  	obj.traverse(function(child) {
// 	        if (child instanceof THREE.Mesh) {
// 	            child.material.side = THREE.DoubleSide;
// 	        }
// 	    });
//       	obj.position.set(0,0,0);
//         obj.scale.set(0.7,0.7,0.7);
//         group.add(obj);
      	
//     },onProgress);
// });


var loader = new THREE.BinaryLoader();
loader.load( "./gallardo/GallardoNoUv_bin.js", function(  geometry, materials ){ 
  var material = new THREE.MeshFaceMaterial(materials);
  var mesh = new THREE.Mesh( geometry, material);
  console.log(mesh);
  mesh.material.materials[1].color = mesh.material.materials[2].color = mesh.material.materials[4].color =mesh.material.materials[5].color = mesh.material.materials[6].color = {"r":0.1,"g":0.1,"b":0.1};
  mesh.material.materials[3].color = {"r":1,"g":0.3,"b":0.1};
  mesh.position.set(0,26,0);
  mesh.scale.set(0.5,0.5,0.5);
  group.add(mesh);
  setInterval(function(){
    mesh.material.materials[3].color = {"r":Math.random(),"g":Math.random(),"b":Math.random()};
  },3000);
});


// var loader = new THREE.OBJLoader();
//  var texture = new THREE.TextureLoader().load("img.jpg");
// loader.load('chahu/chahu.obj', function(obj) {
//     obj.traverse(function(child) {
//         if (child instanceof THREE.Mesh) {
//             child.material = new THREE.MeshLambertMaterial({
//                 map:texture,
//                 side: THREE.DoubleSide
//             });
//         }
//     });
//     mesh = obj;
//     mesh.scale.set(6,6,6);
//     scene.add(obj);
// });

var light = new THREE.AmbientLight(0xffffff);
scene.add(light);

var light = new THREE.PointLight(0xffffff, 1.5, 200);
light.position.set(0, 50, 20);
scene.add(light);

var controls = new THREE.OrbitControls(camera,renderer.domElement );
controls.enableZoom = false;
controls.minDistance = 250;
controls.maxDistance = 500;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
controls.rotateSpeed = 0.2;
controls.maxPolarAngle = Math.PI/2.1;

function render(){
 	controls.update();
    requestAnimationFrame(render);
    renderer.render(scene,camera);
}
render();
$('.main')[0].appendChild(renderer.domElement);