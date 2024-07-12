import * as THREE  from 'three'

var shapes=null;

class object{
  constructor()
  {
    this.wireframe=null;
  }
  addcube()
  {
    const cubeGeometry = new THREE.BoxGeometry();
    const cubematerial=new THREE.MeshBasicMaterial({color:'green',wireframe:false})
    const cube = new THREE.Mesh(cubeGeometry,cubematerial);
    this.wireframe=cubematerial.wireframe
    return cube
    


  }
  addsphere()
  {
    const sphereGeometry = new THREE.SphereGeometry();
    const sphereMaterial = new THREE.MeshBasicMaterial({ color:"red",wireframe:false});
     const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    return sphere

  }
  addcone()
  {
    const geometry = new THREE.ConeGeometry();
    const conematerial = new THREE.MeshBasicMaterial({ color: 0xffa500,wireframe:false });
    const cone = new THREE.Mesh(geometry, conematerial);
    return cone
  }
 
}
  export{shapes};