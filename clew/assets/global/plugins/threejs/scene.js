$(function () {
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
        camera.position.z = 250;

        // scene

        scene = new THREE.Scene();

        var ambient = new THREE.AmbientLight(0x101030);
        scene.add(ambient);

        var directionalLight = new THREE.DirectionalLight(0xffeedd);
        directionalLight.position.set(0, 0, 1);
        scene.add(directionalLight);

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
        imgLoader.load(App.getGlobalPluginsPath() + "threejs/20161210143259.png", function (image) {
            texture.image = image;
            texture.needsUpdate = true;
        });

        // model
        var objLoader = new THREE.OBJLoader(manager);
        objLoader.load(App.getGlobalPluginsPath() + "threejs/20161210143259.jpg", function (object) {

            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material.map = texture;
                }
            });

            object.scale.set(30, 30, 30);
            scene.add(object);

        }, onProgress, onError);

        //

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(containerWidth, containerHeight);

        container.appendChild(renderer.domElement);

        document.addEventListener('mousemove', onDocumentMouseMove, false);

        window.addEventListener('resize', onWindowResize, false);
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

    //
    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        camera.position.x += (mouseX - camera.position.x) * .05;
        camera.position.y += (-mouseY - camera.position.y) * .05;

        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
});