import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Tween, Easing, Group } from 'three/examples/jsm/libs/tween.module.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { EXRLoader } from 'three/examples/jsm/Addons.js'
import * as dat from 'lil-gui'
import gsap from 'gsap'
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
    this.renderer.toneMapping = THREE.NeutralToneMapping
    this.renderer.toneMappingExposure = 0.25
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.container.appendChild(this.renderer.domElement)

    this.aboutDetailsContainer = document.getElementById('about-scene')
    this.renderer2 = new THREE.WebGLRenderer({ antialias: false })
    this.renderer2.toneMapping = THREE.NeutralToneMapping
    this.renderer2.toneMappingExposure = 0.25
    this.renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1))
    this.renderer2.setSize(
      this.aboutDetailsContainer.offsetWidth,
      this.aboutDetailsContainer.offsetHeight,
    )
    this.aboutDetailsContainer.appendChild(this.renderer2.domElement)

    this.cameraController()

    // build type
    this.materialType = {
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

    // car position
    this.porschDefaultValue = {
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
    this.porsche = null
    this.time = new THREE.Clock()
    this.elapsedTime = 0
    this.previousTime = 0
    this.tweenGroup = new Group()
    this.isPlaying = true
    this.addObjects()
    this.loadModels()
    this.loadEnvironmentMap()
    this.loadAudios()
    this.addLights()
    this.resize()
    this.render()
    this.setupResize()
    // this.settings()
  }

  cameraController() {
    // camera view
    this.cameraView = {
      driverView: {
        position: { x: 0.2, y: 0.3, z: 1.2 },
        rotation: { x: -1.55, y: 1.17, z: 1.55 },
      },
      sideView: {
        position: { x: 0.05, y: 0.15, z: 3 },
        rotation: { x: -0.04, y: -0.04, z: 0 },
      },
      frontView: {
        position: {
          x: -3.2,
          y: 0.45,
          z: 1.15,
        },
        rotation: {
          x: -0.82,
          y: -1.26,
          z: -0.82,
        },
      },
      backView: {
        position: {
          x: 3.3,
          y: 0.3,
          z: 0.65,
        },
        rotation: {
          x: -0.82,
          y: -1.26,
          z: -0.82,
        },
      },
      topView: {
        position: {
          x: 0.75,
          y: 4.25,
          z: 0.02,
        },
        rotation: {
          x: -0.82,
          y: -1.26,
          z: -0.82,
        },
      },
    }

    this.cameraGroup1 = new THREE.Group()
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000,
    )
    this.scene.add(this.cameraGroup1)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.maxPolarAngle = Math.PI / 2

    this.cameraGroup2 = new THREE.Group()
    this.camera2 = new THREE.PerspectiveCamera(
      35,
      this.aboutDetailsContainer.clientWidth / this.aboutDetailsContainer.clientHeight,
      0.001,
      1000,
    )

    this.camera2.position.set(-3.2, 0, -1.5)
    this.camera2.rotation.set(0, -2.25, 0)

    this.scene.add(this.cameraGroup2)

    // this.controls2 = new OrbitControls(this.camera2, this.renderer2.domElement)
    // this.controls2.enableDamping = true
    // this.controls2.maxPolarAngle = Math.PI / 2
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
  loadEnvironmentMap() {
    this.loadingManager = new THREE.LoadingManager()
    const startButton = document.getElementById('start-button')
    const loadingValue = document.getElementById('loading-value')
    this.loadingManager.onLoad = () => {
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
          this.goToCameraView('frontView', 'exterior')
        })
      this.tweenGroup.add(this.tween)
      window.scroll(0, 0)
    }

    this.environmentLoader = new EXRLoader(this.loadingManager).load(
      'models/studio.exr',
      (environmentMap) => {
        environmentMap.mapping = THREE.EquirectangularReflectionMapping
        this.scene.background = environmentMap
        this.scene.environment = environmentMap
      },
    )
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
    this.dracoLoader = new DRACOLoader()
    this.dracoLoader.setDecoderPath('/draco/')
    this.dracoLoader.setDecoderConfig({ type: 'js' })
    this.gltfLoader = new GLTFLoader(this.loadingManager)
    this.gltfLoader.setDRACOLoader(this.dracoLoader)

    this.gltfLoader.load('/models/porsche.glb', (gltf) => {
      this.porsche = gltf.scene
      this.porsche.traverse((child) => {
        child.castShadow = true
        child.receiveShadow = true
        if (child.material) {
          if (!child.material.envMap) {
            child.material.envMap = this.scene.environment
            child.material.metalness = this.materialType.exterior.metalness
            child.material.roughness = this.materialType.exterior.roughness
            child.material.envMapIntensity = this.materialType.exterior.envMapIntensity
            child.material.needsUpdate = true
          }
        }
      })
      this.porsche.position.set(
        this.porschDefaultValue.position.x,
        this.porschDefaultValue.position.y,
        this.porschDefaultValue.position.z,
      )
      this.porsche.rotation.y = 270 * (Math.PI / 180)
      this.scene.add(this.porsche)
      this.clearScene()
    })
  }

  goToCameraView(viewScene, materialType) {
    let targetPosition, targetRotation
    const transSec = 1.5
    const easeType = 'expo.inOut'

    switch (viewScene) {
      case 'driverView': {
        targetPosition = {
          x: this.cameraView.driverView.position.x,
          y: this.cameraView.driverView.position.y,
          z: this.cameraView.driverView.position.z,
        }
        targetRotation = {
          x: this.cameraView.driverView.rotation.x,
          y: this.cameraView.driverView.rotation.y,
          z: this.cameraView.driverView.rotation.z,
        }
        break
      }
      case 'sideView': {
        targetPosition = {
          x: this.cameraView.sideView.position.x,
          y: this.cameraView.sideView.position.y,
          z: this.cameraView.sideView.position.z,
        }
        targetRotation = {
          x: this.cameraView.sideView.rotation.x,
          y: this.cameraView.sideView.rotation.y,
          z: this.cameraView.sideView.rotation.z,
        }
        break
      }
      case 'frontView': {
        targetPosition = {
          x: this.cameraView.frontView.position.x,
          y: this.cameraView.frontView.position.y,
          z: this.cameraView.frontView.position.z,
        }
        targetRotation = {
          x: this.cameraView.frontView.rotation.x,
          y: this.cameraView.frontView.rotation.y,
          z: this.cameraView.frontView.rotation.z,
        }
        break
      }
      case 'backView': {
        targetPosition = {
          x: this.cameraView.backView.position.x,
          y: this.cameraView.backView.position.y,
          z: this.cameraView.backView.position.z,
        }
        targetRotation = {
          x: this.cameraView.backView.rotation.x,
          y: this.cameraView.backView.rotation.y,
          z: this.cameraView.backView.rotation.z,
        }
        break
      }
      case 'topView': {
        targetPosition = {
          x: this.cameraView.topView.position.x,
          y: this.cameraView.topView.position.y,
          z: this.cameraView.topView.position.z,
        }
        targetRotation = {
          x: this.cameraView.topView.rotation.x,
          y: this.cameraView.topView.rotation.y,
          z: this.cameraView.topView.rotation.z,
        }
        break
      }
    }
    const animation = gsap.to(this.camera.position, {
      duration: transSec,
      ease: easeType,
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      onUpdate: () => {
        this.camera.position.set(
          this.camera.position.x,
          this.camera.position.y,
          this.camera.position.z,
        )
        if (animation.progress() > 0.5) {
          this.updateMaterialProperties(this.materialType[materialType].metalness, 'metalness')
          this.updateMaterialProperties(this.materialType[materialType].roughness, 'roughness')
          this.updateMaterialProperties(
            this.materialType[materialType].envMapIntensity,
            'envMapIntensity',
          )
        }
      },
    })

    gsap.to(this.camera.rotation, {
      duration: transSec,
      ease: easeType,
      x: targetRotation.x,
      y: targetRotation.y,
      z: targetRotation.z,
      onUpdate: () => {
        this.camera.rotation.set(
          this.camera.rotation.x,
          this.camera.rotation.y,
          this.camera.rotation.z,
        )
      },
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
          that.goToCameraView('frontView', 'exterior')
          that.rotateAroundView()
          headerContainer.classList.add('show')
          mainContainer.classList.add('show')
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
      light2X: this.light2.position.x,
      light2Y: this.light2.position.y,
      light2Z: this.light2.position.z,
      light2Intensity: this.light2.intensity,
      light2Color: `#${this.light2.color.getHexString()}`,
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
    // if (this.controls2) {
    //   this.controls2.addEventListener('change', () => {
    //     this.updateSettings()
    //   })
    // }

    this.gui = new dat.GUI()

    // Camera position controls
    const cameraFolder = this.gui.addFolder('Camera')
    cameraFolder
      .add(this.settings, 'cameraX', -10, 10, 0.01)
      .listen()
      .onChange((value) => {
        this.camera2.position.x = parseFloat(value.toFixed(2))
        this.settings.cameraX = this.camera2.position.x.toFixed(2)
      })

    cameraFolder
      .add(this.settings, 'cameraY', -10, 10, 0.01)
      .listen()
      .onChange((value) => {
        this.camera2.position.y = parseFloat(value.toFixed(2))
        this.settings.cameraY = this.camera2.position.y.toFixed(2)
      })

    cameraFolder
      .add(this.settings, 'cameraZ', -10, 10, 0.01)
      .listen()
      .onChange((value) => {
        this.camera2.position.z = parseFloat(value.toFixed(2))
        this.settings.cameraZ = this.camera2.position.z.toFixed(2)
      })
    cameraFolder
      .add(this.settings, 'cameraRotX', -10, 10, 0.01)
      .listen()
      .onChange((value) => {
        this.camera2.rotation.x = parseFloat(value.toFixed(2))
        this.settings.cameraRotX = this.camera2.rotation.x.toFixed(2)
      })
    cameraFolder
      .add(this.settings, 'cameraRotY', -10, 10, 0.01)
      .listen()
      .onChange((value) => {
        this.camera2.rotation.y = parseFloat(value.toFixed(2))
        this.settings.cameraRotY = this.camera2.rotation.y.toFixed(2)
      })
    cameraFolder
      .add(this.settings, 'cameraRotZ', -10, 10, 0.01)
      .listen()
      .onChange((value) => {
        this.camera2.rotation.z = parseFloat(value.toFixed(2))
        this.settings.cameraRotZ = this.camera2.rotation.z.toFixed(2)
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
        this.light2.position.x = parseFloat(value.toFixed(2))
        this.settings.light2X = this.light2.position.x.toFixed(2)
      })
    light2Folder
      .add(this.settings, 'light2Y', -20, 20, 0.01)
      .listen()
      .onChange((value) => {
        this.light2.position.y = parseFloat(value.toFixed(2))
        this.settings.light2X = this.light2.position.y.toFixed(2)
      })
    light2Folder
      .add(this.settings, 'light2Z', -20, 20, 0.01)
      .listen()
      .onChange((value) => {
        this.light2.position.z = parseFloat(value.toFixed(2))
        this.settings.light2X = this.light2.position.z.toFixed(2)
      })
    // Add intensity control
    light2Folder
      .add(this.settings, 'light2Intensity', 0, 10, 0.01)
      .listen()
      .onChange((value) => {
        this.light2.intensity = parseFloat(value.toFixed(2))
        this.settings.light2Intensity = this.light2.intensity.toFixed(2)
      })

    // Add color control
    light2Folder
      .addColor(this.settings, 'light2Color')
      .listen()
      .onChange((value) => {
        this.light2.color.set(value)
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 2) // Low-intensity ambient light
    this.scene.add(ambientLight)
    this.light2 = new THREE.DirectionalLight(0xffffff, 5)
    this.light2.position.set(-0.16, 20, 12)
    this.light2.castShadow = true
    this.light2.shadow.mapSize.width = 1024
    this.light2.shadow.mapSize.height = 1024
    this.light2.shadow.bias = -0.001
    this.scene.add(this.light2)
  }

  addObjects() {
    this.material = new THREE.MeshStandardMaterial({
      roughness: 1,
      metalness: 0.2,
      envMapIntensity: 0,
      color: 0xececec,
    })

    this.geometry = new THREE.PlaneGeometry(500, 500, 1)
    this.plane = new THREE.Mesh(this.geometry, this.material)
    this.plane.rotation.x = -Math.PI / 2
    this.plane.frustumCulled = true
    this.plane.receiveShadow = true
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
    this.settings.cameraX = this.camera2.position.x.toFixed(2)
    this.settings.cameraY = this.camera2.position.y.toFixed(2)
    this.settings.cameraZ = this.camera2.position.z.toFixed(2)
    this.settings.cameraRotX = this.camera2.rotation.x.toFixed(2)
    this.settings.cameraRotY = this.camera2.rotation.y.toFixed(2)
    this.settings.cameraRotZ = this.camera2.rotation.z.toFixed(2)
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
    // if (this.controls2) {
    //   this.controls2.update()
    // }
    this.updateSettings()

    if (this.tweenGroup) {
      this.tweenGroup.update()
    }
    requestAnimationFrame(this.render.bind(this))
    this.renderer.render(this.scene, this.camera)
    this.renderer2.render(this.scene, this.camera2)
  }
}

export default Canvas
