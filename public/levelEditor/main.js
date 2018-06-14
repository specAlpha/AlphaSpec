//todo
//skonczyc import
//dynamic cubes
//wybor elementow do dodania z listy
//ogarnac jebany burdel

let renderer, camera, scene, axes;
let currSel, prevSel;
let exported;
let objects = [];
let events = [];
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


   $(document).on("contextMenu", (e) => {
      e.preventDefault();
   });

   $("#remove").on("click", () => {
      if (!currSel) {
         window.alert("Musisz najpierw wybrać obiekt do usunięcia!")
         return null;
      }
      currSel.delete();
      currSel = null;
   });
   $("#loadLevel").on("click", () => {
      let data = window.prompt("Wklej json poziomu");
      level(data);
   });

   $("#events").on("click", () => {
      let event;
      if (!currSel) {
         window.alert("Musisz najpierw wybrać obiekt")
         return null;
      }
      if (!currSel.dynamic) {
         window.alert("Ten element nie obsługuje eventów")
         return null;
      }
      // currSel.emmiter
   })
   $('#posX').on('input', function () {
      if (currSel) {
         currSel.mesh.position.x = $(this).val();
         currSel.position.x = $(this).val();
      }
   })
   $('#posZ').on('input', function () {
      if (currSel) {
         currSel.mesh.position.z = $(this).val();
         currSel.position.z = $(this).val();
      }
   })
   $('#posY').on('input', function () {
      if (currSel) {
         currSel.mesh.position.y = $(this).val();
         currSel.position.y = $(this).val();
      }
   })


   $('#rotX').on('input', function () {
      if (currSel) {
         currSel.mesh.rotation.x = Math.radians($(this).val());
         currSel.rotation.x = Math.radians($(this).val());
      }
   })
   $('#rotY').on('input', function () {
      if (currSel) {
         currSel.mesh.rotation.z = Math.radians($(this).val());
         currSel.rotation.y = Math.radians($(this).val());
      }
   })
   $('#rotZ').on('input', function () {
      if (currSel) {
         currSel.mesh.rotation.y = Math.radians($(this).val());
         currSel.rotation.z = Math.radians($(this).val());
      }
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

function level(_data) {
   data = JSON.parse(_data ? _data : testData);
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
         case ("staticBlocks"):
            for (let subType in data.staticBlocks) {
               // console.log(subType)
               for (let obj in data.staticBlocks[subType]) {
                  let el = data.staticBlocks[subType][obj];
                  let temp;
                  // console.log(el)
                  if (subType == "ramp") {
                     temp = new Ramp(el.position, el.rotation, el.size)
                  } else if (subType == "plane") {
                     temp = new Plane(el.position, el.rotation, el.size)
                  } else if (subType == "cube") {
                     temp = new Cube(el.position, el.rotation, el.size)
                  } else {
                     // console.log(subType)
                  }
                  // console.log(temp)
                  scene.add(temp.mesh);
               }
            }
            break;
         case ("specialTiles"):
            for (let subType in data.specialTiles) {
               // console.log(subType)
               for (let obj in data.specialTiles[subType]) {
                  let el = data.specialTiles[subType][obj];
                  let temp;
                  if (subType == "button") {
                     temp = new Button(el.position, el.rotation, el.id)
                  } else if (subType == "spawner") {
                     temp = new Spawner(el.position, el.rotation, el.id);

                  } else if (subType == "pressurePlate") {
                     temp = new PressurePlate(el.position, el.rotation, el.id)

                  } else if (subType == "dynamicCubes") {
                     temp = new DynamicCube(el.position, el.rotation, el.size, el.id);
                  } else if (subType == "doors") {
                     temp = new Doors(el.position, el.rotation, el.id)
                  } else {
                     console.warn(subType);
                  }
                  if (temp) scene.add(temp.mesh);
               }
            }
            break;
         case ("events"):
            for (let subType in data.events) {
               if (subType == "blockEvents") {
                  for (let obj in data.events[subType]) {
                     let el = data.events[subType][obj];
                     console.log(el)
                     let temp = new BlockEvent(el.type, el.emmiter, el.receiver);
                     for (let w in el.wires) {
                        let wire = el.wires[w];
                        temp.addWire(wire.position, wire.rotation, wire.size.y);
                        scene.add(temp.wires[temp.wires.length - 1].mesh);
                     }
                     if (!events[subType])
                        events[subType] = [];
                     events[subType].push(temp);
                  }
               }
            }
            break;
      }
   }
}

let testData = `{
   "spawn": {
      "player0": {
         "position": {
            "x": 0,
            "y": 0,
            "z": 300
         },
         "player1": {
            "position": {
               "x": 110,
               "y": 0,
               "z": 20
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            }
         }
      },
      "player1": {
         "position": {
            "x": 110,
            "y": 0,
            "z": 300
         },
         "rotation": {
            "x": 0,
            "y": 0,
            "z": 0
         }
      }
   },
   "staticBlocks": {
      "ramp": [
         {
            "size": {
               "x": 30,
               "y": 30,
               "z": 30
            },
            "position": {
               "x": 100,
               "y": 0,
               "z": 360
            },
            "rotation": {
               "x": 0,
               "y": -1.57,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 30,
               "y": 30,
               "z": 30
            },
            "position": {
               "x": 40,
               "y": 0,
               "z": 360
            },
            "rotation": {
               "x": 0,
               "y": -1.57,
               "z": 0
            },
            "texture": "default"
         }
      ],
      "cube": [
         {
            "size": {
               "x": 230,
               "y": 10,
               "z": 120
            },
            "position": {
               "x": 55,
               "y": -5,
               "z": 50
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 230,
               "y": 10,
               "z": 120
            },
            "position": {
               "x": 55,
               "y": 85,
               "z": 50
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 230,
               "y": 80,
               "z": 10
            },
            "position": {
               "x": 55,
               "y": 40,
               "z": -5
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 10,
               "y": 80,
               "z": 100
            },
            "position": {
               "x": -55,
               "y": 40,
               "z": 50
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 10,
               "y": 80,
               "z": 100
            },
            "position": {
               "x": 165,
               "y": 40,
               "z": 50
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 10,
               "y": 80,
               "z": 100
            },
            "position": {
               "x": 55,
               "y": 40,
               "z": 50
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 50,
               "y": 40,
               "z": 10
            },
            "position": {
               "x": 55,
               "y": 20,
               "z": 105
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 30,
               "y": 40,
               "z": 10
            },
            "position": {
               "x": 155,
               "y": 20,
               "z": 105
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 30,
               "y": 40,
               "z": 10
            },
            "position": {
               "x": -45,
               "y": 20,
               "z": 105
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 230,
               "y": 40,
               "z": 10
            },
            "position": {
               "x": 55,
               "y": 60,
               "z": 105
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 40,
               "y": 160,
               "z": 10
            },
            "position": {
               "x": -80,
               "y": 80,
               "z": 105
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 40,
               "y": 160,
               "z": 10
            },
            "position": {
               "x": 190,
               "y": 80,
               "z": 105
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 230,
               "y": 110,
               "z": 10
            },
            "position": {
               "x": 55,
               "y": 145,
               "z": 105
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 10,
               "y": 160,
               "z": 170
            },
            "position": {
               "x": 205,
               "y": 80,
               "z": 195
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 10,
               "y": 160,
               "z": 170
            },
            "position": {
               "x": -95,
               "y": 80,
               "z": 195
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 310,
               "y": 10,
               "z": 170
            },
            "position": {
               "x": 55,
               "y": -5,
               "z": 195
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 310,
               "y": 10,
               "z": 20
            },
            "position": {
               "x": 55,
               "y": 165,
               "z": 270
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 20,
               "y": 10,
               "z": 130
            },
            "position": {
               "x": -90,
               "y": 165,
               "z": 195
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 310,
               "y": 10,
               "z": 20
            },
            "position": {
               "x": 55,
               "y": 165,
               "z": 120
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 270,
               "y": 10,
               "z": 130
            },
            "position": {
               "x": 55,
               "y": 165,
               "z": 195
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "window"
         },
         {
            "size": {
               "x": 20,
               "y": 10,
               "z": 130
            },
            "position": {
               "x": 200,
               "y": 165,
               "z": 195
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 10,
               "y": 10,
               "z": 170
            },
            "position": {
               "x": 55,
               "y": 5,
               "z": 195
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 10,
               "y": 10,
               "z": 170
            },
            "position": {
               "x": 55,
               "y": 25,
               "z": 195
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 10,
               "y": 10,
               "z": 170
            },
            "position": {
               "x": 55,
               "y": 45,
               "z": 195
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 110,
               "y": 160,
               "z": 10
            },
            "position": {
               "x": 55,
               "y": 80,
               "z": 275
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 40,
               "y": 140,
               "z": 10
            },
            "position": {
               "x": 130,
               "y": 100,
               "z": 275
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 50,
               "y": 160,
               "z": 10
            },
            "position": {
               "x": 175,
               "y": 80,
               "z": 275
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 40,
               "y": 140,
               "z": 10
            },
            "position": {
               "x": -20,
               "y": 100,
               "z": 275
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 50,
               "y": 160,
               "z": 10
            },
            "position": {
               "x": -65,
               "y": 80,
               "z": 275
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 310,
               "y": 10,
               "z": 220
            },
            "position": {
               "x": 55,
               "y": -5,
               "z": 390
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 310,
               "y": 10,
               "z": 20
            },
            "position": {
               "x": 55,
               "y": 165,
               "z": 480
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 20,
               "y": 10,
               "z": 170
            },
            "position": {
               "x": -90,
               "y": 165,
               "z": 385
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 310,
               "y": 10,
               "z": 20
            },
            "position": {
               "x": 55,
               "y": 165,
               "z": 290
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 270,
               "y": 10,
               "z": 170
            },
            "position": {
               "x": 55,
               "y": 165,
               "z": 385
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "window"
         },
         {
            "size": {
               "x": 20,
               "y": 10,
               "z": 170
            },
            "position": {
               "x": 200,
               "y": 165,
               "z": 385
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 110,
               "y": 160,
               "z": 10
            },
            "position": {
               "x": 55,
               "y": 80,
               "z": 495
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 40,
               "y": 140,
               "z": 10
            },
            "position": {
               "x": 130,
               "y": 100,
               "z": 495
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 50,
               "y": 160,
               "z": 10
            },
            "position": {
               "x": 175,
               "y": 80,
               "z": 495
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 40,
               "y": 140,
               "z": 10
            },
            "position": {
               "x": -20,
               "y": 100,
               "z": 495
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 50,
               "y": 160,
               "z": 10
            },
            "position": {
               "x": -65,
               "y": 80,
               "z": 495
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 10,
               "y": 160,
               "z": 210
            },
            "position": {
               "x": 205,
               "y": 80,
               "z": 385
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 10,
               "y": 160,
               "z": 210
            },
            "position": {
               "x": -95,
               "y": 80,
               "z": 385
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 30,
               "y": 30,
               "z": 210
            },
            "position": {
               "x": 55,
               "y": 15,
               "z": 385
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 30,
               "y": 30,
               "z": 120
            },
            "position": {
               "x": 55,
               "y": 45,
               "z": 340
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 30,
               "y": 30,
               "z": 90
            },
            "position": {
               "x": 55,
               "y": 45,
               "z": 455
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 30,
               "y": 30,
               "z": 30
            },
            "position": {
               "x": 85,
               "y": 15,
               "z": 405
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 30,
               "y": 10,
               "z": 10
            },
            "position": {
               "x": 55,
               "y": 55,
               "z": 405
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 30,
               "y": 10,
               "z": 10
            },
            "position": {
               "x": 55,
               "y": 35,
               "z": 405
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 30,
               "y": 30,
               "z": 30
            },
            "position": {
               "x": 25,
               "y": 15,
               "z": 405
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 30,
               "y": 70,
               "z": 20
            },
            "position": {
               "x": 55,
               "y": 95,
               "z": 480
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         },
         {
            "size": {
               "x": 20,
               "y": 20,
               "z": 20
            },
            "position": {
               "x": 30,
               "y": 120,
               "z": 480
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "texture": "default"
         }
      ],
      "plane": []
   },
   "specialTiles": {
      "button": [
         {
            "position": {
               "x": 70.1,
               "y": 15,
               "z": 425
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 1.57
            },
            "id": "#5"
         }
      ],
      "doors": [
         {
            "position": {
               "x": 130,
               "y": 0,
               "z": 275
            },
            "rotation": {
               "x": 0,
               "y": 1.57,
               "z": 0
            },
            "id": "#2"
         },
         {
            "position": {
               "x": -20,
               "y": 0,
               "z": 275
            },
            "rotation": {
               "x": 0,
               "y": 1.57,
               "z": 0
            },
            "id": "#3"
         },
         {
            "position": {
               "x": 130,
               "y": 0,
               "z": 495
            },
            "rotation": {
               "x": 0,
               "y": 1.57,
               "z": 0
            },
            "id": "#8"
         },
         {
            "position": {
               "x": -20,
               "y": 0,
               "z": 495
            },
            "rotation": {
               "x": 0,
               "y": 1.57,
               "z": 0
            },
            "id": "#9"
         }
      ],
      "spawner": [
         {
            "position": {
               "x": 30,
               "y": 105,
               "z": 480
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "id": "#7"
         }
      ],
      "pressurePlate": [
         {
            "position": {
               "x": -80,
               "y": 0,
               "z": 230
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "id": "#1"
         },
         {
            "position": {
               "x": 180,
               "y": 0,
               "z": 350
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "id": "#4"
         },
         {
            "position": {
               "x": 180,
               "y": 0,
               "z": 420
            },
            "rotation": {
               "x": 0,
               "y": 0,
               "z": 0
            },
            "id": "#5"
         }
      ],
      "dynamicCubes": []
   },
   "events": {
      "spaceEvents": [
         {
            "position": {
               "x": 55,
               "y": 25,
               "z": 135
            },
            "size": {
               "x": 240,
               "y": 50,
               "z": 50
            },
            "image": "tut1"
         },
         {
            "position": {
               "x": 55,
               "y": 25,
               "z": 310
            },
            "size": {
               "x": 240,
               "y": 50,
               "z": 50
            },
            "image": "tut2"
         }
      ],
      "blockEvents": [
         {
            "type": 1,
            "emmiter": "#1",
            "receiver": "#2",
            "wires": [
               {
                  "size": {
                     "x": 10,
                     "y": 30,
                     "z": 0
                  },
                  "position": {
                     "x": -75,
                     "y": 0.1,
                     "z": 255
                  },
                  "rotation": {
                     "x": -1.57,
                     "y": 0,
                     "z": 0
                  }
               },
               {
                  "size": {
                     "x": 10,
                     "y": 70,
                     "z": 0
                  },
                  "position": {
                     "x": -75,
                     "y": 35,
                     "z": 269.9
                  },
                  "rotation": {
                     "x": 0,
                     "y": 3.14,
                     "z": 0
                  }
               },
               {
                  "size": {
                     "x": 200,
                     "y": 10,
                     "z": 0
                  },
                  "position": {
                     "x": 30,
                     "y": 65,
                     "z": 269.8
                  },
                  "rotation": {
                     "x": 0,
                     "y": 3.14,
                     "z": 0
                  }
               },
               {
                  "size": {
                     "x": 10,
                     "y": 30,
                     "z": 0
                  },
                  "position": {
                     "x": 125,
                     "y": 45,
                     "z": 269.9
                  },
                  "rotation": {
                     "x": 0,
                     "y": 3.14,
                     "z": 0
                  }
               }
            ]
         },
         {
            "type": 1,
            "emmiter": "#4",
            "receiver": "#3",
            "wires": [
               {
                  "size": {
                     "x": 10,
                     "y": 60,
                     "z": 0
                  },
                  "position": {
                     "x": 185,
                     "y": 0.1,
                     "z": 310
                  },
                  "rotation": {
                     "x": -1.57,
                     "y": 0,
                     "z": 0
                  }
               },
               {
                  "size": {
                     "x": 10,
                     "y": 70,
                     "z": 0
                  },
                  "position": {
                     "x": 185,
                     "y": 35,
                     "z": 280.1
                  },
                  "rotation": {
                     "x": 0,
                     "y": 0,
                     "z": 0
                  }
               },
               {
                  "size": {
                     "x": 200,
                     "y": 10,
                     "z": 0
                  },
                  "position": {
                     "x": 80,
                     "y": 65,
                     "z": 280.1
                  },
                  "rotation": {
                     "x": 0,
                     "y": 0,
                     "z": 0
                  }
               },
               {
                  "size": {
                     "x": 10,
                     "y": 30,
                     "z": 0
                  },
                  "position": {
                     "x": -15,
                     "y": 45,
                     "z": 280.1
                  },
                  "rotation": {
                     "x": 0,
                     "y": 0,
                     "z": 0
                  }
               }
            ]
         }
      ]
   }
}`