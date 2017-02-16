
var container, ambientLight, pointLight, loader, car, camera, scene, renderer, mouseX, mouseY;
var carBodyMat, chromeMat, trimMat, glassMat, interiorMat, driverMat, tyreMat;
var _referenceX, _referenceY, _targetXRad, _targetYRad, _radius, _xRad, _yRad, renderedObjects, count;
var _speed = .005;
var _targetRadius = 500;
var target = new THREE.Vector3();
var dragSmoothing = 0.1;

count = _referenceX = _referenceY = _targetXRad = _targetYRad = _radius = _xRad = _yRad = renderedObjects = 0;

function start ()
{
    if (Detector.webgl)
    {
        init();
    }
    else
    {
        Detector.addGetWebGLMessage();
    }
}

function init ()
{
    container = document.getElementById('container');

    camera = new THREE.Camera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 150;
    camera.position.x = 500;
    camera.target.position.y = 150;

    scene = new THREE.Scene();

    ambientLight = new THREE.AmbientLight(0xFFFFFF, 2);
    ambientLight.position.x = 0;
    ambientLight.position.y = 800;
    ambientLight.position.z = 300;
    scene.addLight(ambientLight);

    // pointLight = new THREE.DirectionalLight(0xFFFFFF, 1.5);
    // pointLight.position.x = 0;
    // pointLight.position.y = 800;
    // pointLight.position.z = 300;
    // pointLight.position.normalize();
    // scene.addLight(pointLight);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    car = new THREE.Object3D();
    scene.addObject(car);

    createEnvironment();
    createCar();
}

function createEnvironment()
{
 
    carBodyMat = new THREE.MeshLambertMaterial( { color: 0xffffff, combine: THREE.MultiplyOperation, reflectivity: 1, map: ImageUtils.loadTexture('textures/car_paint.jpg')} );
    chromeMat = new THREE.MeshPhongMaterial( { });
    glassMat = new THREE.MeshPhongMaterial( { opacity: 0.2});
    trimMat = new THREE.MeshLambertMaterial({ color: 0x000000,opacity:0.2});
    interiorMat = new THREE.MeshBasicMaterial( { map: ImageUtils.loadTexture('textures/MURCIELAGO_INTERIOR.jpg') } );
    driverMat = new THREE.MeshBasicMaterial( { color: 0xffff00, combine: THREE.MultiplyOperation, map: ImageUtils.loadTexture('textures/DRIVER.jpg')} );
    tyreMat = new THREE.MeshPhongMaterial({ combine: THREE.MultiplyOperation});
}

function createCar ()
{
    console.log('loading part');
    loader = new THREE.JSONLoader(true);
    document.body.appendChild( loader.statusDomElement );

    //body
    loader.load({ model: "js/objects/car_body.js", callback: function ( geometry ) { addPart(geometry, 0, 150, 0, carBodyMat)}});
    loader.load({ model: "js/objects/chrome.js", callback: function ( geometry ) { addPart(geometry, 0, 150, -17, chromeMat)}});
    loader.load({ model: "js/objects/glass.js", callback: function ( geometry ) { addPart(geometry, 0, 172, 91, glassMat)}});

    //tyres
    loader.load({ model: "js/objects/wheel_rr.js", callback: function ( geometry ) { addPart(geometry, 105, 120, -175, tyreMat)}});
    loader.load({ model: "js/objects/wheel_fr.js", callback: function ( geometry ) { addPart(geometry, 100, 110, 155, tyreMat)}});
    loader.load({ model: "js/objects/wheel_fl.js", callback: function ( geometry ) { addPart(geometry, -100, 110, 155, tyreMat)}});
    loader.load({ model: "js/objects/wheel_rl.js", callback: function ( geometry ) { addPart(geometry, -105, 120, -175, tyreMat)}});
    //alloys
    loader.load({ model: "js/objects/alloy_rr.js", callback: function ( geometry ) { addPart(geometry, 105, 120, -175, chromeMat)}});
    loader.load({ model: "js/objects/alloy_fr.js", callback: function ( geometry ) { addPart(geometry, 100, 110, 155, chromeMat)}});
    loader.load({ model: "js/objects/alloy_fl.js", callback: function ( geometry ) { addPart(geometry, -100, 110, 155, chromeMat)}});
    loader.load({ model: "js/objects/alloy_rl.js", callback: function ( geometry ) { addPart(geometry, -105, 120, -175, chromeMat)}});

    //trims etc
    loader.load({ model: "js/objects/trims.js", callback: function ( geometry ) { addPart(geometry, 0, 145, -2, trimMat)}});
    loader.load({ model: "js/objects/window_rims.js", callback: function ( geometry ) { addPart(geometry, 0, 186, 47, trimMat)}});
    loader.load({ model: "js/objects/interior.js", callback: function ( geometry ) { addPart(geometry, 0, 150, 0, interiorMat)}});
    loader.load({ model: "js/objects/driver.js", callback: function ( geometry ) { addPart(geometry, 50, 150, 75, driverMat)}});
    startRendering();
}

function addPart (geometry, x, y, z, material)
{
    loader.statusDomElement.innerHTML = "Creating model ...";
    var object = new THREE.Mesh(geometry, material);
    object.position.y = y;
    object.position.x = x;
    object.position.z = z;
    object.scale.x = object.scale.y = object.scale.z += 75;
    console.log(object);
    car.addChild(object);
    renderedObjects++;
    if(renderedObjects > 7){
        loader.statusDomElement.style.display = "none";
    }
    else
    {
        loader.statusDomElement.innerHTML = "Model Loaded";
    }
}

function startRendering()
{
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    loop();
}

function onDocumentMouseDown(e)
{
    event.preventDefault();

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mouseout', onDocumentMouseOut, false );
}

function removeListeners()
{
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onDocumentMouseUp(e)
{
    removeListeners();
}

function onDocumentMouseOut(e)
{
    removeListeners();
}

function onDocumentMouseMove(e)
{
    mouseX = e.clientX;
    mouseY = e.clientY;

    var dx  = mouseX - _referenceX;
	var dy  = mouseY - _referenceY;
	var bound = Math.PI * .5 - .05;
    _referenceX = mouseX;
	_referenceY = mouseY;

    _targetXRad += dx * _speed;
	_targetYRad += dy * _speed;

    if (_targetYRad > bound) _targetYRad = bound;
	else if (_targetYRad < -bound) _targetYRad = -bound;

    _radius += (_targetRadius - _radius) * dragSmoothing;
	_xRad += (_targetXRad - _xRad) * dragSmoothing;
	_yRad += (_targetYRad - _yRad) * dragSmoothing;

    var cy  = Math.cos(_yRad)*_radius;
    camera.position.x = target.x - Math.sin(_xRad)*cy;
	camera.position.y = -(target.y - Math.sin(_yRad)  *_radius);
	camera.position.z = target.z - Math.cos(_xRad) * cy;

    if(camera.position.y < 257){
        camera.position.y = 257;
    }
}



function loop ()
{   
    // console.log(camera.position)
    // count += .025;
    // pointLight.position.x = Math.sin(count) * 150000;
    // pointLight.position.y = 800;
    // pointLight.position.z = Math.cos(count) * 150000;
    
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}
init();
loop();
setInterval(function(){
    
},2000);


