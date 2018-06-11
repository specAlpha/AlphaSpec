class Shape {
   constructor(_type, _size = { x: 10, y: 10, z: 10 }, _position, _rotation) {
      if (!(_type == "cube" || _type == "ramp" || _type == "plane" || _type == "player")) {
         console.log("chuj kurwa nie ten typ cwelu");
         console.log("typ " + _type);
         return;
      }
      this.id;
      this.type;
      this.name;
      this.material;
      this.geometry = this.getGeometry(_type);
      this.mesh;
      this.div;
      this.size = {
         x: _size.x,
         y: _size.y,
         z: _size.z
      }
      this.rotation = {
         x: _rotation.x,
         y: _rotation.y,
         z: _rotation.z
      }
      this.position = {
         x: _position.x,
         y: _position.y,
         z: _position.z
      }

   }
   getGeometry(type) {
      if (type == "ramp") {
         let shape = new THREE.Shape();
         shape.moveTo(0, 0);
         shape.lineTo(this.size.x, this.size.y);
         shape.lineTo(this.size.x, 0);
         shape.lineTo(0, 0);
         let geometry = new THREE.ExtrudeGeometry(shape, {
            steps: 1,
            amount: size.z,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 1,
            bevelSegments: 2
         });
         return geometry;
      }
      else if (type == "player") {
         let geometry = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z);
      }
   }
}