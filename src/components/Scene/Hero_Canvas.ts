import sceneUtils, {
  type Canvas,
  THREE,
  gsap,
  DRACOLoader,
  GLTFLoader,
  OrbitControls,
  GUI,
  CameraViewType,
  MaterialType,
  defaultValue,
} from './SceneUtils' // Adjust path as needed
import { Tween, Easing, Group as TweenGroup } from 'three/examples/jsm/libs/tween.module.js'
import { ref } from 'vue'

class HeroCanvas implements Canvas {
  // Required properties from Canvas interface
  scene!: THREE.Scene
  renderer!: THREE.WebGLRenderer
  camera!: THREE.PerspectiveCamera

  // Optional properties from Canvas interface
  container?: HTMLElement
  width?: number
  height?: number
  cameraGroup1?: THREE.Group
  controls?: OrbitControls
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
  currentCameraPosition?: THREE.Vector3
  currentCameraMaterialType?: { cameraViewType: CameraViewType; materialType: MaterialType }

  // Custom properties
  private tweenGroup: TweenGroup
  private introTween?: Tween<THREE.Vector3>
  private tweenCover?: Tween<{ y: number }>
  private listener?: THREE.AudioListener
  private sound?: THREE.Audio
  private audioLoader?: THREE.AudioLoader
  private textures: { [key: string]: THREE.Texture } = {}
  private textureLoader?: THREE.TextureLoader
  public isLoaded = ref(false)
  private updateHelpers?: () => void
  private cleanupVisibilityObserver: (() => void) | null = null

  constructor(options: { dom: HTMLElement }) {
    sceneUtils.initializeScene(this, options)
    sceneUtils.cameraController(this, false)
    this.tweenGroup = new TweenGroup()

    this.loadAssets()
    this.loadAudios()
    sceneUtils.addObjects(this)
    sceneUtils.addLights(this)
    sceneUtils.setupResize(this)
    sceneUtils.resize(this)
    // sceneUtils.debugController(this)

    // Replace direct render call with visibility-aware rendering
    this.setupOptimizedRendering()
  }

  setupOptimizedRendering(): void {
    // Create a standalone render function that doesn't self-request frames
    const renderFrame = () => {
      // Update time
      this.elapsedTime = this.time.getElapsedTime()

      // Update controls if available
      if (this.controls) {
        this.controls.update()
      }

      // Update tweens
      if (this.tweenGroup) {
        this.tweenGroup.update()
      }

      // Update debug helpers
      if (this.updateHelpers) {
        this.updateHelpers()
      }

      // Make sure the renderer actually renders the scene
      if (this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera)
      }
    }

    // Set up visibility observer that manages the animation frame requests
    // Use debug mode and ignore overlap since this is a fixed position background canvas
    this.cleanupVisibilityObserver = sceneUtils.setupVisibilityObserver(this, renderFrame, {
      debug: true,
      forceRender: false,
      ignoreOverlap: false, // This is a fixed background element, so ignore elements covering it
    })
  }

  // Add method to toggle forced rendering
  toggleForceRender(force: boolean): void {
    // Replace the current visibility observer with a new one using the updated setting
    if (this.cleanupVisibilityObserver) {
      this.cleanupVisibilityObserver()
    }

    // Create a standalone render function that doesn't self-request frames
    const renderFrame = () => {
      this.elapsedTime = this.time.getElapsedTime()
      if (this.controls) {
        this.controls.update()
      }
      if (this.tweenGroup) {
        this.tweenGroup.update()
      }
      if (this.updateHelpers) {
        this.updateHelpers()
      }
      if (this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera)
      }
    }

    this.cleanupVisibilityObserver = sceneUtils.setupVisibilityObserver(this, renderFrame, {
      debug: true,
      forceRender: force,
      ignoreOverlap: true, // Always ignore overlap for fixed background canvases
    })

    console.log(`Hero Canvas: Force render ${force ? 'enabled' : 'disabled'}`)
  }

  cleanup(): void {
    // Clean up the visibility observer when component is unmounted
    if (this.cleanupVisibilityObserver) {
      this.cleanupVisibilityObserver()
      this.cleanupVisibilityObserver = null
    }

    // Clean up other resources
    if (this.sound && this.sound.isPlaying) {
      this.sound.stop()
    }

    if (this.renderer) {
      this.renderer.dispose()
    }

    // Remove event listeners and free memory from textures
    Object.values(this.textures).forEach((texture) => texture.dispose())
  }

  onScrollEvents(scrollAmount: number, maxScroll: number): void {
    if (!this.porsche || !this.currentCameraPosition) {
      console.warn('Porsche model is not loaded yet.')
      return
    }

    const position = this.currentCameraPosition
    const strength = 1.5
    const delta = (scrollAmount / maxScroll) * strength
    const viewType = this.currentCameraMaterialType?.cameraViewType

    const movementPosMap: Record<CameraViewType | 'default', () => Partial<typeof position>> = {
      [CameraViewType.FrontView]: () => ({ x: position.x + delta }),
      [CameraViewType.DriverView]: () => ({ x: position.x - delta }),
      [CameraViewType.BackView]: () => ({ x: position.x - delta }),
      [CameraViewType.SideView]: () => ({ z: position.z - delta }),
      [CameraViewType.TopView]: () => ({ y: position.y - delta }),
      default: () => ({ z: position.z + delta }),
    }

    const movementPos = (movementPosMap[viewType!] || movementPosMap.default)()

    gsap.to(this.camera.position, {
      ...movementPos,
      duration: 0.2,
      ease: 'power1.out',
    })
  }

  introAnimation(): void {
    this.introTween = new Tween(this.camera.position.set(0, 4, 2.7))
      .to({ x: 0, y: 2.4, z: 8.8 }, 3500)
      .easing(Easing.Quadratic.InOut)
      .start()
      .onComplete(() => {
        this.introTween = undefined
      })
    this.tweenGroup.add(this.introTween)
  }

  loadAudios(): void {
    this.listener = new THREE.AudioListener()
    this.camera.add(this.listener)
    this.sound = new THREE.Audio(this.listener)
    this.audioLoader = new THREE.AudioLoader(this.loadingManager)
    this.audioLoader.load('audio/porsche_updated.mp3', (buffer: AudioBuffer) => {
      if (this.sound) {
        this.sound.setBuffer(buffer)
      }
    })
  }

  loadAssets(): void {
    this.loadingManager = new THREE.LoadingManager()
    const loadingValue = document.getElementById('loading-value') as HTMLElement
    const loadingWrapper = document.getElementById('loading-wrapper') as HTMLElement

    this.loadingManager.onStart = () => {
      loadingValue.innerHTML = '0%'
    }

    sceneUtils.loadHDR(this)
    sceneUtils.loadModels(this)

    let maxProgress = 0
    this.loadingManager.onProgress = (_url: string, itemsLoaded: number, itemsTotal: number) => {
      let progress = (itemsLoaded / itemsTotal) * 100
      if (progress < maxProgress) {
        progress = maxProgress
      } else {
        maxProgress = progress
      }
      loadingValue.innerHTML = `${progress.toFixed(0)}%`
    }

    this.loadingManager.onLoad = () => {
      loadingWrapper.classList.add('loaded')
      sceneUtils.goToCameraView(this, CameraViewType.FrontView, MaterialType.Exterior)
      this.camera.position.set(
        defaultValue.cameraView[CameraViewType.FrontView].position.x,
        defaultValue.cameraView[CameraViewType.FrontView].position.y,
        defaultValue.cameraView[CameraViewType.FrontView].position.z,
      )
      window.scroll(0, 0)
    }

    this.textures = {}
    this.textureLoader = new THREE.TextureLoader(this.loadingManager)

    sceneUtils.assetPaths.forEach((path: string) => {
      const fileName = path.split('/').pop() as string
      if (this.textureLoader) {
        this.textures[fileName] = this.textureLoader.load(path)
      } else {
        console.warn('TextureLoader is not initialized.')
      }
    })
  }

  startAudio(): void {
    if (this.sound && !this.sound.isPlaying) {
      this.sound.play()
      const yPosition = { y: 10 }
      const transitionDelay = 2000
      const loadingCover = document.getElementById('loading-text-intro') as HTMLElement
      const mainContainer = document.getElementById('main-container') as HTMLElement
      const headerContainer = document.getElementById('header') as HTMLElement

      this.tweenCover = new Tween(yPosition)
        .to({ y: 100 }, 900)
        .delay(transitionDelay)
        .easing(Easing.Quadratic.InOut)
        .start()
        .onUpdate(() => {
          loadingCover.style.setProperty('transform', `translate(0, ${yPosition.y}%)`)
        })
        .onComplete(() => {
          loadingCover.parentNode?.removeChild(loadingCover)
          sceneUtils.goToCameraView(this, CameraViewType.SideView, MaterialType.Exterior)
          headerContainer.classList.add('show')
          mainContainer.classList.add('show')
          this.isLoaded.value = true
          setTimeout(() => {
            document.body.style.overflowY = 'auto'
          }, 2000)
        })
      this.tweenGroup.add(this.tweenCover)
    }
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
      this.porsche.traverse((child: THREE.Object3D) => {
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
}

export default HeroCanvas
