import sceneUtils, {
  type Canvas,
  THREE,
  gsap,
  DRACOLoader,
  GLTFLoader,
  OrbitControls,
  GUI,
  CameraView,
  MaterialType,
} from './SceneUtils' // Adjust path as needed
import { Tween, Easing, Group as TweenGroup } from 'three/examples/jsm/libs/tween.module.js'

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

  // Custom properties
  private tweenGroup: TweenGroup
  private initialCameraZ: number
  private introTween?: Tween<THREE.Vector3>
  private tweenCover?: Tween<{ y: number }>
  private listener?: THREE.AudioListener
  private sound?: THREE.Audio
  private audioLoader?: THREE.AudioLoader
  private textures: { [key: string]: THREE.Texture } = {}
  private textureLoader?: THREE.TextureLoader

  constructor(options: { dom: HTMLElement }) {
    sceneUtils.initializeScene(this, options)
    sceneUtils.cameraController(this, false)
    this.tweenGroup = new TweenGroup()
    this.initialCameraZ = 0

    this.loadAssets()
    this.loadAudios()
    sceneUtils.addObjects(this)
    sceneUtils.addLights(this)
    sceneUtils.setupResize(this)
    sceneUtils.resize(this)
    this.render()
  }

  onScrollEvents(scrollAmount: number, maxScroll: number): void {
    // Uncomment and type if needed
    // if (!this.porsche) {
    //   console.warn('Porsche model is not loaded yet.');
    //   return;
    // }
    // const normalizedScroll = Math.min(1, Math.max(0, scrollAmount / maxScroll));
    // const rotationAngle = normalizedScroll * Math.PI * 2; // Full circle (2π radians)
    // const radius = 10; // Adjust the radius of the camera's orbit as needed
    // const cameraX =
    //   sceneUtils.defaultValue.porschDefaultValue.position.x + radius * Math.sin(rotationAngle);
    // const cameraZ =
    //   sceneUtils.defaultValue.porschDefaultValue.position.z + radius * Math.cos(rotationAngle);
    // gsap.to(this.camera.position, {
    //   x: cameraX,
    //   z: cameraZ,
    //   duration: 0.2,
    //   ease: 'power1.out',
    //   onUpdate: () => {
    //     this.camera.lookAt(this.porsche.position);
    //   },
    // });
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
      sceneUtils.goToCameraView(this, CameraView.FrontView, MaterialType.Exterior)
      this.startAudio()
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
          sceneUtils.goToCameraView(this, CameraView.SideView, MaterialType.Exterior)
          headerContainer.classList.add('show')
          mainContainer.classList.add('show')
          setTimeout(() => {
            console.log('porsche info', this.porsche)
            document.body.style.overflowY = 'auto'
          }, 5000)
        })
      this.tweenGroup.add(this.tweenCover)
    }
  }

  render(): void {
    this.elapsedTime = this.time.getElapsedTime()
    if (this.controls) {
      this.controls.update()
    }
    if (this.tweenGroup) {
      this.tweenGroup.update()
    }
    requestAnimationFrame(this.render.bind(this))
    this.renderer.render(this.scene, this.camera)
  }
}

export default HeroCanvas
