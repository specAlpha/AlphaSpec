class Shape {
   constructor(_type, _size, _position, _rotation, _special, _id) {
      // type validation
      if (!(_type == "cube" || _type == "ramp" || _type == "plane" || _type == "player")) {
         console.log("typ " + _type);
         return;
      }
      this.type = _type;
      this.special = _special || false;
      this.id = _id || this.special ? specialCount++ : null;
      this.name;
      this.div;
      this.size = {
         x: $("#sizeX").val() || 10,
         y: $("#sizeY").val() || 10,
         z: $("#sizeZ").val() || 10
      };
      this.rotation = {
         x: $("#rotX").val() || 0,
         y: $("#rotY").val() || 0,
         z: $("#rotZ").val() || 0
      };
      this.position = {
         x: $("#posX").val() || 0,
         y: $("#posX").val() || 0,
         z: $("#posX").val() || 0
      };

      this.material = new THREE.MeshBasicMaterial({
         color: 0x123123,
         opacity: 1,
         side: THREE.DoubleSide,
      });
      this.texture = $("#materialSelect").val() || "default";
      this.geometry = this.getGeometry();
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      console.log(this.mesh);
      scene.add(this.mesh);

      objects.push(this);

      this.div = document.createElement('div');
      this.div.innerHTML = this.type;
      this.div.parent = this;
      $(this.div).on('click', this.edit);
      $(this.div).addClass('option');
      $(this.div).appendTo($('#list'));
      return this;
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
      $('#posZ').val(this.parent.position.z);
      $('#sizeX').val(this.parent.size.x);
      $('#sizeY').val(this.parent.size.y);
      $('#sizeZ').val(this.parent.size.z);
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
