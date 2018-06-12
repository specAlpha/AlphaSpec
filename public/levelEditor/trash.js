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