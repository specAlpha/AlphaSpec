function OIMOtoThreeVec3(OimoVec) {
    return new THREE.Vector3(OimoVec.x, OimoVec.y, OimoVec.z)

}

function THREEtoOimoVec(vec) {
    return new OIMO.Vec3(vec.x, vec.y, vec.z)

}

function OIMOtoThreeQuat(quat) {
    return new THREE.Quaternion(quat.x, quat.y, quat.z, quat.w)

}

function THREEtoOimoEuler(euler) {
    return new OIMO.Vec3(euler.x, euler.y, euler.z)

}