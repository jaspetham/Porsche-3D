import sceneUtils, {
  type Canvas,
  gsap,
  THREE,
  DRACOLoader,
  GLTFLoader,
  GUI,
  OrbitControls,
} from './SceneUtils'

class AboutCanvas implements Canvas {
  // Required properties from Canvas interface
  scene!: THREE.Scene
  renderer!: THREE.WebGLRenderer
  camera!: THREE.PerspectiveCamera

  // Optional properties from Canvas interface (with definite assignment assertion where initialized)
  container?: HTMLElement
  width?: number
  height?: number
  cameraGroup1?: THREE.Group
  controls?: OrbitControls // Changed to THREE.OrbitControls for type safety
  time!: THREE.Clock
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

  // Custom properties specific to AboutCanvas
  private radius: number
  private speed: number
  private angle?: number // Added for render method

  constructor(options: { dom: HTMLElement }) {
    sceneUtils.initializeScene(this, options)
    sceneUtils.cameraController(this, false)
    this.radius = 3
    this.speed = 0.04
    sceneUtils.loadHDR(this)
    sceneUtils.loadModels(this)
    sceneUtils.addObjects(this)
    sceneUtils.addLights(this)
    sceneUtils.setupResize(this)
    sceneUtils.resize(this)

    this.render()
  }

  render(): void {
    this.elapsedTime = this.time.getElapsedTime()
    this.angle = this.elapsedTime * this.speed

    if (this.controls) {
      this.controls.update()
    }

    // GSAP smooth position update
    gsap.to(this.camera.position, {
      x: Math.cos(this.angle) * this.radius,
      z: Math.sin(this.angle) * this.radius + 0.5,
      y: 0.2,
      duration: 0.5, // Adjust for responsiveness
      ease: 'power1.out',
    })
    this.camera.lookAt(0.5, 0, 1)
    requestAnimationFrame(this.render.bind(this))
    this.renderer.render(this.scene, this.camera)
  }
}

export default AboutCanvas
