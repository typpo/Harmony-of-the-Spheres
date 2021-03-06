import * as THREE from 'three';

export function getDistanceParams(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;

  return { dx, dy, dz, dSquared: dx * dx + dy * dy + dz * dz };
}

/*
 * Get the magnitude of the velocity of a celestial object orbiting a significantly more massive primary
 * Like, for example, Jupiter, or Earth, around the Sun
 * g is the gravitational constant, primary is the more massive object around which the other orbits
 * d is the distance between the primary and secondary and sm is the semimajor axis
 * If the semimajor axis and the distance are the same, you have the special case of a perfectly circular orbit
 * If an argument is not provided for the sm parameter, it is set to be equal to d, so you get the velocity for a circular orbit
*/

export function getVMag(g, primary, d, a = d) {
  return Math.sqrt(Math.abs(g * primary.m * (2 / d - 1 / a)));
}

export function getOrbit(primary, secondary, g, a) {
  const dParams = getDistanceParams(primary, secondary);

  const d = Math.sqrt(dParams.dSquared);

  const vMag = getVMag(g, primary, d, a);

  return {
    ...secondary,
    vx: primary.vx + -dParams.dy * vMag / d,
    vy: primary.vy + dParams.dx * vMag / d,
    vz: primary.vz + dParams.dz * vMag / d
  };
}

export function getPeriapsis(a, e) {
  return a * (1 - e);
}

export function getApoapsis(a, e) {
  return a * (1 + e);
}

export function getA(apsisOne, apsisTwo) {
  return (apsisOne + apsisTwo) / 2;
}

export function degreesToRadians(degrees) {
  return Math.PI / 180 * degrees;
}

/*
 * This method takes a point in 3D space and calculates the point on a given sphere that is closest to it
 * It takes the rotation of the sphere into account 
*/

export function getClosestPointOnSphere(point, spherePos, radius, rotation) {
  return point
    .sub(spherePos)
    .normalize()
    .multiplyScalar(radius)
    .add(spherePos)
    .applyAxisAngle(new THREE.Vector3(1, 0, 0), -rotation.x)
    .applyAxisAngle(new THREE.Vector3(0, 1, 0), -rotation.y)
    .applyAxisAngle(new THREE.Vector3(0, 0, 1), -rotation.z);
}

export function rotateVector(
  x,
  y,
  z,
  degrees = 0,
  axis = new THREE.Vector3(0, 0, 1),
  vector = new THREE.Vector3()
) {
  return vector.set(x, y, z).applyAxisAngle(axis, degreesToRadians(degrees));
}

export function calculateOrbitalVertices(orbitalPeriod, dt) {
  return (orbitalPeriod / dt * 1.1).toFixed(0);
}

export function getRandomNumberInRange(min, max) {
  return Math.random() * (max - min) + min;
}

export function getRandomRadian() {
  return Math.PI * 2 * Math.random();
}

export function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function createParticleDisc(
  particlesNumber = 0,
  primary = { m: 0, x: 0, y: 0, z: 0, vx: 0, vz: 0 },
  g = 39.5,
  minD = 0,
  maxD = 0
) {
  const particles = [];

  for (let i = 0; i < particlesNumber; i++) {
    const radian = getRandomRadian();
    const dist = getRandomNumberInRange(minD, maxD);

    const x = Math.cos(radian) * dist;
    const y = Math.sin(radian) * dist;
    const z = 0;

    const dParams = getDistanceParams({ x: 0, y: 0, z: 0 }, { x, y, z });

    const d = Math.sqrt(dParams.dSquared);

    const vMag = getVMag(g, primary, d);

    particles.push({
      x: x,
      y: y,
      z: z,
      vx: -dParams.dy * vMag / d,
      vy: dParams.dx * vMag / d,
      vz: 0
    });
  }

  return particles;
}

export function createParticleSystem(
  vectors = [],
  tilt = [0, 0, 0],
  primary = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 }
) {
  const tiltedVectors = [];

  const positionVector = new THREE.Vector3();
  const velocityVector = new THREE.Vector3();
  const axisVector = new THREE.Vector3();

  const vectorsLen = vectors.length;

  for (let i = 0; i < vectorsLen; i++) {
    const vector = vectors[i];

    const pTX = rotateVector(
      vector.x,
      vector.y,
      vector.z,
      tilt[0],
      axisVector.set(1, 0, 0),
      positionVector
    );

    const pTY = rotateVector(
      pTX.x,
      pTX.y,
      pTX.z,
      tilt[1],
      axisVector.set(0, 1, 0),
      positionVector
    );

    const pTZ = rotateVector(
      pTY.x,
      pTY.y,
      pTY.z,
      tilt[2],
      axisVector.set(0, 0, 1),
      positionVector
    );

    const vTX = rotateVector(
      vector.vx,
      vector.vy,
      vector.vz,
      tilt[0],
      axisVector.set(1, 0, 0),
      velocityVector
    );

    const vTY = rotateVector(
      vTX.x,
      vTX.y,
      vTX.z,
      tilt[1],
      axisVector.set(0, 1, 0),
      velocityVector
    );

    const vTZ = rotateVector(
      vTY.x,
      vTY.y,
      vTY.z,
      tilt[2],
      axisVector.set(0, 0, 1),
      velocityVector
    );

    tiltedVectors.push({
      x: primary.x + pTZ.x,
      y: primary.y + pTZ.y,
      z: primary.z + pTZ.z,
      vx: primary.vx + vTZ.x,
      vy: primary.vy + vTZ.y,
      vz: primary.vz + vTZ.z
    });
  }

  return tiltedVectors;
}
