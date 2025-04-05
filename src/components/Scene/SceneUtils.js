import * as THREE from 'three'
import * as dat from 'lil-gui'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import gsap from 'gsap'

const defaultValue = {
  colorPalatte: {
    primaryColor: 0xfffcef,
    secondaryColor: 0xefebe0,
  },
  materialType: {
    interior: {
      metalness: 0.5,
      roughness: 0.5,
      envMapIntensity: 2,
    },
    exterior: {
      metalness: 0.5,
      roughness: 0.3,
      envMapIntensity: 0.8,
    },
  },
  porschDefaultValue: {
    position: {
      x: 0,
      y: -0.6,
      z: 0.5,
    },
    rotation: {
      x: 0,
      y: 270 * (Math.PI / 180),
      z: 0,
    },
  },
  cameraView: {
    driverView: {
      position: { x: 0.2, y: 0.3, z: 1.2 },
      rotation: { x: -1.55, y: 1.17, z: 1.55 },
    },
    sideView: {
      position: { x: 0.05, y: 0.15, z: 3 },
      rotation: { x: -0.04, y: -0.04, z: 0 },
    },
    frontView: {
      position: { x: -3.2, y: 0.45, z: 1.15 },
      rotation: { x: -0.82, y: -1.26, z: -0.82 },
    },
    backView: {
      position: { x: 3.3, y: 0.3, z: 0.65 },
      rotation: { x: -0.82, y: -1.26, z: -0.82 },
    },
    topView: {
      position: { x: 0.75, y: 4.25, z: 0.02 },
      rotation: { x: -0.82, y: -1.26, z: -0.82 },
    },
  },
}

export const assetPaths = [
  '/assets/intro/intro.mp4',
  '/assets/about/porsche/porsche-bg.webp',
  '/assets/about/porsche/porsche-1.webp',
  '/assets/about/porsche/porsche-2.webp',
  '/assets/about/porsche/porsche-3.webp',
  '/assets/about/porsche/porsche-4.webp',
  '/assets/about/power/power-bg.webp',
  '/assets/about/power/engine.avif',
  '/assets/about/power/aerobar.avif',
  '/assets/about/power/brake.avif',
  '/assets/about/percision/percision-bg.webp',
  '/assets/about/percision/percision-1.webp',
  '/assets/about/percision/percision-2.webp',
  '/assets/about/percision/percision-3.webp',
  '/assets/about/passion/passion-bg.jfif',
  '/assets/about/passion/passion-1.jfif',
  '/assets/about/passion/passion-2.jfif',
  '/assets/about/passion/passion-3.jfif',
]

export const addLights = (canvas) => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  canvas.directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  canvas.directionalLight.position.set(-0.33, 0.33, 1.8)
  canvas.scene.add(ambientLight)
  canvas.scene.add(canvas.directionalLight)
}

export const addObjects = (canvas) => {
  canvas.material = new THREE.MeshStandardMaterial({
    roughness: 0.2,
    metalness: 0.8,
    transparent: true,
    opacity: 0.05,
  })

  canvas.geometry = new THREE.CircleGeometry(5, 32)
  canvas.plane = new THREE.Mesh(canvas.geometry, canvas.material)
  canvas.plane.rotation.x = -Math.PI / 2
  canvas.plane.position.y = -0.7
  canvas.plane.position.z = 0.25
  canvas.scene.add(canvas.plane)
}

export const cameraController = (canvas, addController = true) => {
  canvas.cameraGroup1 = new THREE.Group()
  canvas.camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.001,
    1000,
  )
  canvas.scene.add(canvas.cameraGroup1)
  if (addController) {
    canvas.controls = new OrbitControls(canvas.camera, canvas.renderer.domElement)
    canvas.controls.enableDamping = true
    canvas.controls.maxPolarAngle = Math.PI / 2
  }
}

export const clearScene = (canvas) => {
  canvas.renderer.renderLists.dispose()
}

export const debugController = (canvas) => {
  const { cameraView, materialType, porschDefaultValue } = defaultValue
  const settingsValue = {
    cameraX: cameraView.sideView.position.x,
    cameraY: cameraView.sideView.position.y,
    cameraZ: cameraView.sideView.position.z,
    cameraRotX: cameraView.sideView.rotation.x,
    cameraRotY: cameraView.sideView.rotation.y,
    cameraRotZ: cameraView.sideView.rotation.z,
    light2X: canvas.directionalLight.position.x,
    light2Y: canvas.directionalLight.position.y,
    light2Z: canvas.directionalLight.position.z,
    light2Intensity: canvas.directionalLight.intensity,
    light2Color: `#${canvas.directionalLight.color.getHexString()}`,
    metalness: materialType.exterior.metalness,
    roughness: materialType.exterior.roughness,
    envMapIntensity: materialType.exterior.envMapIntensity,
    carRotationX: porschDefaultValue.rotation.x,
    carRotationY: porschDefaultValue.rotation.y,
    carRotationZ: porschDefaultValue.rotation.z,
  }
  function updateMaterialProperties(value, property) {
    canvas.porsche.traverse((child) => {
      if (child.material) {
        if (property === 'metalness') {
          child.material.metalness = parseFloat(value)
        } else if (property === 'roughness') {
          child.material.roughness = parseFloat(value)
        } else if (property === 'envMapIntensity') {
          child.material.envMapIntensity = parseFloat(value)
        }
        child.material.needsUpdate = true
      }
    })
  }

  function updateSettings() {
    settingsValue.cameraX = canvas.camera.position.x.toFixed(2)
    settingsValue.cameraY = canvas.camera.position.y.toFixed(2)
    settingsValue.cameraZ = canvas.camera.position.z.toFixed(2)
    settingsValue.cameraRotX = canvas.camera.rotation.x.toFixed(2)
    settingsValue.cameraRotY = canvas.camera.rotation.y.toFixed(2)
    settingsValue.cameraRotZ = canvas.camera.rotation.z.toFixed(2)
  }

  if (canvas.controls) {
    canvas.controls.addEventListener('change', () => {
      updateSettings()
    })
  }

  canvas.gui = new dat.GUI()

  // Camera position controls
  const cameraFolder = canvas.gui.addFolder('Camera')
  cameraFolder
    .add(settingsValue, 'cameraX', -10, 10, 0.01)
    .listen()
    .onChange((value) => {
      canvas.camera.position.x = parseFloat(value.toFixed(2))
      settingsValue.cameraX = canvas.camera.position.x.toFixed(2)
    })

  cameraFolder
    .add(settingsValue, 'cameraY', -10, 10, 0.01)
    .listen()
    .onChange((value) => {
      canvas.camera.position.y = parseFloat(value.toFixed(2))
      settingsValue.cameraY = canvas.camera.position.y.toFixed(2)
    })

  cameraFolder
    .add(settingsValue, 'cameraZ', -10, 10, 0.01)
    .listen()
    .onChange((value) => {
      canvas.camera.position.z = parseFloat(value.toFixed(2))
      settingsValue.cameraZ = canvas.camera.position.z.toFixed(2)
    })
  cameraFolder
    .add(settingsValue, 'cameraRotX', -10, 10, 0.01)
    .listen()
    .onChange((value) => {
      canvas.camera.rotation.x = parseFloat(value.toFixed(2))
      settingsValue.cameraRotX = canvas.camera.rotation.x.toFixed(2)
    })
  cameraFolder
    .add(settingsValue, 'cameraRotY', -10, 10, 0.01)
    .listen()
    .onChange((value) => {
      canvas.camera.rotation.y = parseFloat(value.toFixed(2))
      settingsValue.cameraRotY = canvas.camera.rotation.y.toFixed(2)
    })
  cameraFolder
    .add(settingsValue, 'cameraRotZ', -10, 10, 0.01)
    .listen()
    .onChange((value) => {
      canvas.camera.rotation.z = parseFloat(value.toFixed(2))
      settingsValue.cameraRotZ = canvas.camera.rotation.z.toFixed(2)
    })
  cameraFolder
    .add(
      { goToDriverView: () => goToCameraView(canvas, 'driverView', 'interior') },
      'goToDriverView',
    )
    .name('Go to Driver View')
  cameraFolder
    .add({ goToSideView: () => goToCameraView(canvas, 'sideView', 'exterior') }, 'goToSideView')
    .name('Go to Side View')
  cameraFolder
    .add({ goToFrontView: () => goToCameraView(canvas, 'frontView', 'exterior') }, 'goToFrontView')
    .name('Go to Front View')
  cameraFolder
    .add(
      {
        rotateAroundView: () => rotateAroundView(),
      },
      'rotateAroundView',
    )
    .name('Rotate Around View')
  cameraFolder
    .add({ goToBackView: () => goToCameraView(canvas, 'backView', 'exterior') }, 'goToBackView')
    .name('Go To Back View')
  cameraFolder
    .add({ goToTopView: () => goToCameraView(canvas, 'topView', 'exterior') }, 'goToTopView')
    .name('Go To Top View')
  // cameraFolder.close()
  // light 2 pos
  const light2Folder = canvas.gui.addFolder('Light')
  light2Folder
    .add(settingsValue, 'light2X', -20, 20, 0.01)
    .listen()
    .onChange((value) => {
      if (canvas.directionalLight) {
        canvas.directionalLight.position.x = parseFloat(value.toFixed(2))
        settingsValue.light2X = canvas.directionalLight.position.x.toFixed(2)
      }
    })
  light2Folder
    .add(settingsValue, 'light2Y', -20, 20, 0.01)
    .listen()
    .onChange((value) => {
      if (canvas.directionalLight) {
        canvas.directionalLight.position.y = parseFloat(value.toFixed(2))
        settingsValue.light2X = canvas.directionalLight.position.y.toFixed(2)
      }
    })
  light2Folder
    .add(settingsValue, 'light2Z', -20, 20, 0.01)
    .listen()
    .onChange((value) => {
      if (canvas.directionalLight) {
        canvas.directionalLight.position.z = parseFloat(value.toFixed(2))
        settingsValue.light2X = canvas.directionalLight.position.z.toFixed(2)
      }
    })
  // Add intensity control
  light2Folder
    .add(settingsValue, 'light2Intensity', 0, 10, 0.01)
    .listen()
    .onChange((value) => {
      if (canvas.directionalLight) {
        canvas.directionalLight.intensity = parseFloat(value.toFixed(2))
        settingsValue.light2Intensity = canvas.directionalLight.intensity.toFixed(2)
      }
    })

  // Add color control
  light2Folder
    .addColor(settingsValue, 'light2Color')
    .listen()
    .onChange((value) => {
      canvas.directionalLight.color.set(value)
      settingsValue.light2Color = value
    })
  light2Folder.close()

  // Group material settings
  const carFolder = canvas.gui.addFolder('Car Settings')
  carFolder
    .add(settingsValue, 'metalness', 0, 1, 0.01)
    .listen()
    .onChange((value) => {
      updateMaterialProperties(value, 'metalness')
    })
  carFolder
    .add(settingsValue, 'roughness', 0, 1, 0.01)
    .listen()
    .onChange((value) => {
      updateMaterialProperties(value, 'roughness')
    })
  carFolder
    .add(settingsValue, 'envMapIntensity', -10, 10, 0.01)
    .listen()
    .onChange((value) => {
      updateMaterialProperties(value, 'envMapIntensity')
    })
  carFolder
    .add(settingsValue, 'carRotationX', -10, 10, 0.01)
    .listen()
    .onChange((value) => {
      if (canvas.porsche) {
        canvas.porsche.rotation.x = parseFloat(value)
        settingsValue.carRotationX = value
      }
    })
  carFolder
    .add(settingsValue, 'carRotationY', -10, 10, 0.01)
    .listen()
    .onChange((value) => {
      if (canvas.porsche) {
        canvas.porsche.rotation.y = parseFloat(value)
        settingsValue.carRotationY = value
      }
    })
  carFolder
    .add(settingsValue, 'carRotationZ', -10, 10, 0.01)
    .listen()
    .onChange((value) => {
      if (canvas.porsche) {
        canvas.porsche.rotation.z = parseFloat(value)
        settingsValue.carRotationZ = value
      }
    })
  carFolder.close()
}

export const goToCameraView = (canvas, viewScene, materialTypeKey) => {
  const { cameraView, materialType } = defaultValue
  let targetPosition, targetRotation
  const transSec = 1.5
  const easeType = 'expo.inOut'

  switch (viewScene) {
    case 'driverView':
      targetPosition = cameraView.driverView.position
      targetRotation = cameraView.driverView.rotation
      break
    case 'sideView':
      targetPosition = cameraView.sideView.position
      targetRotation = cameraView.sideView.rotation
      break
    case 'frontView':
      targetPosition = cameraView.frontView.position
      targetRotation = cameraView.frontView.rotation
      break
    case 'backView':
      targetPosition = cameraView.backView.position
      targetRotation = cameraView.backView.rotation
      break
    case 'topView':
      targetPosition = cameraView.topView.position
      targetRotation = cameraView.topView.rotation
      break
    default:
      return
  }

  gsap.to(canvas.camera.position, {
    duration: transSec,
    ease: easeType,
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z,
    onUpdate: () => {
      if (gsap.getProperty(canvas.camera.position, 'progress') > 0.5) {
        canvas.porsche.traverse((child) => {
          if (child.material) {
            child.material.metalness = materialType[materialTypeKey].metalness // Use local materialType
            child.material.roughness = materialType[materialTypeKey].roughness
            child.material.envMapIntensity = materialType[materialTypeKey].envMapIntensity
          }
        })
      }
    },
  })

  gsap.to(canvas.camera.rotation, {
    duration: transSec,
    ease: easeType,
    x: targetRotation.x,
    y: targetRotation.y,
    z: targetRotation.z,
  })
}

export const initializeScene = (canvas, options) => {
  const { colorPalatte } = defaultValue
  canvas.scene = new THREE.Scene()
  canvas.container = options.dom
  canvas.width = canvas.container.offsetWidth
  canvas.height = canvas.container.offsetHeight
  canvas.renderer = new THREE.WebGLRenderer({ antialias: true })
  canvas.renderer.setClearColor(0xececec, 1)
  canvas.renderer.setPixelRatio(window.devicePixelRatio)
  canvas.renderer.setSize(canvas.width, canvas.height)
  canvas.renderer.setClearColor(colorPalatte.primaryColor, 1)
  canvas.renderer.toneMapping = THREE.ACESFilmicToneMapping
  canvas.renderer.outputEncoding = THREE.sRGBEncoding
  canvas.renderer.shadowMap.enabled = true
  canvas.renderer.shadowMap.type = THREE.PCFSoftShadowMap
  canvas.container.appendChild(canvas.renderer.domElement)
  canvas.time = new THREE.Clock()
  canvas.elapsedTime = 0
}

export const loadHDR = (canvas) => {
  const rgbeLoader = new RGBELoader(canvas.loadingManager)
  const pmremGenerator = new THREE.PMREMGenerator(canvas.renderer)
  pmremGenerator.compileEquirectangularShader()

  rgbeLoader.load('/models/env.hdr', (texture) => {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture
    canvas.scene.environment = envMap
    canvas.renderer.toneMappingExposure = 0.6
    texture.dispose()
    pmremGenerator.dispose()
  })
}

export const loadModels = (canvas) => {
  const { porschDefaultValue, materialType } = defaultValue
  canvas.dracoLoader = new DRACOLoader()
  canvas.dracoLoader.setDecoderPath('/draco/')
  canvas.dracoLoader.setDecoderConfig({ type: 'js' })
  canvas.gltfLoader = new GLTFLoader(canvas.loadingManager)
  canvas.gltfLoader.setDRACOLoader(canvas.dracoLoader)

  canvas.gltfLoader.load('/models/porsche.glb', (gltf) => {
    canvas.porsche = gltf.scene
    canvas.porsche.scale.set(1, 1, 1)
    canvas.porsche.traverse((child) => {
      child.castShadow = true
      child.receiveShadow = true
      if (child.material) {
        child.material.metalness = materialType.exterior.metalness
        child.material.roughness = materialType.exterior.roughness
        if (child.material.map) {
          child.material.map.minFilter = THREE.LinearFilter
          child.material.map.generateMipmaps = false
          child.material.map.needsUpdate = true
        }
        child.material.needsUpdate = true
      }
    })
    canvas.porsche.position.set(
      porschDefaultValue.position.x,
      porschDefaultValue.position.y,
      porschDefaultValue.position.z,
    )
    canvas.porsche.rotation.y = porschDefaultValue.rotation.y
    canvas.scene.add(canvas.porsche)
  })
}

export const resize = (canvas) => {
  canvas.width = canvas.container.offsetWidth
  canvas.height = canvas.container.offsetHeight
  canvas.renderer.setSize(canvas.width, canvas.height)
  canvas.camera.aspect = canvas.width / canvas.height
  canvas.camera.updateProjectionMatrix()
}

export const rotateAroundView = (canvas) => {
  const target = canvas.porsche.position.clone()

  // Calculate initial parameters
  const deltaX = canvas.camera.position.x - target.x
  const deltaZ = canvas.camera.position.z - target.z
  const currentRadius = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ)

  // Calculate the starting angle from the camera's current position
  const startAngle = Math.atan2(deltaZ, deltaX) // Angle in radians

  gsap.to(
    { angle: startAngle }, // Start from the current angle
    {
      angle: startAngle + Math.PI * 1.65, // Complete one full rotation
      duration: 4, // Duration of the rotation
      ease: 'power1.out',
      onUpdate: function () {
        const angle = this.targets()[0].angle // Extract the current angle
        const x = target.x + currentRadius * Math.cos(angle)
        const z = target.z + currentRadius * Math.sin(angle) * 0.9
        canvas.camera.position.set(x, canvas.camera.position.y, z)
        canvas.camera.lookAt(target)
        canvas.initialCameraZ = z
      },
    },
  )
}

export const setupResize = (canvas) => {
  window.addEventListener('resize', () => resize(canvas))
}

export default {
  addLights,
  addObjects,
  assetPaths,
  clearScene,
  cameraController,
  debugController,
  goToCameraView,
  initializeScene,
  loadHDR,
  loadModels,
  resize,
  rotateAroundView,
  setupResize,
}
