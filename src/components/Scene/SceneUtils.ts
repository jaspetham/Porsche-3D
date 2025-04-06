import * as THREE from 'three'
import { GUI } from 'lil-gui'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import gsap from 'gsap'

export {
  THREE,
  DRACOLoader,
  GLTFLoader,
  type GLTF,
  OrbitControls,
  RGBELoader,
  GUI,
  gsap, // Export gsap as a named export
}

// Type definitions
interface Vector3Config {
  x: number
  y: number
  z: number
}

interface MaterialConfig {
  metalness: number
  roughness: number
  envMapIntensity: number
}

interface CameraViewConfig {
  position: Vector3Config
  rotation: Vector3Config
}

export interface Canvas {
  scene: THREE.Scene
  container?: HTMLElement
  width?: number
  height?: number
  renderer: THREE.WebGLRenderer
  camera: THREE.PerspectiveCamera
  cameraGroup1?: THREE.Group
  controls?: OrbitControls
  time?: THREE.Clock
  elapsedTime?: number
  material?: THREE.MeshStandardMaterial
  geometry?: THREE.CircleGeometry
  plane?: THREE.Mesh
  directionalLight?: THREE.DirectionalLight
  porsche?: THREE.Group
  gui?: GUI
  dracoLoader?: DRACOLoader
  gltfLoader?: GLTFLoader
  loadingManager?: THREE.LoadingManager
}

// Enum for camera views
export enum CameraView {
  DriverView = 'driverView',
  SideView = 'sideView',
  FrontView = 'frontView',
  BackView = 'backView',
  TopView = 'topView',
}

// Enum for material types
export enum MaterialType {
  Interior = 'interior',
  Exterior = 'exterior',
}

// Default values with types
export const defaultValue = {
  colorPalatte: {
    primaryColor: 0xfffcef,
    secondaryColor: 0xefebe0,
  },
  materialType: {
    [MaterialType.Interior]: {
      metalness: 0.5,
      roughness: 0.5,
      envMapIntensity: 2,
    } as MaterialConfig,
    [MaterialType.Exterior]: {
      metalness: 0.5,
      roughness: 0.3,
      envMapIntensity: 0.8,
    } as MaterialConfig,
  },
  porschDefaultValue: {
    position: {
      x: 0,
      y: -0.6,
      z: 0.5,
    } as Vector3Config,
    rotation: {
      x: 0,
      y: 270 * (Math.PI / 180),
      z: 0,
    } as Vector3Config,
  },
  cameraView: {
    [CameraView.DriverView]: {
      position: { x: 0.25, y: 0.35, z: 0.75 },
      rotation: { x: -1.5, y: 1.1, z: 1.5 },
    } as CameraViewConfig,
    [CameraView.SideView]: {
      position: { x: 0.05, y: 0.15, z: 3 },
      rotation: { x: -0.04, y: -0.04, z: 0 },
    } as CameraViewConfig,
    [CameraView.FrontView]: {
      position: { x: -3.2, y: 0.45, z: 1.15 },
      rotation: { x: -0.82, y: -1.26, z: -0.82 },
    } as CameraViewConfig,
    [CameraView.BackView]: {
      position: { x: 3.3, y: 0.3, z: 0.65 },
      rotation: { x: -0.82, y: -1.26, z: -0.82 },
    } as CameraViewConfig,
    [CameraView.TopView]: {
      position: { x: 0.75, y: 4.25, z: 0.02 },
      rotation: { x: -0.82, y: -1.26, z: -0.82 },
    } as CameraViewConfig,
  },
}

// Asset paths
export const assetPaths: string[] = [
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

export const addLights = (canvas: Canvas): void => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  canvas.directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  canvas.directionalLight.position.set(-0.33, 0.33, 1.8)
  canvas.scene.add(ambientLight)
  canvas.scene.add(canvas.directionalLight)
}

export const addObjects = (canvas: Canvas): void => {
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

export const cameraController = (canvas: Canvas, addController: boolean = true): void => {
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

export const clearScene = (canvas: Canvas): void => {
  canvas.renderer.renderLists.dispose()
}

export const debugController = (canvas: Canvas): void => {
  const { cameraView, materialType, porschDefaultValue } = defaultValue
  const settingsValue = {
    cameraX: cameraView[CameraView.SideView].position.x,
    cameraY: cameraView[CameraView.SideView].position.y,
    cameraZ: cameraView[CameraView.SideView].position.z,
    cameraRotX: cameraView[CameraView.SideView].rotation.x,
    cameraRotY: cameraView[CameraView.SideView].rotation.y,
    cameraRotZ: cameraView[CameraView.SideView].rotation.z,
    light2X: canvas.directionalLight?.position.x || 0,
    light2Y: canvas.directionalLight?.position.y || 0,
    light2Z: canvas.directionalLight?.position.z || 0,
    light2Intensity: canvas.directionalLight?.intensity || 0,
    light2Color: `#${canvas.directionalLight?.color.getHexString() || 'ffffff'}`,
    metalness: materialType[MaterialType.Exterior].metalness,
    roughness: materialType[MaterialType.Exterior].roughness,
    envMapIntensity: materialType[MaterialType.Exterior].envMapIntensity,
    carPositionX: porschDefaultValue.position.x,
    carPositionY: porschDefaultValue.position.y,
    carPositionZ: porschDefaultValue.position.z,
    carRotationX: porschDefaultValue.rotation.x,
    carRotationY: porschDefaultValue.rotation.y,
    carRotationZ: porschDefaultValue.rotation.z,
  }

  function updateMaterialProperties(value: number, property: string): void {
    canvas.porsche?.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
        const material = child.material as THREE.MeshStandardMaterial
        if (property === 'metalness') {
          material.metalness = value
        } else if (property === 'roughness') {
          material.roughness = value
        } else if (property === 'envMapIntensity') {
          material.envMapIntensity = value
        }
        material.needsUpdate = true
      }
    })
  }

  function updateSettings(): void {
    settingsValue.cameraX = Number(canvas.camera.position.x.toFixed(2))
    settingsValue.cameraY = Number(canvas.camera.position.y.toFixed(2))
    settingsValue.cameraZ = Number(canvas.camera.position.z.toFixed(2))
    settingsValue.cameraRotX = Number(canvas.camera.rotation.x.toFixed(2))
    settingsValue.cameraRotY = Number(canvas.camera.rotation.y.toFixed(2))
    settingsValue.cameraRotZ = Number(canvas.camera.rotation.z.toFixed(2))
  }

  if (canvas.controls) {
    canvas.controls.addEventListener('change', updateSettings)
  }

  canvas.gui = new GUI()

  const cameraFolder = canvas.gui.addFolder('Camera')
  cameraFolder
    .add(settingsValue, 'cameraX', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      canvas.camera.position.x = Number(value.toFixed(2))
      settingsValue.cameraX = Number(canvas.camera.position.x.toFixed(2))
    })
  cameraFolder
    .add(settingsValue, 'cameraY', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      canvas.camera.position.y = Number(value.toFixed(2))
      settingsValue.cameraY = Number(canvas.camera.position.y.toFixed(2))
    })
  cameraFolder
    .add(settingsValue, 'cameraZ', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      canvas.camera.position.z = Number(value.toFixed(2))
      settingsValue.cameraZ = Number(canvas.camera.position.z.toFixed(2))
    })
  cameraFolder
    .add(settingsValue, 'cameraRotX', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      canvas.camera.rotation.x = Number(value.toFixed(2))
      settingsValue.cameraRotX = Number(canvas.camera.rotation.x.toFixed(2))
    })
  cameraFolder
    .add(settingsValue, 'cameraRotY', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      canvas.camera.rotation.y = Number(value.toFixed(2))
      settingsValue.cameraRotY = Number(canvas.camera.rotation.y.toFixed(2))
    })
  cameraFolder
    .add(settingsValue, 'cameraRotZ', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      canvas.camera.rotation.z = Number(value.toFixed(2))
      settingsValue.cameraRotZ = Number(canvas.camera.rotation.z.toFixed(2))
    })
  cameraFolder
    .add(
      {
        goToDriverView: () => goToCameraView(canvas, CameraView.DriverView, MaterialType.Interior),
      },
      'goToDriverView',
    )
    .name('Go to Driver View')
  cameraFolder
    .add(
      { goToSideView: () => goToCameraView(canvas, CameraView.SideView, MaterialType.Exterior) },
      'goToSideView',
    )
    .name('Go to Side View')
  cameraFolder
    .add(
      { goToFrontView: () => goToCameraView(canvas, CameraView.FrontView, MaterialType.Exterior) },
      'goToFrontView',
    )
    .name('Go to Front View')
  cameraFolder
    .add({ rotateAroundView: () => rotateAroundView(canvas) }, 'rotateAroundView')
    .name('Rotate Around View')
  cameraFolder
    .add(
      { goToBackView: () => goToCameraView(canvas, CameraView.BackView, MaterialType.Exterior) },
      'goToBackView',
    )
    .name('Go To Back View')
  cameraFolder
    .add(
      { goToTopView: () => goToCameraView(canvas, CameraView.TopView, MaterialType.Exterior) },
      'goToTopView',
    )
    .name('Go To Top View')

  const light2Folder = canvas.gui.addFolder('Light')
  light2Folder
    .add(settingsValue, 'light2X', -20, 20, 0.01)
    .listen()
    .onChange((value: number) => {
      if (canvas.directionalLight) {
        canvas.directionalLight.position.x = Number(value.toFixed(2))
        settingsValue.light2X = Number(canvas.directionalLight.position.x.toFixed(2))
      }
    })
  light2Folder
    .add(settingsValue, 'light2Y', -20, 20, 0.01)
    .listen()
    .onChange((value: number) => {
      if (canvas.directionalLight) {
        canvas.directionalLight.position.y = Number(value.toFixed(2))
        settingsValue.light2Y = Number(canvas.directionalLight.position.y.toFixed(2))
      }
    })
  light2Folder
    .add(settingsValue, 'light2Z', -20, 20, 0.01)
    .listen()
    .onChange((value: number) => {
      if (canvas.directionalLight) {
        canvas.directionalLight.position.z = Number(value.toFixed(2))
        settingsValue.light2Z = Number(canvas.directionalLight.position.z.toFixed(2))
      }
    })
  light2Folder
    .add(settingsValue, 'light2Intensity', 0, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      if (canvas.directionalLight) {
        canvas.directionalLight.intensity = Number(value.toFixed(2))
        settingsValue.light2Intensity = Number(canvas.directionalLight.intensity.toFixed(2))
      }
    })
  light2Folder
    .addColor(settingsValue, 'light2Color')
    .listen()
    .onChange((value: string) => {
      if (canvas.directionalLight) {
        canvas.directionalLight.color.set(value)
        settingsValue.light2Color = value
      }
    })

  const carFolder = canvas.gui.addFolder('Car Settings')
  carFolder
    .add(settingsValue, 'metalness', 0, 1, 0.01)
    .listen()
    .onChange((value: number) => updateMaterialProperties(value, 'metalness'))
  carFolder
    .add(settingsValue, 'roughness', 0, 1, 0.01)
    .listen()
    .onChange((value: number) => updateMaterialProperties(value, 'roughness'))
  carFolder
    .add(settingsValue, 'envMapIntensity', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => updateMaterialProperties(value, 'envMapIntensity'))
  carFolder
    .add(settingsValue, 'carPositionX', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      if (canvas.porsche) {
        canvas.porsche.position.x = value
        settingsValue.carPositionX = value
      }
    })
  carFolder
    .add(settingsValue, 'carPositionY', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      if (canvas.porsche) {
        canvas.porsche.position.y = value
        settingsValue.carPositionY = value
      }
    })
  carFolder
    .add(settingsValue, 'carPositionZ', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      if (canvas.porsche) {
        canvas.porsche.position.z = value
        settingsValue.carPositionZ = value
      }
    })
  carFolder
    .add(settingsValue, 'carRotationX', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      if (canvas.porsche) {
        canvas.porsche.rotation.x = value
        settingsValue.carRotationX = value
      }
    })
  carFolder
    .add(settingsValue, 'carRotationY', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      if (canvas.porsche) {
        canvas.porsche.rotation.y = value
        settingsValue.carRotationY = value
      }
    })
  carFolder
    .add(settingsValue, 'carRotationZ', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      if (canvas.porsche) {
        canvas.porsche.rotation.z = value
        settingsValue.carRotationZ = value
      }
    })
}

export const goToCameraView = (
  canvas: Canvas,
  viewScene: CameraView,
  materialTypeKey: MaterialType,
): void => {
  const { cameraView, materialType } = defaultValue
  const targetPosition = cameraView[viewScene].position
  const targetRotation = cameraView[viewScene].rotation
  const transSec = 1.5
  const easeType = 'expo.inOut'

  gsap.to(canvas.camera.position, {
    duration: transSec,
    ease: easeType,
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z,
    onUpdate: () => {
      if (Number(gsap.getProperty(canvas.camera.position, 'progress')) > 0.5) {
        canvas.porsche?.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
            const material = child.material as THREE.MeshStandardMaterial
            material.metalness = materialType[materialTypeKey].metalness
            material.roughness = materialType[materialTypeKey].roughness
            material.envMapIntensity = materialType[materialTypeKey].envMapIntensity
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

export const initializeScene = (canvas: Canvas, options: { dom: HTMLElement }): void => {
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
  canvas.renderer.outputColorSpace = THREE.SRGBColorSpace
  canvas.container.appendChild(canvas.renderer.domElement)
  canvas.time = new THREE.Clock()
  canvas.elapsedTime = 0
}

export const loadHDR = (canvas: Canvas): void => {
  const rgbeLoader = new RGBELoader(canvas.loadingManager)
  const pmremGenerator = new THREE.PMREMGenerator(canvas.renderer)
  pmremGenerator.compileEquirectangularShader()

  rgbeLoader.load('/models/env.hdr', (texture: THREE.DataTexture) => {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture
    canvas.scene.environment = envMap
    canvas.renderer.toneMappingExposure = 0.6
    texture.dispose()
    pmremGenerator.dispose()
  })
}

export const loadModels = (canvas: Canvas): void => {
  const { porschDefaultValue, materialType } = defaultValue
  canvas.dracoLoader = new DRACOLoader()
  canvas.dracoLoader.setDecoderPath('/draco/')
  canvas.dracoLoader.setDecoderConfig({ type: 'js' })
  canvas.gltfLoader = new GLTFLoader(canvas.loadingManager)
  canvas.gltfLoader.setDRACOLoader(canvas.dracoLoader)

  canvas.gltfLoader.load('/models/porsche.glb', (gltf: GLTF) => {
    canvas.porsche = gltf.scene
    if (canvas.porsche) {
      canvas.porsche.scale.set(1, 1, 1)
      canvas.porsche.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
          const material = child.material as THREE.MeshStandardMaterial & {
            map?: THREE.Texture
          }
          material.metalness = materialType[MaterialType.Exterior].metalness
          material.roughness = materialType[MaterialType.Exterior].roughness
          if (material.map) {
            material.map.minFilter = THREE.LinearFilter
            material.map.generateMipmaps = false
            material.map.needsUpdate = true
          }
          material.needsUpdate = true
        }
      })
      canvas.porsche.position.set(
        porschDefaultValue.position.x,
        porschDefaultValue.position.y,
        porschDefaultValue.position.z,
      )
      canvas.porsche.rotation.y = porschDefaultValue.rotation.y
      canvas.scene.add(canvas.porsche)
    }
  })
}

export const resize = (canvas: Canvas): void => {
  canvas.width = canvas.container!.offsetWidth
  canvas.height = canvas.container!.offsetHeight
  canvas.renderer.setSize(canvas.width, canvas.height)
  canvas.camera.aspect = canvas.width / canvas.height
  canvas.camera.updateProjectionMatrix()
}

export const rotateAroundView = (canvas: Canvas): void => {
  const target = canvas.porsche!.position.clone()
  const deltaX = canvas.camera.position.x - target.x
  const deltaZ = canvas.camera.position.z - target.z
  const currentRadius = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ)
  const startAngle = Math.atan2(deltaZ, deltaX)

  gsap.to(
    { angle: startAngle },
    {
      angle: startAngle + Math.PI * 1.65,
      duration: 4,
      ease: 'power1.out',
      onUpdate: function () {
        const angle = (this.targets()[0] as { angle: number }).angle
        const x = target.x + currentRadius * Math.cos(angle)
        const z = target.z + currentRadius * Math.sin(angle) * 0.9
        canvas.camera.position.set(x, canvas.camera.position.y, z)
        canvas.camera.lookAt(target)
      },
    },
  )
}

export const setupResize = (canvas: Canvas): void => {
  window.addEventListener('resize', () => resize(canvas))
}

export default {
  addLights,
  addObjects,
  assetPaths,
  clearScene,
  cameraController,
  defaultValue,
  debugController,
  goToCameraView,
  initializeScene,
  loadHDR,
  loadModels,
  resize,
  rotateAroundView,
  setupResize,
}
