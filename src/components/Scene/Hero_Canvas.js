import * as THREE from 'three'
import * as dat from 'lil-gui'
import { Tween, Easing, Group } from 'three/examples/jsm/libs/tween.module.js'
import sceneUtils from './SceneUtils'
import gsap from 'gsap'
class HeroCanvas {
  constructor(options) {
    this.scene = new THREE.Scene()
    this.container = options.dom
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(0xececec, 1)
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.container.appendChild(this.renderer.domElement)

    this.time = new THREE.Clock()
    this.elapsedTime = 0
    this.previousTime = 0
    this.tweenGroup = new Group()
    this.initialCameraZ = 0

    sceneUtils.cameraController(this)
    this.loadAssets()
    this.loadAudios()
    sceneUtils.addObjects(this)
    sceneUtils.addLights(this)
    sceneUtils.setupResize(this)
    sceneUtils.resize(this)
    this.render()
    // this.settings()
  }

  onScrollEvents(scrollAmount, maxScroll) {
    if (this.initialCameraZ > 0) {
      const movementRange = 4.5
      const normalizedScroll = Math.min(1, Math.max(0, scrollAmount / maxScroll))
      let newCameraZ = this.initialCameraZ - normalizedScroll * movementRange
      const targetCameraZ = Math.min(this.initialCameraZ, newCameraZ)
      gsap.to(this.camera.position, {
        z: targetCameraZ,
        duration: 0.2,
        ease: 'power1.out',
      })
    }
  }
  clearScene() {
    this.renderer.renderLists.dispose()
  }
  introAnimation() {
    this.introTween = new Tween.Tween(this.camera.position.set(0, 4, 2.7))
      .to({ x: 0, y: 2.4, z: 8.8 }, 3500)
      .easing(Easing.Quadratic.InOut)
      .start()
      .onComplete(function () {
        this.introTween = null
      })
    this.tweenGroup.add(this.introTween)
  }
  loadAudios() {
    this.listener = new THREE.AudioListener()
    this.camera.add(this.listener)
    this.sound = new THREE.Audio(this.listener)
    this.audioLoader = new THREE.AudioLoader(this.loadingManager)
    this.audioLoader.load('audio/porsche_updated.mp3', (buffer) => {
      this.sound.setBuffer(buffer)
    })
  }
  loadAssets() {
    this.loadingManager = new THREE.LoadingManager()
    const loadingValue = document.getElementById('loading-value')
    const loadingWrapper = document.getElementById('loading-wrapper')
    this.loadingManager.onStart = () => {
      loadingValue.innerHTML = '0%'
    }
    sceneUtils.loadHDR(this)
    sceneUtils.loadModels(this)
    let maxProgress = 0
    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      // const progress = (itemsLoaded / itemsTotal) * 100
      let progress = (itemsLoaded / itemsTotal) * 100

      // Ensure progress never decreases
      if (progress < maxProgress) {
        progress = maxProgress
      } else {
        maxProgress = progress
      }
      loadingValue.innerHTML = `${progress.toFixed(0)}%`
    }

    this.loadingManager.onLoad = () => {
      // Hide loading value and show start button
      loadingWrapper.classList.add('loaded')
      // Proceed to camera view
      sceneUtils.goToCameraView(this, 'frontView', 'exterior')
      window.scroll(0, 0)
    }
    this.textures = {}
    const assetPaths = [
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
      '/assets/about/passion/passion-bg.webp',
      '/assets/about/passion/passion-1.webp',
      '/assets/about/passion/passion-2.webp',
      '/assets/about/passion/passion-3.webp',
    ]

    this.textureLoader = new THREE.TextureLoader(this.loadingManager)

    assetPaths.forEach((path) => {
      const fileName = path.split('/').pop()
      this.textures[fileName] = this.textureLoader.load(path)
    })
  }

  startAudio() {
    if (!this.sound.isPlaying) {
      this.sound.play()
      let that = this
      const yPosition = { y: 10 }
      const transitionDelay = 2000
      const loadingCover = document.getElementById('loading-text-intro')
      const mainContainer = document.getElementById('main-container')
      const headerContainer = document.getElementById('header')
      this.tweenCover = new Tween(yPosition)
        .to({ y: 100 }, 900)
        .delay(transitionDelay)
        .easing(Easing.Quadratic.InOut)
        .start()
        .onUpdate(function () {
          loadingCover.style.setProperty('transform', `translate( 0, ${yPosition.y}%)`)
        })
        .onComplete(function () {
          loadingCover.parentNode.removeChild(loadingCover)
          sceneUtils.goToCameraView(that, 'frontView', 'exterior')
          that.rotateAroundView()
          headerContainer.classList.add('show')
          mainContainer.classList.add('show')
          setTimeout(() => {
            document.body.style.overflowY = 'auto'
          }, 5000)
        })
      this.tweenGroup.add(this.tweenCover)
    }
  }

  rotateAroundView() {
    let that = this
    const target = that.porsche.position.clone()

    // Calculate initial parameters
    const deltaX = that.camera.position.x - target.x
    const deltaZ = that.camera.position.z - target.z
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
          that.camera.position.set(x, that.camera.position.y, z)
          that.camera.lookAt(target)
          that.initialCameraZ = z
        },
      },
    )
  }

  settings() {
    this.settings = {
      cameraX: this.cameraView.sideView.position.x,
      cameraY: this.cameraView.sideView.position.y,
      cameraZ: this.cameraView.sideView.position.z,
      cameraRotX: this.cameraView.sideView.rotation.x,
      cameraRotY: this.cameraView.sideView.rotation.y,
      cameraRotZ: this.cameraView.sideView.rotation.z,
      light2X: this.directionalLight.position.x,
      light2Y: this.directionalLight.position.y,
      light2Z: this.directionalLight.position.z,
      light2Intensity: this.directionalLight.intensity,
      light2Color: `#${this.directionalLight.color.getHexString()}`,
      metalness: this.materialType.exterior.metalness,
      roughness: this.materialType.exterior.roughness,
      envMapIntensity: this.materialType.exterior.envMapIntensity,
      carRotationX: this.porschDefaultValue.rotation.x,
      carRotationY: this.porschDefaultValue.rotation.y,
      carRotationZ: this.porschDefaultValue.rotation.z,
    }
    if (this.controls) {
      this.controls.addEventListener('change', () => {
        this.updateSettings()
      })
    }
    this.gui = new dat.GUI()

    // Camera position controls
    const cameraFolder = this.gui.addFolder('Camera')
    cameraFolder
      .add(this.settings, 'cameraX', -10, 10, 0.01)
      .listen()
      .onChange((value) => {
        this.camera.position.x = parseFloat(value.toFixed(2))
        this.settings.cameraX = this.camera.position.x.toFixed(2)
      })

    cameraFolder
      .add(this.settings, 'cameraY', -10, 10, 0.01)
      .listen()
      .onChange((value) => {
        this.camera.position.y = parseFloat(value.toFixed(2))
        this.settings.cameraY = this.camera.position.y.toFixed(2)
      })

    cameraFolder
      .add(this.settings, 'cameraZ', -10, 10, 0.01)
      .listen()
      .onChange((value) => {
        this.camera.position.z = parseFloat(value.toFixed(2))
        this.settings.cameraZ = this.camera.position.z.toFixed(2)
      })
    cameraFolder
      .add(this.settings, 'cameraRotX', -10, 10, 0.01)
      .listen()
      .onChange((value) => {
        this.camera.rotation.x = parseFloat(value.toFixed(2))
        this.settings.cameraRotX = this.camera.rotation.x.toFixed(2)
      })
    cameraFolder
      .add(this.settings, 'cameraRotY', -10, 10, 0.01)
      .listen()
      .onChange((value) => {
        this.camera.rotation.y = parseFloat(value.toFixed(2))
        this.settings.cameraRotY = this.camera.rotation.y.toFixed(2)
      })
    cameraFolder
      .add(this.settings, 'cameraRotZ', -10, 10, 0.01)
      .listen()
      .onChange((value) => {
        this.camera.rotation.z = parseFloat(value.toFixed(2))
        this.settings.cameraRotZ = this.camera.rotation.z.toFixed(2)
      })
    cameraFolder
      .add(
        { goToDriverView: () => this.goToCameraView('driverView', 'interior') },
        'goToDriverView',
      )
      .name('Go to Driver View')
    cameraFolder
      .add({ goToSideView: () => this.goToCameraView('sideView', 'exterior') }, 'goToSideView')
      .name('Go to Side View')
    cameraFolder
      .add({ goToFrontView: () => this.goToCameraView('frontView', 'exterior') }, 'goToFrontView')
      .name('Go to Front View')
    cameraFolder
      .add(
        {
          rotateAroundView: () => this.rotateAroundView(),
        },
        'rotateAroundView',
      )
      .name('Rotate Around View')
    cameraFolder
      .add({ goToBackView: () => this.goToCameraView('backView', 'exterior') }, 'goToBackView')
      .name('Go To Back View')
    cameraFolder
      .add({ goToTopView: () => this.goToCameraView('topView', 'exterior') }, 'goToTopView')
      .name('Go To Top View')
    // cameraFolder.close()
    // light 2 pos
    const light2Folder = this.gui.addFolder('Light')
    light2Folder
      .add(this.settings, 'light2X', -20, 20, 0.01)
      .listen()
      .onChange((value) => {
        this.directionalLight.position.x = parseFloat(value.toFixed(2))
        this.settings.light2X = this.directionalLight.position.x.toFixed(2)
      })
    light2Folder
      .add(this.settings, 'light2Y', -20, 20, 0.01)
      .listen()
      .onChange((value) => {
        this.directionalLight.position.y = parseFloat(value.toFixed(2))
        this.settings.light2X = this.directionalLight.position.y.toFixed(2)
      })
    light2Folder
      .add(this.settings, 'light2Z', -20, 20, 0.01)
      .listen()
      .onChange((value) => {
        this.directionalLight.position.z = parseFloat(value.toFixed(2))
        this.settings.light2X = this.directionalLight.position.z.toFixed(2)
      })
    // Add intensity control
    light2Folder
      .add(this.settings, 'light2Intensity', 0, 10, 0.01)
      .listen()
      .onChange((value) => {
        this.directionalLight.intensity = parseFloat(value.toFixed(2))
        this.settings.light2Intensity = this.directionalLight.intensity.toFixed(2)
      })

    // Add color control
    light2Folder
      .addColor(this.settings, 'light2Color')
      .listen()
      .onChange((value) => {
        this.directionalLight.color.set(value)
        this.settings.light2Color = value
      })
    light2Folder.close()

    // Group material settings
    const carFolder = this.gui.addFolder('Car Settings')
    carFolder
      .add(this.settings, 'metalness', 0, 1, 0.01)
      .listen()
      .onChange((value) => {
        this.updateMaterialProperties(value, 'metalness')
      })
    carFolder
      .add(this.settings, 'roughness', 0, 1, 0.01)
      .listen()
      .onChange((value) => {
        this.updateMaterialProperties(value, 'roughness')
      })
    carFolder
      .add(this.settings, 'envMapIntensity', -10, 10, 0.01)
      .listen()
      .onChange((value) => {
        this.updateMaterialProperties(value, 'envMapIntensity')
      })
    carFolder
      .add(this.settings, 'carRotationX', -10, 10, 0.01)
      .listen()
      .onChange((value) => {
        this.porsche.rotation.x = parseFloat(value)
        this.settings.carRotationX = value
      })
    carFolder
      .add(this.settings, 'carRotationY', -10, 10, 0.01)
      .listen()
      .onChange((value) => {
        this.porsche.rotation.y = parseFloat(value)
        this.settings.carRotationY = value
      })
    carFolder
      .add(this.settings, 'carRotationZ', -10, 10, 0.01)
      .listen()
      .onChange((value) => {
        this.porsche.rotation.z = parseFloat(value)
        this.settings.carRotationZ = value
      })
    carFolder.close()
  }

  updateMaterialProperties(value, property) {
    this.porsche.traverse((child) => {
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

  addObjects() {
    this.material = new THREE.MeshStandardMaterial({
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.01,
    })

    this.geometry = new THREE.PlaneGeometry(100, 100, 1)
    this.plane = new THREE.Mesh(this.geometry, this.material)
    this.plane.rotation.x = -Math.PI / 2
    this.plane.position.y = -0.7
    this.plane.position.z = -3
    this.scene.add(this.plane)
  }

  updateSettings() {
    this.settings.cameraX = this.camera.position.x.toFixed(2)
    this.settings.cameraY = this.camera.position.y.toFixed(2)
    this.settings.cameraZ = this.camera.position.z.toFixed(2)
    this.settings.cameraRotX = this.camera.rotation.x.toFixed(2)
    this.settings.cameraRotY = this.camera.rotation.y.toFixed(2)
    this.settings.cameraRotZ = this.camera.rotation.z.toFixed(2)
  }

  render() {
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

export default HeroCanvas
