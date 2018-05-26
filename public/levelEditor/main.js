let renderer, camera, scene, axes, objects = [];


$(function () {
    Math.radians = function (degrees) {
        return degrees * Math.PI / 180;
    };

// Converts from radians to degrees.
    Math.degrees = function (radians) {
        return radians * 180 / Math.PI;
    }

    camera = new THREE.PerspectiveCamera(45, 1500 / 700, 1, 20000);

    camera.position.set(400, 400, 400);

    scene = new THREE.Scene();
    let grid = new THREE.GridHelper(20000, 2000, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);


    axes = new THREE.AxesHelper(10000)


    scene.background = new THREE.Color(0xa0a0a0);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(1500, 700)

    var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControl.addEventListener('change', function () {
        renderer.render(scene, camera)
    });


    $("#root").append(renderer.domElement);


    let axesAdded = true
    $('#axes').on('click', function () {
        $('#axes').toggleClass('check')
        axesAdded = !axesAdded
        if (axesAdded) {
            scene.remove(axes)

        }
        else {
            scene.add(axes)
        }
    })


    $('#newCube').on('click', function () {
        console.log('aaa')
        let geometry = new THREE.BoxGeometry(10, 10, 10);
        let material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('../textures/components/default.jpg'),
            side: THREE.DoubleSide,
            opacity: 1
        });
        let mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh)
        let option = document.createElement('div')
        option.innerHTML = 'cube'
        option.mesh = mesh;
        $(option).on('click', edit)
        $(option).addClass('option')
        $(option).appendTo($('#list'))
    })


    let selectedOBJ = null;

    $('#posX').on('input', function () {
        selectedOBJ.position.x = $(this).val();
    })
    $('#posZ').on('input', function () {
        selectedOBJ.position.z = $(this).val();
    })
    $('#posY').on('input', function () {
        selectedOBJ.position.y = $(this).val();
        console.log(selectedOBJ)
    })


    $('#rotX').on('input', function () {
        selectedOBJ.rotation.x = Math.radians($(this).val());
    })
    $('#rotY').on('input', function () {
        selectedOBJ.rotation.z = Math.radians($(this).val());
    })
    $('#rotZ').on('input', function () {
        selectedOBJ.rotation.y = Math.radians($(this).val());
    })

   
    function edit() {
        selectedOBJ = this.mesh
        $('#posX').val(selectedOBJ.position.x)
        $('#posY').val(selectedOBJ.position.y)
        $('#posZ').val(selectedOBJ.position.z)
        $('#rotX').val(selectedOBJ.rotation.x)
        $('#rotY').val(selectedOBJ.rotation.y)
        $('#rotZ').val(selectedOBJ.rotation.z)
    }

    function render() {

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }


    render()
})
