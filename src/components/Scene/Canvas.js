import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Tween, Easing, Group } from 'three/examples/jsm/libs/tween.module.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as dat from 'lil-gui'
// import gsap from 'gsap'
class Canvas {
  constructor(options) {
    this.scene = new THREE.Scene()
    this.container = options.dom
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(0x000000, 1)

    this.container.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000,
    )

    this.camera.position.set(0, 0, 2)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.time = new THREE.Clock()
    this.elapsedTime = 0
    this.previousTime = 0
    this.tweenGroup = new Group()
    this.isPlaying = true
    this.loadModels()
    this.loadAudios()
    this.addObjects()
    this.addLights()
    this.resize()
    this.render()
    this.setupResize()
    // this.settings();
  }

  clearScene() {
    this.renderer.renderLists.dispose()
  }

  introAnimation() {
    this.introTween = new Tween(this.camera.position.set(0, 4, 2.7))
      .to({ x: 0, y: 2.4, z: 8.8 }, 3500)
      .easing(Easing.Quadratic.InOut)
      .start()
      .onComplete(function () {
        Tween.remove(this)
      })
  }

  loadAudios() {
    this.listener = new THREE.AudioListener()
    this.camera.add(this.listener)
    this.sound = new THREE.Audio(this.listener)
    this.audioLoader = new THREE.AudioLoader()
    this.audioLoader.load('audio/porsche.mp3', (buffer) => {
      this.sound.setBuffer(buffer)
    })
  }
  loadModels() {
    const loadingManager = new THREE.LoadingManager()
    const startButton = document.getElementById('start-button')
    const loadingValue = document.getElementById('loading-value')
    loadingManager.onLoad = () => {
      const progress = { value: 0 }
      this.tween = new Tween(progress)
        .to({ value: 100 }, 900)
        .easing(Easing.Quadratic.InOut)
        .start()
        .onUpdate(() => {
          loadingValue.innerHTML = `${progress.value.toFixed()}%`
        })
        .onComplete(() => {
          startButton.style.display = 'block'
          loadingValue.parentNode.removeChild(loadingValue)
        })
      this.tweenGroup.add(this.tween)
      window.scroll(0, 0)
    }

    this.dracoLoader = new DRACOLoader()
    this.dracoLoader.setDecoderPath('/draco/')
    this.dracoLoader.setDecoderConfig({ type: 'js' })
    this.gltfLoader = new GLTFLoader(loadingManager)
    this.gltfLoader.setDRACOLoader(this.dracoLoader)

    this.gltfLoader.load('/models/porsche.glb', (gltf) => {
      this.porsche = gltf.scene
      console.log(this.porsche.position)
      this.scene.add(this.porsche)
      this.clearScene()
    })
  }
  startAudio() {
    if (!this.sound.isPlaying) {
      this.sound.play()
      const yPosition = { y: 10 }
      const loadingCover = document.getElementById('loading-text-intro')
      this.tweenCover = new Tween(yPosition)
        .to({ y: 100 }, 900)
        .delay(2000)
        .easing(Easing.Quadratic.InOut)
        .start()
        .onUpdate(function () {
          loadingCover.style.setProperty('transform', `translate( 0, ${yPosition.y}%)`)
        })
        .onComplete(function () {
          loadingCover.parentNode.removeChild(document.getElementById('loading-text-intro'))
        })
      this.tweenGroup.add(this.tweenCover)
    }
  }
  settings() {
    this.settings = {
      progress: 0,
    }
    this.gui = new dat.GUI()
    this.gui.add(this.settings, 'progress', 0, 1, 0.01)
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this))
  }

  resize() {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  addLights() {
    const light1 = new THREE.AmbientLight(0xffffff, 0.5)
    this.scene.add(light1)

    const light2 = new THREE.DirectionalLight(0xffffff, 0.5)
    light2.position.set(0.5, 0, 0.866)
    this.scene.add(light2)
  }

  addObjects() {}

  stop() {
    this.isPlaying = false
  }

  play() {
    if (!this.isPlaying) {
      this.render()
      this.isPlaying = true
    }
  }

  render() {
    if (!this.isPlaying) return
    this.elapsedTime = this.time.getElapsedTime()
    // const deltaTime = this.elapsedTime - this.previousTime
    // this.previousTime = this.elapsedTime
    if (this.tweenGroup) {
      this.tweenGroup.update()
    }
    requestAnimationFrame(this.render.bind(this))
    this.renderer.render(this.scene, this.camera)
  }
}

export default Canvas
