class Shape {
   constructor(_pos, _rot) {
      if (_pos && _rot) {
         this.position = {
            x: _pos.x || $("#posX").val() || 0,
            y: _pos.y || $("#posX").val() || 0,
            z: _pos.z || $("#posX").val() || 0
         };
         this.rotation = {
            x: _rot.x || $("#rotX").val() || 0,
            y: _rot.y || $("#rotY").val() || 0,
            z: _rot.z || $("#rotZ").val() || 0
         };
      } else {
         this.position = {
            x: $("#posX").val() || 0,
            y: $("#posX").val() || 0,
            z: $("#posX").val() || 0
         };
         this.rotation = {
            x: $("#rotX").val() || 0,
            y: $("#rotY").val() || 0,
            z: $("#rotZ").val() || 0
         };
      }
      this.props = {
         position: this.position,
         rotation: this.rotation,
      }
      this.dynamic = false;
      this.div = document.createElement('div');
      this.div.innerHTML = "default";
      this.div.parent = this;
      $(this.div).on('click', this.edit.bind(this));
      $(this.div).addClass('option');
      $(this.div).appendTo($('#list'));
      objects.push(this);
   }
   applyDimensions() {
      // console.log(this.position)
      this.mesh.position.set(this.position.x, this.position.y, this.position.z)
      this.mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z)
   }
   delete() {
      $(this.div).remove();
      scene.remove(this.mesh);
      let index = objects.indexOf(this);
      objects.splice(index, index + 1);
   }
   edit() {
      if (currSel) {
         console.log(currSel.div)
         $(currSel.div).toggleClass("check")
         if (currSel.constructor.name == "Cube")
            currSel.mesh.material.wireframe = true;
      }
      $(this.div).toggleClass("check");
      if (this.constructor.name == "Cube") {
         this.mesh.material.wireframe = false;
      }
      currSel = this;
      $('#posX').val(this.position.x);
      $('#posY').val(this.position.y);
      $('#posZ').val(this.position.z);
      $('#rotX').val(this.rotation.x);
      $('#rotY').val(this.rotation.y);
      $('#rotZ').val(this.rotation.z);
      $('#posZ').val(this.position.z);
      if (this.size) {
         $('#sizeX').val(this.size.x);
         $('#sizeY').val(this.size.y);
         $('#sizeZ').val(this.size.z);
      }
   }
}
class Player extends Shape {
   constructor(_pos, _rot, _nr) {
      let playerNumber = _nr || objects.filter(e => e.constructor.name == "Player").length;
      super(_pos, _rot)
      this.type = "player";
      this.name = `player${playerNumber}`
      this.material = new THREE.MeshBasicMaterial({
         color: 0x00ff00,
         side: THREE.DoubleSide
      });
      this.geometry = new THREE.BoxGeometry(10, 20, 10);
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.div.innerHTML = this.constructor.name;
      this.applyDimensions();
      if (playerNumber >= 2) {
         this.mesh = null;
         this.delete();
         console.log("Nie może być więcje niż dwóch graczy!")
      }
   }
}


class Plane extends Shape {
   constructor(_pos, _rot, _size, _material) {
      super(_pos, _rot)
      this.type = "staticBlock";
      if (_size) {
         this.size = {
            x: _size.x,
            y: _size.y,
            z: _size.z,
         }
      } else {
         this.size = {
            x: $("#sizeX").val() || 10,
            y: $("#sizeY").val() || 10,
            z: $("#sizeZ").val() || 10
         }
      }
      this.materialProp = _material ? _material : $("#materialSelect").val();
      this.material = new THREE.MeshBasicMaterial({
         color: 0x777777,
         side: THREE.DoubleSide,
         wireframe: true,
      });
      this.props.material = this.materialProp;
      this.props.size = this.size;
      this.geometry = new THREE.PlaneGeometry(this.size.x, this.size.y, this.size.z);
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.div.innerHTML = this.constructor.name;
      this.applyDimensions();


   }
}
class Cube extends Shape {
   constructor(_pos, _rot, _size, _material) {
      super(_pos, _rot)
      this.type = "staticBlock";
      if (_size) {
         this.size = {
            x: _size.x,
            y: _size.y,
            z: _size.z
         }
      } else {
         this.size = {
            x: $("#sizeX").val() || 10,
            y: $("#sizeY").val() || 10,
            z: $("#sizeZ").val() || 10
         }
      }
      this.materialProp = _material ? _material : $("#materialSelect").val();
      this.material = new THREE.MeshBasicMaterial({
         color: 0x777777,
         side: THREE.DoubleSide,
         wireframe: true,
      });
      this.props.material = this.materialProp;
      this.props.size = this.size;
      this.geometry = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z);
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.div.innerHTML = this.constructor.name;
      this.applyDimensions();

   }
}
class Ramp extends Shape {
   constructor(_pos, _rot, _size) {
      super(_pos, _rot)
      this.type = "staticBlock";
      if (_size) {
         this.size = {
            x: _size.x,
            y: _size.y,
            z: _size.z
         }
      } else {
         this.size = {
            x: $("#sizeX").val() || 10,
            y: $("#sizeY").val() || 10,
            z: $("#sizeZ").val() || 10
         }
      }
      this.props.size = this.size;
      let shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(this.size.x, this.size.y);
      shape.lineTo(this.size.x, 0);
      shape.lineTo(0, 0);
      this.geometry = new THREE.ExtrudeGeometry(shape, {
         steps: 1,
         amount: this.size.z,
         bevelEnabled: false,
         bevelThickness: 1,
         bevelSize: 1,
         bevelSegments: 2
      });
      this.mesh = new THREE.Mesh(this.geometry, this.material); this.div.innerHTML = this.constructor.name;
      this.applyDimensions();

   }
}

class ActiveShape extends Shape {
   constructor(_pos, _rot, _id) {
      if (_pos && _rot)
         super(_pos, _rot);
      else
         super();
      if (_id)
         this.id = _id
      else
         this.id = `#${activeCount++}`;
      this.props.id = this.id;
      // this.props
      this.dynamic = true;
   }
}
class PressurePlate extends ActiveShape {
   constructor(_pos, _rot, _id) {
      super(_pos, _rot, _id);
      this.geometry = new THREE.BoxGeometry(2, 2, 2);
      this.mesh = new THREE.Mesh(this.geometry, this.mesh);
      this.div.innerHTML = this.constructor.name + " " + this.id;
   }
}

class Doors extends ActiveShape {
   constructor(_pos, _rot, _id) {
      super(_pos, _rot, _id);
      this.geometry = new THREE.BoxGeometry(2, 2, 2);
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.div.innerHTML = this.constructor.name + " " + this.id;
   }
}
class Spawner extends ActiveShape {
   constructor(_pos, _rot, _id) {
      super(_pos, _rot, _id);
      this.geometry = new THREE.BoxGeometry(5, 5, 5);
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.div.innerHTML = this.constructor.name + " " + this.id;
   }
}
class Button extends ActiveShape {
   constructor(_pos, _rot, _id) {
      super(_pos, _rot, _id);
      this.geometry = new THREE.BoxGeometry(5, 5, 5);
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.div.innerHTML = this.constructor.name + " " + this.id;
   }
}

class DynamicCube extends ActiveShape {
   constructor(_pos, _rot, _size, _id) {
      super(_pos, _rot);
      if (_size)
         this.size = {
            x: _size.x,
            y: _size.y,
            z: _size.z,
         }
      else
         this.size = {
            x: $("#sizeX").val() || 10,
            y: $("#sizeY").val() || 10,
            z: $("#sizeZ").val() || 10
         }

      this.geometry = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z);
      while (!(this.axis == "x" || this.axis == "y" || this.axis == "z")) {
         this.axis = window.prompt("Podaj oś (x, y, z)");
      }
      this.moveTo = window.prompt("Podaj moveTo (number)");
      this.props.axis = this.axis;
      this.props.moveTo = this.moveTo;
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.div.innerHTML = this.constructor.name + " " + this.id;
   }
}

class BlockEvent {
   constructor(_type, _emmiter, _receiver) {
      this.type = _type;
      this.emmiter = _emmiter;
      this.receiver = _receiver;
      this.wires = [];
      this.props = {
         type: this.type,
         emmiter: this.emmiter,
         receiver: this.receiver,
         wires: this.wires
      }
   }
   addWire(_pos, _rot, _len) {
      let geometry = new THREE.BoxGeometry(10, _len, 1);
      let material = new THREE.MeshBasicMaterial({
         color: 0xff0000,
         side: THREE.DoubleSide,
      });
      let mesh = new THREE.Mesh(geometry, material);
      let wire = {
         props: {
            position: {
               x: _pos.x,
               y: _pos.y,
               z: _pos.z,
            },
            rotation: {
               x: _rot.x,
               y: _rot.y,
               z: _rot.z,
            },
            size: {
               x: 10,
               y: _len,
               z: 0,
            },
         },
         mesh: mesh
      };
      wire.mesh.position.set(_pos.x, _pos.y, _pos.z)
      wire.mesh.rotation.set(_rot.x, _rot.y, _rot.z)
      this.wires.push(wire);
   }
   delete() {
      this.wires.forEach(wire => {
         scene.remove(wire.mesh);
      })
      let index = events.indexOf(this);
      events.splice(index, index + 1);
   }
}