class Shape {
   constructor(_type, _size = { x: 10, y: 10, z: 10 }, _position = { x: 0, y: 0, z: 0 }, _rotation = { x: 0, y: 0, z: 0 }) {
      // type validation
      if (!(_type == "cube" || _type == "ramp" || _type == "plane" || _type == "player")) {
         console.log("typ " + _type);
         return;
      }
      this.id;
      this.type = _type;
      this.name;
      this.div;
      this.size = {
         x: _size.x,
         y: _size.y,
         z: _size.z
      };
      this.rotation = {
         x: _rotation.x,
         y: _rotation.y,
         z: _rotation.z
      };
      this.position = {
         x: _position.x,
         y: _position.y,
         z: _position.z
      };
      this.material = new THREE.MeshBasicMaterial({
         color: 0x123123,
         opacity: 1,
         side: THREE.DoubleSide,
      });
      this.geometry = this.getGeometry();
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      console.log(this.mesh);
      scene.add(this.mesh);


      this.div = document.createElement('div');
      this.div.innerHTML = this.type;
      this.div.parent = this;
      $(this.div).on('click', this.edit);
      $(this.div).addClass('option');
      $(this.div).appendTo($('#list'));

   }

   edit() {
      if (currSel) $(currSel.div).toggleClass("check")

      $(this).toggleClass("check");
      currSel = this.parent;
      $('#posX').val(this.parent.position.x);
      $('#posY').val(this.parent.position.y);
      $('#posZ').val(this.parent.position.z);
      $('#rotX').val(this.parent.rotation.x);
      $('#rotY').val(this.parent.rotation.y);
      $('#rotZ').val(this.parent.rotation.z);
   }
   udapteRotatoin(axis, value) {
      this.rotation[axis] = value;
   }

   getGeometry() {
      let geometry;
      switch (this.type) {
         case ("ramp"): {
            let shape = new THREE.Shape();
            shape.moveTo(0, 0);
            shape.lineTo(this.size.x, this.size.y);
            shape.lineTo(this.size.x, 0);
            shape.lineTo(0, 0);
            geometry = new THREE.ExtrudeGeometry(shape, {
               steps: 1,
               amount: this.size.z,
               bevelEnabled: false,
               bevelThickness: 1,
               bevelSize: 1,
               bevelSegments: 2
            });
         }
            break;

         case ("player"): {
            console.log(this.size)
            geometry = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z);
         }
            break;

         case ("plane"): {
            geometry = new THREE.PlaneGeometry(this.size.x, this.size.y, this.size.z)
         }
         case ("cube"): {
            geometry = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z)
         }
            break;
      }
      return geometry;
   }
}
