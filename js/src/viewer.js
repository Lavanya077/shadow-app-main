import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Tween,update} from "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.esm.js"
var instance = null;

function create() {
  instance = new Viewer();
  instance.createUI();
  instance.createViewer();
  instance.animate();
  //instance.onDocumentClick()

  document.addEventListener(
    "mousemove",
    instance.mouseMoveForHighlight.bind(instance)
  );

  // window.addEventListener('click', (event) => instance.removeClickedObject(event), false);

  window.addEventListener(
    "dblclick",
    (event) => instance.onDocumentDoubleClick(event),
    false
  );

  const cubebut = document.getElementById("button3");
  cubebut.addEventListener("click", () => {
    instance.addCube();
  });
  const spherebut = document.getElementById("button4");
  spherebut.addEventListener("click", () => {
    instance.addSphere();
  });

  const conebut = document.getElementById("button5");
  conebut.addEventListener("click", () => {
    instance.addCone();
  });

  const wireframebut = document.getElementById("button1");
  wireframebut.addEventListener("click", () => {
    instance.updateWireframe();
  });

  const changebg = document.getElementById("bgcolor");
  changebg.addEventListener("change", (e) => {
    const color = e.target.value;
    instance.changebg(color);
  });

  const ambibut = document.getElementById("amlght");
  ambibut.addEventListener("click", () => {
    instance.amblights();
  });

  const dirbut = document.getElementById("dirlt");
  dirbut.addEventListener("click", () => {
    instance.dirlights();
  });

  const spotbut = document.getElementById("sptlt");
  spotbut.addEventListener("click", () => {
    instance.sptlights();
  });

  const axisbut = document.getElementById("axes");
  axisbut.addEventListener("click", () => {
    instance.axis();
  });

  const geobut = document.getElementById("button6");
  geobut.addEventListener("click", () => {
    instance.createRandomGeometry();
  });

  const clrbut = document.getElementById("clearButton");
  clrbut.addEventListener("click", () => {
    instance.clearScene();
  });

  let culrbut = document.getElementById("changeColorButton");
  culrbut.addEventListener("click", () => {
    instance.changeColors();
  });

  let multex = document.getElementById("multitexture");
  multex.addEventListener("click", () => {
    instance.sixfacecube();
  });
   

  let impbut = document.getElementById("implodebutton");
  impbut.addEventListener("click", () => {
    instance.implode();
  });

  let expbut = document.getElementById("explodebutton");
  expbut.addEventListener("click", () => {
    instance.explode();
  });

  let fourCubeButton = document.getElementById("addfourcube");
  fourCubeButton.addEventListener("click", () => {
    instance.fourCubeButton();
  });

  let groupbut = document.getElementById("groups");
  groupbut.addEventListener("click", () => {
    instance. createRootGroup();
  });


  let sinbut=document.getElementById("singleTexture");
  sinbut.addEventListener("click",()=>{
  instance.addSingleTextureCube();
  });

  window.addEventListener("resize", () => {
    instance.camera.aspect = window.innerWidth / window.innerHeight;
    instance.camera.updateProjectionMatrix();
    instance.renderer.setSize(
      window.innerWidth / 1.2,
      window.innerHeight / 1.06
    );
    instance.render();
  });
}

class Viewer {
  constructor() {
    this.color = "blue";
    this.container = null;
    this.scene = null;
    this.renderer = null;
    this.camera = null;
    this.controls = null;
    this.widthO = 1280;
    this.heightO = 680;
    this.gemontries=[];

    //CLICKING SPECIFIC OBJECT
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  createViewer() {
    //get canvas or container
    this.container = document.getElementById("scene-container");
    document.body.appendChild(this.container);

    // Raycaster and mouse vector
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Variable to store the currently highlighted object
    this.highlightedObject = null;

    //create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.widthO, this.heightO);
    this.renderer.setClearColor(0x404040);
    this.container.appendChild(this.renderer.domElement);

    // create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xe5e5e5);

    //create camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.widthO / this.heightO,
      1,
      10000
    );
    this.camera.position.set(10, 0, 0);
    this.scene.add(this.camera);

    //add controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    //code to cread axistraid scene
    this.container2 = document.getElementById("axis-container");
    this.scene2 = new THREE.Scene();
    this.scene2.background = new THREE.Color(0xe5ff45);
    const axes = new THREE.AxesHelper(100);
    this.scene2.add(axes);
    this.renderer2 = new THREE.WebGLRenderer();
    this.renderer2.setSize(150, 150);
    this.container2.appendChild(this.renderer2.domElement);
    this.camera2 = new THREE.PerspectiveCamera(45, 150 / 150, 0.1, 10000);

    //Window Resize Event
    window.addEventListener("resize", this.onWindowResize, false);
  }

  createUI() {}
  //RANDOM SHAPES
  createRandomGeometry() {
    const shapes = ["cube", "sphere", "cone"];

    for (let i = 0; i < 100; i++) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      let geometry;

      switch (shape) {
        case "cube":
          geometry = new THREE.BoxGeometry(5, 5, 5);
          break;
        case "sphere":
          geometry = new THREE.SphereGeometry(5, 32, 32);
          break;
        case "cone":
          geometry = new THREE.ConeGeometry(5, 10, 32);
          break;
      }

      const material = new THREE.MeshBasicMaterial({
        color: Math.random() * 0xffffff,
      });
      const mesh = new THREE.Mesh(geometry, material);



      mesh.position.set(
        (Math.random() - 1) * 50,
        (Math.random() - 1) * 50,
        (Math.random() - 1) * 50
      );

      this.scene.add(mesh);
    }
  }

  //CLEARING GEOMETRICS

  clearScene() {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
  }

  //CHANGING COLORS

  changeColors() {
    this.scene.children.forEach((child) => {
      if (child.isMesh) {
        child.material.color.set(Math.random() * 0xffffff);
      }
    });
  }

  mouseMoveForHighlight(event) {
    var _this = this;
    var intersectedObjects = _this.getIntersectedObjects(event);
    //code for hihglighted Objects
  }

  getIntersectedObjects(event) {
    event.preventDefault();
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;


    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length > 0) {
      if (this.INTERSECTED) {
        this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
      }
      this.INTERSECTED = intersects[0].object;
      this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();
      this.INTERSECTED.material.color.setHex(0xff0000);
    } else {
      if (this.INTERSECTED) {
        this.INTERSECTED.material.color.setHex(this.INTERSECTED.currentHex);
      }
    }
  }

  removeClickedObject(event) {
    event.preventDefault();
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    );

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;

      this.scene.remove(intersectedObject);
      this.renderer.render(this.scene, this.camera);
    }
  }

  onDocumentDoubleClick(event) {
    event.preventDefault();
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    );

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      this.focusOnObject(intersectedObject);
    }
  }


 sixfacecube() {
    const loader = new THREE.TextureLoader();

    const materials = [
      new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Blue
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Red
      new THREE.MeshBasicMaterial({ color: 0xffa500 }), // Orange
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Green
      new THREE.MeshBasicMaterial({ color: 0x808080 }), // Grey
      new THREE.MeshBasicMaterial({ color: 0xffff00 })  // Yellow
    ];
    const geometry = new THREE.BoxGeometry();
    const cube = new THREE.Mesh(geometry, materials);

    this.scene.add(cube);
  }


  explode() {
    new Tween(instance.gemontries[0].position).to({ x: 2, y: 2, z: 0 }, 1000).start();
    new Tween(instance.gemontries[1].position).to({ x: -2, y: 2, z: 0 }, 1000).start();
    new Tween(instance.gemontries[2].position).to({ x: 2, y: -2, z: 0 }, 1000).start();
    new Tween(instance.gemontries[3].position).to({ x: -2, y: -2, z: 0 }, 1000).start();
  }


  fourCubeButton(){

    const material1 = new THREE.MeshPhysicalMaterial({color:0xff09ff})
    const geometry1 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const cube1 = new THREE.Mesh(geometry1, material1);
    this.gemontries.push(cube1)
    cube1.position.set(1,1,0)
    this.scene.add(cube1);

    
    const material2 = new THREE.MeshBasicMaterial({color:0x20a8a6})
    const geometry2 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const cube2 = new THREE.Mesh(geometry2, material2);
    this.gemontries.push(cube2)
    cube2.position.set(-1,1,0)
    this.scene.add(cube2);

    
    const material3 = new THREE.MeshBasicMaterial({color:0xc999bf})
    const geometry3 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const cube3 = new THREE.Mesh(geometry3, material3);
    this.gemontries.push(cube3)
    cube3.position.set(1,-1,0)
    this.scene.add(cube3);

    
    const material4 = new THREE.MeshBasicMaterial({color:0xa5db27})
    const geometry4 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const cube4 = new THREE.Mesh(geometry4, material4);
    this.gemontries.push(cube4)
    cube4.position.set(-1,-1,0)
    this.scene.add(cube4);
  }

  
  
  
  
  implode() {
    const pos = [{
  
    }]


instance.gemontries.forEach((e)=>{
  
  new Tween(e.position).to({ x: -5, y: 5, z: 5 }, 10000).start();

})

    // new Tween(instance.gemontries[0].position).to({ x: 1, y: 1, z: 0 }, 1000).start();
    // new Tween(instance.gemontries[1].position).to({ x: -1, y: 1, z: 0 }, 1000).start();
    // new Tween(instance.gemontries[2].position).to({ x: 1, y: -1, z: 0 }, 1000).start();
    // new Tween(instance.gemontries[3].position).to({ x: -1, y: -1, z: 0 }, 1000).start();
    
  }

  focusOnObject(object) {
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);
    console.log(this.camera.position,'camera/position')

    let cameraZ = Math.abs((maxDim / 2) * Math.tan(fov * 2));
    cameraZ *= 0.1;

    const directionVector = new THREE.Vector3()
      .subVectors(this.camera.position, center)
      .normalize()
      .multiplyScalar(cameraZ);

    const newPos = new THREE.Vector3().addVectors(center, directionVector);
    console.log(newPos, 'newposition')


    this.camera.position.copy(newPos);

    this.camera.lookAt(center);
    this.controls.target.copy(center);
    this.controls.update();
    this.render();
  }


  createRootGroup() {
    const rootGroup = new THREE.Group();

    const rootBoxGeometry = new THREE.BoxGeometry(4, 4, 4);
    const rootBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const rootBox = new THREE.Mesh(rootBoxGeometry, rootBoxMaterial);
    rootBox.position.set(0, 0, 0);
    rootGroup.add(rootBox);


    const childGroup1 = new THREE.Group();
    const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    const cubeGeometry1 = new THREE.BoxGeometry(2, 2, 2);
    const cube1 = new THREE.Mesh(cubeGeometry1, material1);
    cube1.position.set(5, 0, 0);
    childGroup1.add(cube1);


    const sphereGeometry1 = new THREE.SphereGeometry(1.5, 32, 32);
    const sphere1 = new THREE.Mesh(sphereGeometry1, material1);
    sphere1.position.set(10, 0, 0);
    childGroup1.add(sphere1);

    this.cube1 = cube1;
    this.sphere1 = sphere1;
    

    const childGroup2 = new THREE.Group();
    const material2 = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    const coneGeometry2 = new THREE.ConeGeometry(1.5, 3, 32);
    const cone2 = new THREE.Mesh(coneGeometry2, material2);
    cone2.position.set(5, 5, 0);
    childGroup2.add(cone2);


    const torusGeometry2 = new THREE.TorusGeometry(1.5, 0.5, 16, 100);
    const torus2 = new THREE.Mesh(torusGeometry2, material2);
    torus2.position.set(10, 5, 0);
    childGroup2.add(torus2);

    this.cone2 = cone2;
    this.torus2 = torus2;


    rootGroup.add(childGroup1);
    rootGroup.add(childGroup2);

    this.scene.add(rootGroup);
  }
  


  addSingleTextureCube() {
    const texture = new THREE.TextureLoader().load('./images/natural.jpg');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    this.scene.add(cube);
  }


  addCube() {
    this.removeObject();
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const cubematerial = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const cube = new THREE.Mesh(geometry, cubematerial);
    cube.name = 'yash'
    this.scene.add(cube);
    this.animate();
  }
  addSphere() {
    this.removeObject();
    const sphereGeometry = new THREE.SphereGeometry(5, 10, 5);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: "red",
      wireframe: false,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.scene.add(sphere);
  }
  addCone() {
    this.removeObject();
    const geometry = new THREE.ConeGeometry(10, 5);
    const conematerial = new THREE.MeshBasicMaterial({
      color: 0xffa500,
      wireframe: false,
    });
    const cone = new THREE.Mesh(geometry, conematerial);
    this.scene.add(cone);
  }

  removeObject() {
    this.scene.remove(this.scene.children[1]);
  }

  animate(time) {
    // "use strict";
    if (this.animate) {
      this.camera2.position.copy(this.camera.position);
      this.camera2.position.sub(this.controls.target);
      this.camera2.position.setLength(300);
      this.camera2.lookAt(this.scene2.position);
      this.frameId = requestAnimationFrame(this.animate.bind(this));

    }

    if (this.cube1) {
      this.cube1.rotation.x += 0.01;
      this.cube1.rotation.y += 0.01;
    }

    if (this.sphere1) {
      this.sphere1.rotation.x += 0.01;
      this.sphere1.rotation.y += 0.01;
    }

    
    if (this.cone2) {
      this.cone2.rotation.x += 0.01;
      this.cone2.rotation.y += 0.01;
    }

    if (this.torus2) {
      this.torus2.rotation.x += 0.01;
      this.torus2.rotation.y += 0.01;
    }


    
    this.render();
    update(time)
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.renderer2.render(this.scene2, this.camera2);
  }

  changebg(color) {
    this.scene.background = new THREE.Color(color);
  }

  amblights() {
    const AmbientLight = new THREE.AmbientLight(0xcc0808);
    // this.scene.add(AmbientLight);
  }

  dirlights() {
    const directionalLight = new THREE.DirectionalLight("red", 1);
    directionalLight.position.set(20, 0, 0);
    this.scene.add(directionalLight);
    const helper = new THREE.DirectionalLightHelper(directionalLight, 3);
    this.scene.add(helper);
  }

  sptlights() {
    const spotLight = new THREE.SpotLight(0xf00fff, 1);
    spotLight.position.set(20, 0, 0);
    spotLight.castShadow = true;
    const helper = new THREE.SpotLightHelper(spotLight, 3);
    this.scene.add(spotLight);
    this.scene.add(helper);
  }

  updateWireframe() {
    this.scene.traverse(function (object) {
      if (object.type === "Mesh") {
        if (object.material.wireframe === true) {
          object.material.wireframe = false;
        } else {
          object.material.wireframe = true;
        }
      }
    });
  }
}

export { create };