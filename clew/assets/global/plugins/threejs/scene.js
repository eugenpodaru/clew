$(function () {
    var yaw = 0;
    var pitch = 0;
    var radius = 10;
    var car;
    var container = document.getElementById("scene_container");
    var raycaster;
    var selectedPoints = new Array();
    var line;

    var camera, scene, renderer;
    var frustum = 45;

    var mouseX = 0, mouseY = 0;

    var containerTop = container.getBoundingClientRect().top;
    var containerLeft = container.getBoundingClientRect().left;
    var containerWidth = container.clientWidth;
    var containerHeight = container.clientHeight;

    console.log(containerTop, containerLeft, containerWidth, containerHeight);

    init();
    animate();

    function init() {

        raycaster = new THREE.Raycaster();
        camera = new THREE.PerspectiveCamera(frustum, containerWidth / containerHeight, 1, 2000);

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
    function rmObj(arr,obj) {
        var pos = arr.indexOf(obj);
        if (pos >= 0)
            arr.splice(pos, 1);
    }

    function setDistanceText(txt) {
        $("#distance_label").text(txt);
    }

    function onMouseDown(e) {
        if (selectedPoints.length == 2)
        {
            rmObj(scene.children, selectedPoints[0]);
            rmObj(scene.children, selectedPoints[1]);
            rmObj(scene.children, line);
            setDistanceText("");
            line = undefined;
            selectedPoints = new Array();
            return;
        }

        var mx = e.clientX - containerLeft;
        var my = e.clientY - containerTop;
        console.log(mx, my);
        if (mx < 0 || my < 0 || mx > containerWidth || my > containerHeight)
        {
            console.log("Out");
            return;
        }
        var mouse2D = new THREE.Vector2(
                2*mx/containerWidth - 1,
                -2*my/containerHeight + 1);
        raycaster.setFromCamera(mouse2D, camera);
        var intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length == 0)
        {
            console.log("not found");
        }
        else
        {
            var inter = intersects[0];
            var i;
            for (i = 1; i < intersects.length; i++)
                if (intersects[i].distance < inter)
                    inter = intersects[i];

            var dotGeometry = new THREE.Geometry();
            dotGeometry.vertices.push(inter.point);
            var dotMaterial = new THREE.PointsMaterial( { size: 10,
                sizeAttenuation: false,color:0xff0000, } );
            var dot = new THREE.Points( dotGeometry, dotMaterial );
            selectedPoints.push(dot);
            scene.add( dot );

            if (selectedPoints.length == 2)
            {
                console.log(selectedPoints);
                var material = new THREE.LineBasicMaterial({
                    color: 0x0000ff,
                    linewidth: 10,
                });

                var ln = new THREE.Geometry();
                var pt0 = selectedPoints[0].geometry.vertices[0];
                var pt1 = selectedPoints[1].geometry.vertices[0];
                ln.vertices.push(
                    pt0,
                    pt1
                );
                line = new THREE.Line( ln, material );
                console.log(line);
                scene.add(line);

                var diff = new THREE.Vector3(pt1.x - pt0.x, pt1.y - pt0.y, pt1.z - pt0.z);
                var len = diff.length();
                setDistanceText("Distance: " + len + " m");
                setDistance(len);
            }
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
