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
  private updateHelpers?: () => void

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

  setShadowQuality(quality: 'low' | 'medium' | 'high' | 'off'): void {
    if (!this.renderer || !this.porsche || !this.directionalLight) return

    // Toggle shadow rendering
    this.renderer.shadowMap.enabled = quality !== 'off'

    // Configure shadow map size based on quality
    if (this.directionalLight.shadow) {
      switch (quality) {
        case 'high':
          this.directionalLight.shadow.mapSize.width = 2048
          this.directionalLight.shadow.mapSize.height = 2048
          this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
          break
        case 'medium':
          this.directionalLight.shadow.mapSize.width = 1024
          this.directionalLight.shadow.mapSize.height = 1024
          this.renderer.shadowMap.type = THREE.PCFShadowMap
          break
        case 'low':
          this.directionalLight.shadow.mapSize.width = 512
          this.directionalLight.shadow.mapSize.height = 512
          this.renderer.shadowMap.type = THREE.BasicShadowMap
          break
        case 'off':
          // Shadows already disabled above
          break
      }

      // Update shadow bias to reduce acne/artifacts
      this.directionalLight.shadow.bias = quality === 'high' ? -0.0005 : -0.001

      // Apply shadow settings to the model
      this.porsche?.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = quality !== 'off'
        }
      })
    }
  }

  addDebugHelpers(): void {
    if (!this.scene || !this.directionalLight) return

    // Add a camera helper
    const shadowCameraHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera)
    this.scene.add(shadowCameraHelper)

    // Add a directional light helper
    const directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight, 1)
    this.scene.add(directionalLightHelper)

    // Update helpers in the render loop
    this.updateHelpers = () => {
      shadowCameraHelper.update()
      directionalLightHelper.update()
    }
  }

  render(): void {
    this.elapsedTime = this.time.getElapsedTime()
    this.angle = this.elapsedTime * this.speed

    if (this.controls) {
      this.controls.update()
    }

    if (this.updateHelpers) {
      this.updateHelpers()
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
