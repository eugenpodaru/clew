$(function () {
    var yaw = 0;
    var pitch = 0;
    var radius = 10;
    var car;
    var container = document.getElementById("scene_container");

    var camera, scene, renderer;

    var mouseX = 0, mouseY = 0;

    var containerWidth = container.clientWidth;
    var containerHeight = container.clientHeight;

    console.log(containerWidth, containerHeight);

    init();
    animate();

    function init() {

        camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 1, 2000);

        // scene

        scene = new THREE.Scene();

        var ambient = new THREE.AmbientLight(0xffffff);
        scene.add(ambient);

        // texture

        var manager = new THREE.LoadingManager();
        manager.onProgress = function (item, loaded, total) {

            console.log(item, loaded, total);

        };

        var texture = new THREE.Texture();

        var onProgress = function (xhr) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.round(percentComplete, 2) + '% downloaded');
            }
        };

        var onError = function (xhr) {
        };


        var imgLoader = new THREE.ImageLoader(manager);
        imgLoader.load(App.getGlobalPluginsPath() + "threejs/masina_new.png", function (image) {
            texture.image = image;
            texture.needsUpdate = true;
        });

        // model
        var objLoader = new THREE.OBJLoader(manager);
        objLoader.load(App.getGlobalPluginsPath() + "threejs/masina_new.jpg", function (object) {

            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material.map = texture;
                }
            });

            object.rotateY(-Math.PI/2);
            object.translateX(3.5);
            object.translateZ(0.5);
            object.translateY(0.5);
            scene.add(object);

            car = object;
            console.log("loaded " + vecToStr(car.position));

        }, onProgress, onError);

        //

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(containerWidth, containerHeight);

        container.appendChild(renderer.domElement);

        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('mousedown', onMouseDown, false);

        window.addEventListener('resize', onWindowResize, false);
    }

    function vecToStr(r) {
        return "(" + r.x + ", " + r.y + ", " + r.z + ")";
    }

    function onMouseDown(e) {
        var vectorMouse = new THREE.Vector3( //vector from camera to mouse
            -(containerWidth/2-e.clientX)*2/containerWidth,
            (containerHeight/2-e.clientY)*2/containerHeight,
            -1/Math.tan(22.5*Math.PI/180)); //22.5 is half of camera frustum angle 45 degree
        vectorMouse.applyQuaternion(camera.quaternion);
        vectorMouse.normalize();
        console.log("Mouse: " + vecToStr(vectorMouse));

        var vectorObject = new THREE.Vector3(); //vector from camera to object
        console.log("car: " + vecToStr(car.position));
        vectorObject.set(car.position.x - camera.position.x,
                        car.position.y - camera.position.y,
                        car.position.z - camera.position.z);
        vectorObject.normalize();
        console.log("vectorObject: " + vecToStr(vectorObject));
        var a = vectorMouse.angleTo(vectorObject);
        var angle = vectorMouse.angleTo(vectorObject)*180/Math.PI;
        if (angle < 1) {
            //mouse's position is near object's position
            console.log("found");
        }
        else
        {
            console.log("not found: " + angle);
        }
    }

    function onWindowResize() {
        containerWidth = container.clientWidth;
        containerHeight = container.clientHeight;

        camera.aspect = containerWidth / containerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(containerWidth, containerHeight);
    }

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - containerWidth / 2) / 2;
        mouseY = (event.clientY - containerHeight / 2) / 2;
    }

    function getArrowKeyDirection (keyCode) {
        return {
            37: 'left',
            39: 'right',
            38: 'up',
            40: 'down'
        }[keyCode];
    }

    function isArrowKey (keyCode) {
        return !!getArrowKeyDirection(keyCode);
    }

    var decrement = 40;
    function up() {
        pitch += Math.PI/decrement;
        if (pitch > Math.PI/2)
            pitch = Math.PI/2;
    }
    function down() {
        pitch -= Math.PI/decrement;
        if (pitch < -Math.PI/2)
            pitch = -Math.PI/2;
    }
    function left() {
        yaw -= Math.PI/decrement;
    }
    function right() {
        yaw += Math.PI/decrement;
    }

    function onKeyDown(event) {
        var direction, keyCode = event.keyCode;

        if (isArrowKey(keyCode)) {
            direction = getArrowKeyDirection(keyCode);
            if (direction == 'up')
                up();
            else if (direction == 'down')
                down();
            else if (direction == 'left')
                left();
            else if (direction == 'right')
                right();
            else if (direction == 'right')
                right();
        }
        else
        {
            var radiusDec = 1;
            var c = String.fromCharCode(keyCode);
            console.log(c);
            if (c == 'W')
                radius -= radiusDec;
            else if (c == 'S')
                radius += radiusDec;
            if (radius < 1)
                radius = 1;
        }
    }

    //
    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        camera.position.x = radius * Math.cos(pitch) * Math.sin (yaw);
        camera.position.y = radius * Math.sin(pitch);
        camera.position.z = radius * Math.cos(pitch) * Math.cos(yaw);

        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
});
