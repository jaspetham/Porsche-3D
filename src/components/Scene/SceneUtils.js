import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

export const colorPalatte = {
  primaryColor: 0xfffcef,
  secondaryColor: 0xefebe0,
}

export const materialType = {
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
}

export const porschDefaultValue = {
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
}

export const cameraView = {
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
}

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
        child.material.metalness = materialType.exterior.metalness // Use local materialType
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
      porschDefaultValue.position.x, // Use local porschDefaultValue
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

export const setupResize = (canvas) => {
  window.addEventListener('resize', () => resize(canvas))
}

export const cameraController = (canvas) => {
  canvas.cameraGroup1 = new THREE.Group()
  canvas.camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.001,
    1000,
  )
  canvas.scene.add(canvas.cameraGroup1)
  canvas.controls = new OrbitControls(canvas.camera, canvas.renderer.domElement)
  canvas.controls.enableDamping = true
  canvas.controls.maxPolarAngle = Math.PI / 2
}

export const goToCameraView = (canvas, viewScene, materialTypeKey) => {
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

export default {
  colorPalatte,
  materialType,
  porschDefaultValue,
  cameraView,
  addLights,
  addObjects,
  cameraController,
  goToCameraView,
  loadHDR,
  loadModels,
  resize,
  setupResize,
}
