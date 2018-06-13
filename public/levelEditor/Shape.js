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
      this.material = new THREE.MeshBasicMaterial({
         color: 0x123123,
         opacity: 1,
         side: THREE.DoubleSide,
      });
      this.texture = $("#materialSelect").val() || "default";

      this.div = document.createElement('div');
      this.div.innerHTML = "default";
      this.div.parent = this;
      $(this.div).on('click', this.edit.bind(this));
      $(this.div).addClass('option');
      $(this.div).appendTo($('#list'));
      objects.push(this);
   }
   applyDimensions() {
      console.log(this.position)
      this.mesh.position.set(this.position.x, this.position.y, this.position.z)
   }
   delete() {
      $(this.div).remove();
      scene.remove(this.mesh);
      let index = objects.indexOf(this);
      objects.splice(index, index + 1);
   }
   edit() {
      if (currSel) $(currSel.div).toggleClass("check")
      $(this.div).toggleClass("check");
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
   constructor(_pos, _rot, _size) {
      super(_pos, _rot)
      this.type = "staticBlock";
      if (_size) {
         this.size = {
            x: $("#sizeX").val() || 10,
            y: $("#sizeY").val() || 10,
            z: $("#sizeZ").val() || 10
         }

      } else {

      }
      this.props.size = this.size;
      this.geometry = new THREE.PlaneGeometry(this.size.x, this.size.y, this.size.z);
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.div.innerHTML = this.constructor.name;
      this.applyDimensions();


   }
}
class Cube extends Shape {
   constructor(_pos, _rot, _size) {
      super(_pos, _rot)
      this.type = "staticBlock";
      this.size = {
         x: $("#sizeX").val() || 10,
         y: $("#sizeY").val() || 10,
         z: $("#sizeZ").val() || 10
      }
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
      this.size = {
         x: $("#sizeX").val() || 10,
         y: $("#sizeY").val() || 10,
         z: $("#sizeZ").val() || 10
      };
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
// class dynamicCube extends Shape {
//    constructor() {
//       super()
//       this.type = "dynamicTile"
//    }
// }
