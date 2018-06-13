//todo
//skonczyc import
//dynamic cubes
//wybor elementow do dodania z listy
//ogarnac jebany burdel

let renderer, camera, scene, axes;
let currSel, prevSel;
let exported;
let objects = [];
let activeCount = 0;
Math.radians = function (degrees) {
   return degrees * Math.PI / 180;
};

Math.degrees = function (radians) {
   return radians * 180 / Math.PI;
}

$(function () {
   // useless stuff
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


   // end of useless stuff

   let axesAdded = true
   $('#axes').on('click', function () {
      $('#axes').toggleClass('check');
      axesAdded = !axesAdded;
      axesAdded ? scene.remove(axes) : scene.add(axes);
   })

   $("#add").on("click", () => {
      let objType = $("#objectSelect").val();
      let temp;
      console.log(objType)
      switch (objType) {
         case ("player"):
            temp = new Player();
            break;
         case ("cube"):
            temp = new Cube();
            break;
         case ("ramp"):
            temp = new Ramp();
            break;
         case ("plane"):
            temp = new Plane();
            break;
         case ("wire"):
            temp = new Wire();
            break;
         case ("dynamicCube"):
            temp = new DynamicCube();
            break;
         case ("spawner"):
            temp = new Spawner();
            break;
         case ("doors"):
            temp = new Doors();
            break;
         case ("button"):
            temp = new Button();
            break;
         case ("pressurePlate"):
            temp = new PressurePlate();
            break;
      }
      // let temp = new Player();
      scene.add(temp.mesh);
   })




   $("#remove").on("click", () => {
      if (!currSel) {
         window.alert("Musisz najpierw wybrać obiekt do usunięcia!")
         return null;
      }
      currSel.delete();
      currSel = null;
   })

   $('#posX').on('input', function () {
      currSel.mesh.position.x = $(this).val();
      currSel.position.x = $(this).val();
   })
   $('#posZ').on('input', function () {
      currSel.mesh.position.z = $(this).val();
      currSel.position.z = $(this).val();
   })
   $('#posY').on('input', function () {
      currSel.mesh.position.y = $(this).val();
      currSel.position.y = $(this).val();
   })


   $('#rotX').on('input', function () {
      currSel.mesh.rotation.x = Math.radians($(this).val());
      currSel.rotation.x = Math.radians($(this).val());
   })
   $('#rotY').on('input', function () {
      currSel.mesh.rotation.z = Math.radians($(this).val());
      currSel.rotation.y = Math.radians($(this).val());
   })
   $('#rotZ').on('input', function () {
      currSel.mesh.rotation.y = Math.radians($(this).val());
      currSel.rotation.z = Math.radians($(this).val());
   })




   $("#output").on("click", () => {
      exported = {}
      for (let i = 0; i < objects.length; i++) {
         let el = objects[i];

         if (el.type == "player") {
            if (!exported.spawn)
               exported.spawn = {}
            exported.spawn[el.name] = el.props;
         }
         else {
            if (!exported[el.type])
               exported[el.type] = {};
            if (!exported[el.type][el.constructor.name])
               exported[el.type][el.constructor.name] = []
            exported[el.type][el.constructor.name].push(el.props)
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

function level() {
   data = `{"spawn":{"player0":{"position":{"x":"150","y":"10","z":"50"},"rotation":{"x":0,"y":0,"z":0}}},"staticBlock":{"Cube":[{"position":{"x":"150","y":"150","z":"150"},"rotation":{"x":"0","y":"0","z":"0"},"size":{"x":"50","y":"50","z":"200"}}],"Plane":[{"position":{"x":"1","y":"150","z":"150"},"rotation":{"x":"0","y":"0","z":"0"},"size":{"x":"50","y":"50","z":"200"}}]}}`
   data = JSON.parse(data)
   for (let i = objects.length - 1; i >= 0; i--) objects[i].delete();
   for (let type in data) {
      console.log(type)
      switch (type) {
         case ("spawn"):
            for (let player in data.spawn) {
               let el = data.spawn[player];
               let temp = new Player(el.position, el.rotation, player[player.length - 1]);
               scene.add(temp.mesh)
            }
            break;
         case ("staticBlock"):
            for (let subType in data.staticBlock) {
               for (let obj in data.staticBlock[subType]) {
                  let el = data.staticBlock[subType][obj];
                  let temp;
                  console.log(el)
                  if (subType == "Ramp") {
                     temp = new Ramp(el.position, el.rotation, el.size)
                  } else if (subType == "Plane") {
                     temp = new Plane(el.position, el.rotation, el.size)
                  } else if (subType == "Cube") {
                     temp = new Cube(el.position, el.rotation, el.size)
                  } else {
                     console.log(subType)
                  }
                  scene.add(temp.mesh);
               }
            }
            break;
         case ("dynamicTile"):
            break;
      }
   }
}