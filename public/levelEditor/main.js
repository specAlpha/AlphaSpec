let renderer, camera, scene, axes, objects = [];
let players = [];
let currSel, prevSel;
let exported;
Math.radians = function (degrees) {
   return degrees * Math.PI / 180;
};

Math.degrees = function (radians) {
   return radians * 180 / Math.PI;
}


$(function () {

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
   renderer.setSize(1299, 699)

   var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
   orbitControl.addEventListener('change', function () {
      renderer.render(scene, camera)
   });
   $("#root").append(renderer.domElement);

   // axes
   let axesAdded = true
   $('#axes').on('click', function () {
      $('#axes').toggleClass('check');
      axesAdded = !axesAdded;
      axesAdded ? scene.remove(axes) : scene.add(axes);
   })

   $("#newCube").on("click", () => {
      let temp = new Shape("cube");
   });

   $("#newPlayer").on("click", () => {
      let temp = new Shape("player");
   })
   $("#newPlane").on("click", () => {
      let temp = new Shape("plane");
   })
   $("#newRamp").on("click", () => {
      let temp = new Shape("ramp");
   })
   $("#newPressurePlate").on("click", () => {
      let temp = new Shape("pressurePlate");
   })
   // new cube
   // $('#newCube').on('click', function () {
   //    let geometry = new THREE.BoxGeometry(10, 10, 10);
   //    let cube = new Shape("cube");
   //    let material = new THREE.MeshBasicMaterial({
   //       map: new THREE.TextureLoader().load('../textures/components/default.jpg'),
   //       side: THREE.DoubleSide,
   //       opacity: 1
   //    });
   //    let mesh = new THREE.Mesh(geometry, material);
   //    scene.add(mesh)
   //    mesh.type = "object"
   //    let option = document.createElement('div')
   //    option.innerHTML = 'cube'
   //    option.mesh = mesh;
   //    $(option).on('click', edit)
   //    $(option).addClass('option')
   //    $(option).appendTo($('#list'))
   // })


   // $('#newRamp').on('click', function () {
   //    let shape = new THREE.Shape();
   //    shape.moveTo(0, 0);
   //    let size = {
   //       x: $("#sizeX").val(),
   //       y: $("#sizeY").val(),
   //       z: $("#sizeZ   ").val()
   //    }
   //    shape.lineTo(size.x, size.y);
   //    shape.lineTo(size.x, 0);
   //    shape.lineTo(0, 0);
   //    let geometry = new THREE.ExtrudeGeometry(shape, {
   //       steps: 1,
   //       amount: size.z,
   //       bevelEnabled: false,
   //       bevelThickness: 1,
   //       bevelSize: 1,
   //       bevelSegments: 2
   //    });
   //    let material = new THREE.MeshBasicMaterial({
   //       // map: new THREE.TextureLoader().load('../textures/components/default.jpg'),
   //       color: 0x123123,
   //       side: THREE.DoubleSide,
   //       opacity: 1
   //    });
   //    let mesh = new THREE.Mesh(geometry, material);
   //    scene.add(mesh)
   //    mesh.type = "object"
   //    let option = document.createElement('div')
   //    option.innerHTML = 'cube'
   //    option.mesh = mesh;
   //    $(option).on('click', edit)
   //    $(option).addClass('option')
   //    $(option).appendTo($('#list'))
   // })


   // $('#newPlayer').on('click', function () {
   //    console.log('player')
   //    let playerCount = $(".player").length;

   //    if (playerCount >= 2) {
   //       window.alert("Ilość graczy nie może być większa niż 2")
   //       return null;
   //    }
   //    let geometry = new THREE.BoxGeometry(10, 20, 10);
   //    let material = new THREE.MeshBasicMaterial({
   //       // map: new THREE.TextureLoader().load('../textures/components/default.jpg'),
   //       color: 0x777777,
   //       side: THREE.DoubleSide,
   //       opacity: 1
   //    });
   //    let mesh = new THREE.Mesh(geometry, material);
   //    mesh.type = "player"
   //    mesh.name = `player${playerCount}`
   //    scene.add(mesh)
   //    let option = document.createElement('div')
   //    $(option).attr("id", `player${playerCount}`)
   //    option.innerHTML = `player${playerCount}`
   //    option.mesh = mesh;
   //    $(option).on('click', edit)
   //    $(option).addClass('option player')
   //    $(option).appendTo($('#list'))
   // })

   // $("#remove").on("click", () => {
   //    if (selectedOBJ == null) {
   //       window.alert("Musisz najpierw wybrać obiekt do usunięcia!")
   //       return null;
   //    }
   //    $(selectedDIV).remove();
   //    scene.remove(selectedOBJ)
   // })

   $('#posX').on('input', function () {
      selectedOBJ.position.x = $(this).val();
   })
   $('#posZ').on('input', function () {
      selectedOBJ.position.z = $(this).val();
   })
   $('#posY').on('input', function () {
      selectedOBJ.position.y = $(this).val();
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




   $("#output").on("click", () => {
      exported = {
         spawn: {

         }
      }
      for (let i = 0; i < scene.children.length; i++) {
         let el = scene.children[i];
         switch (el.type) {
            case ("player"):
               let player = {
                  position: {
                     x: el.position.x,
                     y: el.position.y,
                     z: el.position.z
                  },
                  rotation: {
                     x: el.rotation.x,
                     y: el.rotation.y,
                     z: el.rotation.z
                  }
               }
               exported.spawn[el.name] = player
               break;
            case ("object"):
               break;
            default:

               break;
         }
      }
   })
   function edit() {
      selectedOBJ = this.mesh;
      selectedDIV = this;
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