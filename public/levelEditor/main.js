//todo
//skonczyc import
//dynamic cubes

let renderer, camera, scene, axes;
let currSel, prevSel;
let exported;
let objects = [];
let specialCount = 0;
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
      let playerNumber = objects.filter(e => e.type == "player").length;
      if (playerNumber >= 2) {
         window.alert("Nie może być więcej niż dwóch graczy!");
         return;
      }
      let temp = new Shape("player");
      objects[objects.indexOf(temp)].name = `player${playerNumber}`
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


   $("#remove").on("click", () => {
      if (!currSel) {
         window.alert("Musisz najpierw wybrać obiekt do usunięcia!")
         return null;
      }
      $(currSel.div).remove();
      scene.remove(currSel.mesh)
      let index = objects.indexOf(currSel);
      objects.splice(index, index + 1);

   })

   $('#posX').on('input', function () {
      currSel.mesh.position.x = $(this).val();
   })
   $('#posZ').on('input', function () {
      currSel.mesh.position.z = $(this).val();
   })
   $('#posY').on('input', function () {
      currSel.mesh.position.y = $(this).val();
   })


   $('#rotX').on('input', function () {
      currSel.mesh.rotation.x = Math.radians($(this).val());
   })
   $('#rotY').on('input', function () {
      currSel.mesh.rotation.z = Math.radians($(this).val());
   })
   $('#rotZ').on('input', function () {
      currSel.mesh.rotation.y = Math.radians($(this).val());
   })




   $("#output").on("click", () => {
      exported = {
         spawn: {

         },
         staticBlocks: {},

      }
      for (let i = 0; i < objects.length; i++) {
         let el = objects[i];

         if (el.type == "player") {
            exported.spawn[el.name] = {
               position: el.position,
               rotation: el.rotation

            }
         }
         else if (!el.special) {
            if (!exported.staticBlocks[el.type]) {
               exported.staticBlocks[el.type] = [];
            }
            exported.staticBlocks[el.type].push({
               position: el.position,
               rotation: el.rotation,
               size: el.size
            })
         } else if (el.special) {
            if (!exported.specialTiles[el.type]) {
               exported.specialTiles[el.type] = [];
            }
            exported.specialTiles[el].push({
               position: el.position,
               rotation: el.rotation,
               id: el.id
            });
         }


      }

      copyToClipboard(JSON.stringify(exported));
   })

   function render() {
      renderer.render(scene, camera);
      requestAnimationFrame(render);
   }


   render()
})

function copyToClipboard(text) {
   window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}