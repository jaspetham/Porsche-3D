import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Tween, Easing, Group } from 'three/examples/jsm/libs/tween.module.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import vertex from '@/assets/shaders/vertex.glsl'
import fragment from '@/assets/shaders/fragment.glsl'
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
    this.camera.position.set(0, 0, 1)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.update()
    this.controls.enableDamping = true
    this.time = new THREE.Clock()
    this.elapsedTime = 0
    this.previousTime = 0
    this.tweenGroup = new Group()
    this.isPlaying = true
    this.loadModels()
    this.loadAudios()
    // this.addObjects()
    this.addLights()
    this.resize()
    this.render()
    this.setupResize()
    // this.settings()
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
    this.audioLoader.load('audio/porsche_updated.mp3', (buffer) => {
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
      this.porsche.position.set(0, -0.6, -3)
      this.porsche.rotation.y = 270 * (Math.PI / 180)
      this.scene.add(this.porsche)
      this.clearScene()
    })
  }
  startAudio() {
    if (!this.sound.isPlaying) {
      // this.sound.play()
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
      cameraX: this.camera.position.x,
      cameraY: this.camera.position.y,
      cameraZ: this.camera.position.z,
      light1X: this.light1.position.x,
      light1Y: this.light1.position.y,
      light1Z: this.light1.position.z,
      light2X: this.light2.position.x,
      light2Y: this.light2.position.y,
      light2Z: this.light2.position.z,
      // modelPositionX: this.porsche ? this.porsche.position.x : 0,
      // modelPositionY: this.porsche ? this.porsche.position.y : -0.6,
      // modelPositionZ: this.porsche ? this.porsche.position.z : -3,
      // modelRotationX: this.porsche ? this.porsche.rotation.x : 0,
      // modelRotationY: this.porsche ? this.porsche.rotation.y : 270 * (Math.PI / 180),
      // modelRotationZ: this.porsche ? this.porsche.rotation.z : 0,
    }

    this.gui = new dat.GUI()

    // camera position
    this.gui.add(this.settings, 'cameraX', -10, 10, 0.01).onChange((value) => {
      this.camera.position.x = parseFloat(value.toFixed(2))
      this.settings.cameraX = this.camera.position.x.toFixed(2)
    })

    this.gui.add(this.settings, 'cameraY', -10, 10, 0.01).onChange((value) => {
      this.camera.position.y = parseFloat(value.toFixed(2))
      this.settings.cameraY = this.camera.position.y.toFixed(2)
    })

    this.gui.add(this.settings, 'cameraZ', -10, 10, 0.01).onChange((value) => {
      this.camera.position.z = parseFloat(value.toFixed(2))
      this.settings.cameraZ = this.camera.position.z.toFixed(2)
    })

    // light 1 position
    this.gui.add(this.settings, 'light1X', -10, 10, 0.01).onChange((value) => {
      this.light1.position.z = parseFloat(value.toFixed(2))
      this.settings.light1X = this.light1.position.x.toFixed(2)
    })
    this.gui.add(this.settings, 'light1Y', -10, 10, 0.01).onChange((value) => {
      this.light1.position.z = parseFloat(value.toFixed(2))
      this.settings.light1Y = this.light1.position.y.toFixed(2)
    })
    this.gui.add(this.settings, 'light1Z', -10, 10, 0.01).onChange((value) => {
      this.light1.position.z = parseFloat(value.toFixed(2))
      this.settings.light1Z = this.light1.position.z.toFixed(2)
    })

    // light 2 pos
    this.gui.add(this.settings, 'light2X', -10, 10, 0.01).onChange((value) => {
      this.light2.position.z = parseFloat(value.toFixed(2))
      this.settings.light2X = this.light2.position.x.toFixed(2)
    })
    this.gui.add(this.settings, 'light2Y', -10, 10, 0.01).onChange((value) => {
      this.light2.position.z = parseFloat(value.toFixed(2))
      this.settings.light2X = this.light2.position.y.toFixed(2)
    })
    this.gui.add(this.settings, 'light2Z', -10, 10, 0.01).onChange((value) => {
      this.light2.position.z = parseFloat(value.toFixed(2))
      this.settings.light2X = this.light2.position.z.toFixed(2)
    })

    // model position
    // this.gui.add(this.settings, 'modelPositionX', -10, 10, 0.01).onChange((value) => {
    //   if (this.porsche) {
    //     this.porsche.position.x = parseFloat(value.toFixed(2))
    //     this.settings.modelPositionX = this.porsche.position.x.toFixed(2)
    //   }
    // })

    // this.gui.add(this.settings, 'modelPositionY', -10, 10, 0.01).onChange((value) => {
    //   if (this.porsche) {
    //     this.porsche.position.y = parseFloat(value.toFixed(2))
    //     this.settings.modelPositionY = this.porsche.position.y.toFixed(2)
    //   }
    // })

    // this.gui.add(this.settings, 'modelPositionZ', -10, 10, 0.01).onChange((value) => {
    //   if (this.porsche) {
    //     this.porsche.position.z = parseFloat(value.toFixed(2))
    //     this.settings.modelPositionZ = this.porsche.position.z.toFixed(2)
    //   }
    // })

    // // model rotation
    // this.gui
    //   .add(this.settings, 'modelRotationX', -Math.PI, Math.PI, 0.01)
    //   .onChange((value) => {
    //     if (this.porsche) {
    //       this.porsche.rotation.x = parseFloat(value.toFixed(2))
    //     }
    //   })
    //   .listen()

    // this.gui
    //   .add(this.settings, 'modelRotationY', -Math.PI, Math.PI, 0.01)
    //   .onChange((value) => {
    //     if (this.porsche) {
    //       this.porsche.rotation.y = parseFloat(value.toFixed(2))
    //     }
    //   })
    //   .listen()

    // this.gui
    //   .add(this.settings, 'modelRotationZ', -Math.PI, Math.PI, 0.01)
    //   .onChange((value) => {
    //     if (this.porsche) {
    //       this.porsche.rotation.z = parseFloat(value.toFixed(2))
    //     }
    //   })
    //   .listen()
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
    this.light1 = new THREE.AmbientLight(0xffffff, 0.5)
    this.scene.add(this.light1)

    this.light2 = new THREE.DirectionalLight(0xffffff, 0.5)
    this.light2.position.set(0.5, 0, 0.866)
    this.scene.add(this.light2)
  }

  addObjects() {
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector4() },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    })

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1)
    this.plane = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.plane)
  }

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
    this.controls.update()
    if (this.tweenGroup) {
      this.tweenGroup.update()
    }
    requestAnimationFrame(this.render.bind(this))
    this.renderer.render(this.scene, this.camera)
  }
}

export default Canvas
