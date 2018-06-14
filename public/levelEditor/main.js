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
                temp = new cube();
                break;
            case ("ramp"):
                temp = new ramp();
                break;
            case ("plane"):
                temp = new plane();
                break;
            case ("dynamicCube"):
                temp = new dynamicCube();
                break;
            case ("spawner"):
                temp = new spawner();
                break;
            case ("doors"):
                temp = new doors();
                break;
            case ("button"):
                temp = new button();
                break;
            case ("pressurePlate"):
                temp = new pressurePlate();
                break;
        }
        // let temp = new Player();
        scene.add(temp.mesh);
    })


    $(document).on("contextMenu", (e) => {
        e.preventDefault();
    });
    $("#copy").on("click", () => {
        if (!currSel)
            window.alert("Wybierz obiekt do skopiowania");
        let objType = currSel.constructor.name;
        let temp;
        switch (objType) {
            case ("cube"):
                temp = new cube(currSel.position, currSel.rotation, currSel.size, rotation, currSel.material);
                break;
            case ("ramp"):
                temp = new ramp();
                break;
            case ("plane"):
                temp = new plane();
                break;
            default:
                console.log(objType)
                window.alert("ten obiekt nie obsluguje kopiowania ")
                break;
        }
        if (temp) scene.add(temp.mesh)
    })
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

    $("#wiref").on("click", () => {
        objects.filter(e => e.constructor.name == "cube").forEach(el => el.mesh.material.wireframe = el.mesh.material.wireframe == true ? false : true);
    })

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


    $('#sizeX').on('input', function () {
        if (currSel) {
            let scale = $(this).val() / currSel.size.x;
            currSel.mesh.scale.x = scale;
        }
    })
    $('#sizeY').on('input', function () {
        if (currSel) {
            let scale = $(this).val() / currSel.size.y;
            currSel.mesh.scale.y = scale;

        }
    })
    $('#sizeZ').on('input', function () {
        if (currSel) {
            let scale = $(this).val() / currSel.size.z;
            currSel.mesh.scale.z = scale;

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
                if (!exported[el.type]) {
                    exported[el.type] = {};
                    console.log(el.type)
                }
                if (!exported[el.type][el.constructor.name])
                    exported[el.type][el.constructor.name] = []
                if (el.props.size) {
                    el.props.size.x *= el.mesh.scale.x;
                    el.props.size.y *= el.mesh.scale.y;
                    el.props.size.z *= el.mesh.scale.z;
                }
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
    console.log(text)
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
                            temp = new ramp(el.position, el.rotation, el.size)
                        } else if (subType == "plane") {
                            temp = new plane(el.position, el.rotation, el.size)
                        } else if (subType == "cube") {
                            temp = new cube(el.position, el.rotation, el.size)
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
                            temp = new button(el.position, el.rotation, el.id)
                        } else if (subType == "spawner") {
                            temp = new spawner(el.position, el.rotation, el.id);

                        } else if (subType == "pressurePlate") {
                            temp = new pressurePlate(el.position, el.rotation, el.id)
                            console.log(temp)
                        } else if (subType == "dynamicCubes") {
                            temp = new dynamicCube(el.position, el.rotation, el.size, el.id);
                        } else if (subType == "doors") {
                            temp = new doors(el.position, el.rotation, el.id)
                        } else {
                            console.warn(subType);
                        }
                        scene.add(temp.mesh);
                    }
                }
                break;
            case ("events"):
                for (let subType in data.events) {
                    if (subType == "blockEvents") {
                        for (let obj in data.events[subType]) {
                            let el = data.events[subType][obj];
                            console.log(el)
                            let temp = new blockEvents(el.type, el.emmiter, el.receiver);
                            for (let w in el.wires) {
                                let wire = el.wires[w];
                                temp.addWire(wire.position, wire.rotation, wire.size);
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
  "spawn":        {
    "player0": {
      "position": {
        "x": 0,
        "y": 0,
        "z": 605
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      }
    },
    "player1": {
      "position": {
        "x": 110,
        "y": 0,
        "z": 605
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      }
    }
  },
  "staticBlocks":  {
    "ramp": [
      {
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
        "size":     {
          "x": 30,
          "y": 30,
          "z": 30
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 30,
          "y": 30,
          "z": 30
        },
        "texture":  "default"
      }, {
        "position": {
          "x": 80,
          "y": 0,
          "z": 540
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "size":     {
          "x": 30,
          "y": 30,
          "z": 30
        },
        "texture":  "default"
      }
    ]
  },
  "staticBlocks": {
    "cube": [
      {
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
        "size":     {
          "x": 230,
          "y": 10,
          "z": 120
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 230,
          "y": 10,
          "z": 120
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 230,
          "y": 80,
          "z": 10
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 10,
          "y": 80,
          "z": 100
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 10,
          "y": 80,
          "z": 100
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 10,
          "y": 80,
          "z": 100
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 50,
          "y": 40,
          "z": 10
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 30,
          "y": 40,
          "z": 10
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 30,
          "y": 40,
          "z": 10
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 230,
          "y": 40,
          "z": 10
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 40,
          "y": 160,
          "z": 10
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 40,
          "y": 160,
          "z": 10
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 230,
          "y": 110,
          "z": 10
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 10,
          "y": 160,
          "z": 170
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 10,
          "y": 160,
          "z": 170
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 310,
          "y": 10,
          "z": 170
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 310,
          "y": 10,
          "z": 20
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 20,
          "y": 10,
          "z": 130
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 310,
          "y": 10,
          "z": 20
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 270,
          "y": 10,
          "z": 130
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 20,
          "y": 10,
          "z": 130
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 10,
          "y": 10,
          "z": 170
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 10,
          "y": 10,
          "z": 170
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 10,
          "y": 10,
          "z": 170
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 110,
          "y": 160,
          "z": 10
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 40,
          "y": 140,
          "z": 10
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 50,
          "y": 160,
          "z": 10
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 40,
          "y": 140,
          "z": 10
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 50,
          "y": 160,
          "z": 10
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 310,
          "y": 10,
          "z": 220
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 310,
          "y": 10,
          "z": 20
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 20,
          "y": 10,
          "z": 170
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 310,
          "y": 10,
          "z": 20
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 270,
          "y": 10,
          "z": 170
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 20,
          "y": 10,
          "z": 170
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 110,
          "y": 160,
          "z": 10
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 40,
          "y": 140,
          "z": 10
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 50,
          "y": 160,
          "z": 10
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 40,
          "y": 140,
          "z": 10
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 50,
          "y": 160,
          "z": 10
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 10,
          "y": 160,
          "z": 210
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 10,
          "y": 160,
          "z": 210
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 30,
          "y": 30,
          "z": 210
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 30,
          "y": 30,
          "z": 120
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 30,
          "y": 30,
          "z": 90
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 30,
          "y": 30,
          "z": 30
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 30,
          "y": 10,
          "z": 10
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 30,
          "y": 10,
          "z": 10
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 30,
          "y": 30,
          "z": 30
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 30,
          "y": 70,
          "z": 20
        },
        "texture":  "default"
      }, {
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
        "size":     {
          "x": 20,
          "y": 20,
          "z": 20
        },
        "texture":  "default"
      }, {
        "position": {
          "x": 55,
          "y": -5,
          "z": 610
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "size":     {
          "x": 310,
          "y": 10,
          "z": 220
        },
        "texture":  "default"
      }, {
        "position": {
          "x": -95,
          "y": 95,
          "z": 605
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "size":     {
          "x": 10,
          "y": 130,
          "z": 230.00000000000003
        },
        "texture":  "default"
      }, {
        "position": {
          "x": -95,
          "y": 15,
          "z": 565
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "size":     {
          "x": 10,
          "y": 30,
          "z": 150
        },
        "texture":  "default"
      }, {
        "position": {
          "x": -95,
          "y": 15,
          "z": 700
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "size":     {
          "x": 10,
          "y": 30,
          "z": 40
        },
        "texture":  "default"
      }, {
        "position": {
          "x": 60,
          "y": 80,
          "z": 715
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "size":     {
          "x": 300,
          "y": 160,
          "z": 10
        },
        "texture":  "default"
      }, {
        "position": {
          "x": 205,
          "y": 80,
          "z": 605
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "size":     {
          "x": 10,
          "y": 160,
          "z": 210
        },
        "texture":  "default"
      }, {
        "position": {
          "x": 195,
          "y": 165,
          "z": 610
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "size":     {
          "x": 30,
          "y": 10,
          "z": 220
        },
        "texture":  "default"
      }, {
        "position": {
          "x": 40,
          "y": 165,
          "z": 705
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "size":     {
          "x": 280,
          "y": 10,
          "z": 30
        },
        "texture":  "default"
      }, {
        "position": {
          "x": -85,
          "y": 165,
          "z": 590
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "size":     {
          "x": 30,
          "y": 10,
          "z": 200
        },
        "texture":  "default"
      }, {
        "position": {
          "x": 55,
          "y": 165,
          "z": 505
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "size":     {
          "x": 250,
          "y": 10,
          "z": 30
        },
        "texture":  "default"
      }, {
        "position": {
          "x": 54,
          "y": 165,
          "z": 605
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "size":     {
          "x": 250,
          "y": 10,
          "z": 170
        },
        "texture":  "window"
      }, {
        "position": {
          "x": 185,
          "y": 15,
          "z": 555
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "size":     {
          "x": 30,
          "y": 30,
          "z": 30
        },
        "texture":  "default"
      }, {
        "position": {
          "x": 155,
          "y": 15,
          "z": 695
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "size":     {
          "x": 90,
          "y": 30,
          "z": 30
        },
        "texture":  "default"
      }, {
        "position": {
          "x": 60,
          "y": 125,
          "z": 510
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "size":     {
          "x": 60,
          "y": 10,
          "z": 20
        },
        "texture":  "default"
      }, {
        "position": {
          "x": 50,
          "y": 15,
          "z": 695
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "size":     {
          "x": 40,
          "y": 30,
          "z": 30
        },
        "texture":  "default"
      }, {
        "position": {
          "x": -80,
          "y": 15,
          "z": 580
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "size":     {
          "x": 20,
          "y": 30,
          "z": 20
        },
        "texture":  "default"
      }
    ]
  },
  "specialTiles": {
    "button":        [
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
        "id":       "#5"
      }, {
        "position": {
          "x": 145,
          "y": 45,
          "z": 709
        },
        "rotation": {
          "x": 0,
          "y": -1.5707963267948966,
          "z": 1.5707963267948966
        },
        "id":       "#8"
      }, {
        "position": {
          "x": -65,
          "y": 15,
          "z": 501
        },
        "rotation": {
          "x": 0,
          "y": -1.5707963267948966,
          "z": 1.5707963267948966
        },
        "id":       "#9"
      }
    ],
    "doors":         [
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
        "id":       "#2"
      }, {
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
        "id":       "#3"
      }, {
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
        "id":       "#8"
      }, {
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
        "id":       "#9"
      }, {
        "position": {
          "x": -95,
          "y": 0,
          "z": 660
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "id":       "#0"
      }
    ],
    "spawner":       [
      {
        "position": {
          "x": 30,
          "y": 100,
          "z": 480
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "id":       "#7"
      }, {
        "position": {
          "x": 60,
          "y": 110,
          "z": 510
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "id":       "#5"
      }, {
        "position": {
          "x": -80,
          "y": 150,
          "z": 580
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "id":       "#6"
      }
    ],
    "pressurePlate": [
      {
        "position": {
          "x": -80,
          "y": 2.5,
          "z": 230
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "id":       "#1"
      }, {
        "position": {
          "x": 180,
          "y": 2.5,
          "z": 350
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "id":       "#4"
      }, {
        "position": {
          "x": 180,
          "y": 2.5,
          "z": 420
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "id":       "#6"
      }, {
        "position": {
          "x": 45,
          "y": 30,
          "z": 695
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "id":       "#7"
      }, {
        "position": {
          "x": -80,
          "y": 30,
          "z": 580
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "id":       "#10"
      }, {
        "position": {
          "x": 30,
          "y": 0,
          "z": 630
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "id":       "#11"
      }
    ]
  },
  "events":       {
    "spaceEvents": [
      {
        "position": {
          "x": 55,
          "y": 25,
          "z": 135
        },
        "size":     {
          "x": 240,
          "y": 50,
          "z": 50
        },
        "image":    "tut1"
      }, {
        "position": {
          "x": 55,
          "y": 25,
          "z": 310
        },
        "size":     {
          "x": 240,
          "y": 50,
          "z": 50
        },
        "image":    "tut2"
      }
    ],
    "blockEvents": [
      {
        "type":     1,
        "emmiter":  "#1",
        "receiver": "#2",
        "wires":    [
          {
            "size":     {
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
            "size":     {
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
          }, {
            "size":     {
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
            "size":     {
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
      }, {
        "type":     1,
        "emmiter":  "#4",
        "receiver": "#3",
        "wires":    [
          {
            "size":     {
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
            "size":     {
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
          }, {
            "size":     {
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
            "size":     {
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
      },
      {
        "type":     1,
        "emmiter":  "#5",
        "receiver": "#7",
        "wires":    [
          {
            "size":     {
              "x": 10,
              "y": 40,
              "z": 0
            },
            "position": {
              "x": 70.1,
              "y": 40,
              "z": 425
            },
            "rotation": {
              "x": 0,
              "y": 1.57,
              "z": 0
            }
          }, {
            "size":     {
              "x": 60,
              "y": 10,
              "z": 0
            },
            "position": {
              "x": 70.1,
              "y": 55,
              "z": 450
            },
            "rotation": {
              "x": 0,
              "y": 1.57,
              "z": 0
            }
          }, {
            "size":     {
              "x": 10,
              "y": 50,
              "z": 0
            },
            "position": {
              "x": 70.1,
              "y": 85,
              "z": 475
            },
            "rotation": {
              "x": 0,
              "y": 1.57,
              "z": 0
            }
          }, {
            "size":     {
              "x": 30,
              "y": 10,
              "z": 0
            },
            "position": {
              "x": 55,
              "y": 105,
              "z": 469.9
            },
            "rotation": {
              "x": 0,
              "y": -3.14,
              "z": 0
            }
          }
        ]
      }, {
        "type":     1,
        "emmiter":  "#6",
        "receiver": "#8",
        "wires":    [
          {
            "size":     {
              "x": 10,
              "y": 60,
              "z": 0
            },
            "position": {
              "x": 185,
              "y": 0.1,
              "z": 460
            },
            "rotation": {
              "x": -1.57,
              "y": 0,
              "z": 0
            }
          },
          {
            "size":     {
              "x": 10,
              "y": 150,
              "z": 0
            },
            "position": {
              "x": 185,
              "y": 75,
              "z": 489.9
            },
            "rotation": {
              "x": 0,
              "y": 3.14,
              "z": 0
            }
          }, {
            "size":     {
              "x": 200,
              "y": 10,
              "z": 0
            },
            "position": {
              "x": 80,
              "y": 145,
              "z": 489.8
            },
            "rotation": {
              "x": 0,
              "y": 3.14,
              "z": 0
            }
          },
          {
            "size":     {
              "x": 10,
              "y": 120,
              "z": 0
            },
            "position": {
              "x": -25,
              "y": 90,
              "z": 489.9
            },
            "rotation": {
              "x": 0,
              "y": 3.14,
              "z": 0
            }
          }
        ]
      }, {
        "type":     1,
        "emmiter":  "#6",
        "receiver": "#9",
        "wires":    [
          {
            "size":     {
              "x": 10,
              "y": 120,
              "z": 0
            },
            "position": {
              "x": 125,
              "y": 90,
              "z": 489.9
            },
            "rotation": {
              "x": 0,
              "y": 3.14,
              "z": 0
            }
          }
        ]
      }
    ]
  }
} `