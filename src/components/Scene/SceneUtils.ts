import * as THREE from 'three'
import { GUI } from 'lil-gui'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import gsap from 'gsap'

export { THREE, DRACOLoader, GLTFLoader, type GLTF, OrbitControls, RGBELoader, GUI, gsap }

// Enum for camera views
export enum CameraViewType {
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
  currentCameraMaterialType?: { cameraViewType: CameraViewType; materialType: MaterialType }
  currentCameraPosition?: THREE.Vector3
}

// Default values with types
export const defaultValue = {
  colorPalatte: {
    primaryColor: 0xfffcef,
    secondaryColor: 0xefebe0,
  },
  materialType: {
    [MaterialType.Interior]: {
      metalness: 0.3,
      roughness: 0.7,
      envMapIntensity: 1.5,
    },
    [MaterialType.Exterior]: {
      metalness: 0.6,
      roughness: 0.2,
      envMapIntensity: 1.2,
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
    [CameraViewType.DriverView]: {
      position: { x: 0.25, y: 0.35, z: 0.75 },
      rotation: { x: -1.5, y: 1.1, z: 1.5 },
    },
    [CameraViewType.SideView]: {
      position: { x: 0.05, y: 0.15, z: 3 },
      rotation: { x: -0.04, y: -0.04, z: 0 },
    },
    [CameraViewType.FrontView]: {
      position: { x: -3.2, y: 0.45, z: 1.15 },
      rotation: { x: -0.82, y: -1.26, z: -0.82 },
    },
    [CameraViewType.BackView]: {
      position: { x: 3.35, y: 0.25, z: 0.5 },
      rotation: { x: -1.5, y: 1.6, z: 1.5 },
    },
    [CameraViewType.TopView]: {
      position: { x: 0.2, y: 3.8, z: 0.8 },
      rotation: { x: -1.5, y: 0, z: 1.6 },
    },
  },
}

const { cameraView, materialType, porschDefaultValue } = defaultValue
const settingsValue = {
  cameraX: cameraView[CameraViewType.SideView].position.x,
  cameraY: cameraView[CameraViewType.SideView].position.y,
  cameraZ: cameraView[CameraViewType.SideView].position.z,
  cameraRotX: cameraView[CameraViewType.SideView].rotation.x,
  cameraRotY: cameraView[CameraViewType.SideView].rotation.y,
  cameraRotZ: cameraView[CameraViewType.SideView].rotation.z,
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
  // Ambient light - softer, less intensity
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
  canvas.scene.add(ambientLight)

  // Main directional light (key light)
  canvas.directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
  canvas.directionalLight.position.set(-0.33, 0.8, 1.8)
  canvas.directionalLight.castShadow = true

  // Create more realistic shadows if needed
  if (canvas.directionalLight.shadow) {
    canvas.directionalLight.shadow.mapSize.width = 1024
    canvas.directionalLight.shadow.mapSize.height = 1024
    canvas.directionalLight.shadow.bias = -0.001
  }
  canvas.scene.add(canvas.directionalLight)

  // Fill light - adds illumination to shadow areas
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.5)
  fillLight.position.set(1, 0.2, -1)
  canvas.scene.add(fillLight)

  // Rim light - highlights edges
  const rimLight = new THREE.DirectionalLight(0xffffee, 0.3)
  rimLight.position.set(0, 1, -1)
  canvas.scene.add(rimLight)
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
  // Make the ground plane receive shadows
  canvas.plane.receiveShadow = true
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
export const updateMaterialProperties = (canvas: Canvas, value: number, property: string): void => {
  canvas.porsche?.traverse((child: THREE.Object3D) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      const material: THREE.MeshStandardMaterial = child.material
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

export const debugController = (canvas: Canvas): void => {
  if (!canvas.gui) {
    canvas.gui = new GUI()
  } else {
    canvas.gui.destroy()
    canvas.gui = new GUI()
  }

  const debugSettingValue = {
    ...settingsValue,
    light2X: canvas.directionalLight?.position.x || 0,
    light2Y: canvas.directionalLight?.position.y || 0,
    light2Z: canvas.directionalLight?.position.z || 0,
    light2Intensity: canvas.directionalLight?.intensity || 0,
    light2Color: `#${canvas.directionalLight?.color.getHexString() || 'ffffff'}`,
  }

  const cameraFolder = canvas.gui.addFolder('Camera')
  cameraFolder
    .add(debugSettingValue, 'cameraX', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      canvas.camera.position.x = Number(value.toFixed(2))
      debugSettingValue.cameraX = Number(canvas.camera.position.x.toFixed(2))
    })
  cameraFolder
    .add(debugSettingValue, 'cameraY', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      canvas.camera.position.y = Number(value.toFixed(2))
      debugSettingValue.cameraY = Number(canvas.camera.position.y.toFixed(2))
    })
  cameraFolder
    .add(debugSettingValue, 'cameraZ', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      canvas.camera.position.z = Number(value.toFixed(2))
      debugSettingValue.cameraZ = Number(canvas.camera.position.z.toFixed(2))
    })
  cameraFolder
    .add(debugSettingValue, 'cameraRotX', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      canvas.camera.rotation.x = Number(value.toFixed(2))
      debugSettingValue.cameraRotX = Number(canvas.camera.rotation.x.toFixed(2))
    })
  cameraFolder
    .add(debugSettingValue, 'cameraRotY', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      canvas.camera.rotation.y = Number(value.toFixed(2))
      debugSettingValue.cameraRotY = Number(canvas.camera.rotation.y.toFixed(2))
    })
  cameraFolder
    .add(debugSettingValue, 'cameraRotZ', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      canvas.camera.rotation.z = Number(value.toFixed(2))
      debugSettingValue.cameraRotZ = Number(canvas.camera.rotation.z.toFixed(2))
    })
  cameraFolder
    .add(
      {
        goToDriverView: () =>
          goToCameraView(canvas, CameraViewType.DriverView, MaterialType.Interior),
      },
      'goToDriverView',
    )
    .name('Go to Driver View')
  cameraFolder
    .add(
      {
        goToSideView: () => goToCameraView(canvas, CameraViewType.SideView, MaterialType.Exterior),
      },
      'goToSideView',
    )
    .name('Go to Side View')
  cameraFolder
    .add(
      {
        goToFrontView: () =>
          goToCameraView(canvas, CameraViewType.FrontView, MaterialType.Exterior),
      },
      'goToFrontView',
    )
    .name('Go to Front View')
  cameraFolder
    .add({ rotateAroundView: () => rotateAroundView(canvas) }, 'rotateAroundView')
    .name('Rotate Around View')
  cameraFolder
    .add(
      {
        goToBackView: () => goToCameraView(canvas, CameraViewType.BackView, MaterialType.Exterior),
      },
      'goToBackView',
    )
    .name('Go To Back View')
  cameraFolder
    .add(
      { goToTopView: () => goToCameraView(canvas, CameraViewType.TopView, MaterialType.Exterior) },
      'goToTopView',
    )
    .name('Go To Top View')

  const light2Folder = canvas.gui.addFolder('Light')
  light2Folder
    .add(debugSettingValue, 'light2X', -20, 20, 0.01)
    .listen()
    .onChange((value: number) => {
      if (canvas.directionalLight) {
        canvas.directionalLight.position.x = Number(value.toFixed(2))
        debugSettingValue.light2X = Number(canvas.directionalLight.position.x.toFixed(2))
      }
    })
  light2Folder
    .add(debugSettingValue, 'light2Y', -20, 20, 0.01)
    .listen()
    .onChange((value: number) => {
      if (canvas.directionalLight) {
        canvas.directionalLight.position.y = Number(value.toFixed(2))
        debugSettingValue.light2Y = Number(canvas.directionalLight.position.y.toFixed(2))
      }
    })
  light2Folder
    .add(debugSettingValue, 'light2Z', -20, 20, 0.01)
    .listen()
    .onChange((value: number) => {
      if (canvas.directionalLight) {
        canvas.directionalLight.position.z = Number(value.toFixed(2))
        debugSettingValue.light2Z = Number(canvas.directionalLight.position.z.toFixed(2))
      }
    })
  light2Folder
    .add(debugSettingValue, 'light2Intensity', 0, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      if (canvas.directionalLight) {
        canvas.directionalLight.intensity = Number(value.toFixed(2))
        debugSettingValue.light2Intensity = Number(canvas.directionalLight.intensity.toFixed(2))
      }
    })
  light2Folder
    .addColor(debugSettingValue, 'light2Color')
    .listen()
    .onChange((value: string) => {
      if (canvas.directionalLight) {
        canvas.directionalLight.color.set(value)
        debugSettingValue.light2Color = value
      }
    })

  const carFolder = canvas.gui.addFolder('Car Settings')
  carFolder
    .add(debugSettingValue, 'metalness', 0, 1, 0.01)
    .listen()
    .onChange((value: number) => updateMaterialProperties(canvas, value, 'metalness'))
  carFolder
    .add(debugSettingValue, 'roughness', 0, 1, 0.01)
    .listen()
    .onChange((value: number) => updateMaterialProperties(canvas, value, 'roughness'))
  carFolder
    .add(debugSettingValue, 'envMapIntensity', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => updateMaterialProperties(canvas, value, 'envMapIntensity'))
  carFolder
    .add(debugSettingValue, 'carPositionX', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      if (canvas.porsche) {
        canvas.porsche.position.x = value
        debugSettingValue.carPositionX = value
      }
    })
  carFolder
    .add(debugSettingValue, 'carPositionY', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      if (canvas.porsche) {
        canvas.porsche.position.y = value
        debugSettingValue.carPositionY = value
      }
    })
  carFolder
    .add(debugSettingValue, 'carPositionZ', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      if (canvas.porsche) {
        canvas.porsche.position.z = value
        debugSettingValue.carPositionZ = value
      }
    })
  carFolder
    .add(debugSettingValue, 'carRotationX', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      if (canvas.porsche) {
        canvas.porsche.rotation.x = value
        debugSettingValue.carRotationX = value
      }
    })
  carFolder
    .add(debugSettingValue, 'carRotationY', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      if (canvas.porsche) {
        canvas.porsche.rotation.y = value
        debugSettingValue.carRotationY = value
      }
    })
  carFolder
    .add(debugSettingValue, 'carRotationZ', -10, 10, 0.01)
    .listen()
    .onChange((value: number) => {
      if (canvas.porsche) {
        canvas.porsche.rotation.z = value
        debugSettingValue.carRotationZ = value
      }
    })
}

export const goToCameraView = (
  canvas: Canvas,
  viewType: CameraViewType,
  materialTypeKey: MaterialType,
): void => {
  const { cameraView, materialType } = defaultValue
  const targetPosition = cameraView[viewType].position
  const targetRotation = cameraView[viewType].rotation
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
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            const material: THREE.MeshStandardMaterial = child.material
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

  canvas.currentCameraPosition = new THREE.Vector3(
    cameraView[viewType].position.x,
    cameraView[viewType].position.y,
    cameraView[viewType].position.z,
  )
  canvas.currentCameraMaterialType = {
    cameraViewType: viewType,
    materialType: materialTypeKey,
  }

  settingsValue.cameraX = cameraView[viewType].position.x
  settingsValue.cameraY = cameraView[viewType].position.y
  settingsValue.cameraZ = cameraView[viewType].position.z
  settingsValue.cameraRotX = cameraView[viewType].rotation.x
  settingsValue.cameraRotY = cameraView[viewType].rotation.y
  settingsValue.cameraRotZ = cameraView[viewType].rotation.z

  // debugController(canvas)
}

export const initializeScene = (canvas: Canvas, options: { dom: HTMLElement }): void => {
  const { colorPalatte } = defaultValue
  canvas.scene = new THREE.Scene()
  canvas.container = options.dom
  canvas.width = canvas.container.offsetWidth
  canvas.height = canvas.container.offsetHeight
  canvas.renderer = new THREE.WebGLRenderer({
    antialias: true,
  })
  canvas.renderer.setClearColor(0xececec, 1)
  canvas.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Limit pixel ratio for performance
  canvas.renderer.setSize(canvas.width, canvas.height)
  canvas.renderer.setClearColor(colorPalatte.primaryColor, 1)
  // Use a less aggressive tone mapping
  canvas.renderer.toneMapping = THREE.LinearToneMapping
  canvas.renderer.outputColorSpace = THREE.SRGBColorSpace
  // Enable shadows for more realism
  canvas.renderer.shadowMap.enabled = true
  canvas.renderer.shadowMap.type = THREE.PCFSoftShadowMap
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
    // Adjust tone mapping exposure for more balanced lighting
    canvas.renderer.toneMappingExposure = 0.8
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
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          const material: THREE.MeshStandardMaterial & { map: THREE.Texture | null } =
            child.material
          material.metalness = materialType[MaterialType.Exterior].metalness
          material.roughness = materialType[MaterialType.Exterior].roughness
          if (material.map) {
            material.map.minFilter = THREE.LinearFilter
            material.map.generateMipmaps = false
            material.map.needsUpdate = true
          }
          // Enable shadow casting for each mesh
          child.castShadow = true
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
        const angle: number = this.targets()[0].angle
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

export const setupVisibilityObserver = (
  canvas: Canvas,
  renderFunction: () => void,
  options: { debug?: boolean; forceRender?: boolean; ignoreOverlap?: boolean } = {},
): (() => void) => {
  let isVisible = true
  let animationFrameId: number | null = null
  let lastScrollPosition = window.scrollY
  const { debug = false, forceRender = false, ignoreOverlap = true } = options

  // Create intersection observer to check if the canvas element is in viewport
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      const wasVisible = isVisible
      isVisible = entry.isIntersecting

      // Start or stop rendering based on visibility change
      if (isVisible && !wasVisible) {
        if (debug) console.log(entry.target.id, `entered viewport`)
        startRenderLoop()
      } else if (!isVisible && wasVisible) {
        if (debug) console.log(entry.target.id, `left viewport`)
        stopRenderLoop()
      }
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.01,
    },
  )

  // Start observing the canvas container
  if (canvas.container) {
    observer.observe(canvas.container)
  }

  const checkIfCovered = (): boolean => {
    if (forceRender || ignoreOverlap) return false

    if (!canvas.container) return false

    const rect = canvas.container.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return true

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const elementAtCenter = document.elementFromPoint(centerX, centerY)

    const canvasElement = canvas.renderer.domElement
    if (elementAtCenter === canvasElement) {
      return false
    }

    if (canvas.container.contains(elementAtCenter)) {
      return false
    }

    if (debug) console.log('Canvas is covered by another element:', elementAtCenter)
    return true
  }

  // Optimized render loop that checks visibility conditions
  const optimizedRenderLoop = () => {
    animationFrameId = requestAnimationFrame(optimizedRenderLoop)

    if (isVisible && !checkIfCovered()) {
      renderFunction()
    }
  }

  const startRenderLoop = () => {
    if (animationFrameId === null) {
      if (debug) console.log('Starting render loop')
      animationFrameId = requestAnimationFrame(optimizedRenderLoop)
    }
  }

  const stopRenderLoop = () => {
    if (animationFrameId !== null) {
      if (debug) console.log('Stopping render loop')
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }

  let scrollTimeout: number | null = null
  const handleScroll = () => {
    if (forceRender || ignoreOverlap) return

    if (Math.abs(window.scrollY - lastScrollPosition) < 50) return

    lastScrollPosition = window.scrollY

    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }

    scrollTimeout = window.setTimeout(() => {
      if (isVisible) {
        const isCovered = checkIfCovered()
        if (isCovered && animationFrameId !== null) {
          if (debug) console.log('Canvas became covered during scroll')
          stopRenderLoop()
        } else if (!isCovered && animationFrameId === null) {
          if (debug) console.log('Canvas became visible during scroll')
          startRenderLoop()
        }
      }
    }, 100)
  }

  window.addEventListener('scroll', handleScroll, { passive: true })

  startRenderLoop()

  return () => {
    stopRenderLoop()
    if (canvas.container) {
      observer.unobserve(canvas.container)
    }
    window.removeEventListener('scroll', handleScroll)
  }
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
  setupVisibilityObserver,
  updateMaterialProperties,
}
