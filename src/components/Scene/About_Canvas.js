import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap'
class Canvas {
  constructor(options) {
    this.scene = new THREE.Scene()
    this.container = options.dom
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor(0xececec, 1)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.width, this.height)
    this.colorPalatte = {
      primaryColor: 0xfffcef,
      secondaryColor: 0xefebe0,
    }
    this.renderer.setClearColor(this.colorPalatte.primaryColor, 1)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 0.8
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.container.appendChild(this.renderer.domElement)

    this.cameraController()

    // build type
    this.materialType = {
      interior: {
        metalness: 0.5,
        roughness: 0.5,
        envMapIntensity: 2,
      },
      exterior: {
        metalness: 0.2,
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
    this.loadModels()
    this.addObjects()
    this.addLights()
    this.resize()
    this.render()
    this.setupResize()
  }

  loadModels() {
    this.dracoLoader = new DRACOLoader()
    this.dracoLoader.setDecoderPath('/draco/')
    this.dracoLoader.setDecoderConfig({ type: 'js' })
    this.gltfLoader = new GLTFLoader(this.loadingManager)
    this.gltfLoader.setDRACOLoader(this.dracoLoader)

    this.gltfLoader.load('/models/porsche.glb', (gltf) => {
      this.porsche = gltf.scene
      this.porsche.scale.set(1, 1, 1)
      this.porsche.traverse((child) => {
        child.castShadow = true
        child.receiveShadow = true
        if (child.material) {
          child.material.metalness = this.materialType.exterior.metalness
          child.material.roughness = this.materialType.exterior.roughness
          if (child.material.map) {
            child.material.map.minFilter = THREE.LinearFilter
            child.material.map.generateMipmaps = false
            child.material.map.needsUpdate = true
          }
          child.material.needsUpdate = true
        }
      })
      this.porsche.position.set(
        this.porschDefaultValue.position.x,
        this.porschDefaultValue.position.y,
        this.porschDefaultValue.position.z,
      )
      this.porsche.rotation.y = 270 * (Math.PI / 180)
      this.scene.add(this.porsche)
    })
  }

  cameraController() {
    this.cameraGroup1 = new THREE.Group()
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000,
    )
    this.scene.add(this.cameraGroup1)
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 1) // Low-intensity ambient light
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2)
    this.directionalLight.position.set(-0.33, 0.33, 1.8)
    this.directionalLight.castShadow = true
    this.directionalLight.shadow.mapSize.width = 1024 * 2
    this.directionalLight.shadow.mapSize.height = 1024 * 2
    this.directionalLight.shadow.bias = -0.001
    this.scene.add(ambientLight)
    this.scene.add(this.directionalLight)
  }

  addObjects() {
    this.material = new THREE.MeshPhongMaterial({
      color: this.colorPalatte.secondaryColor,
      opacity: 0.4,
    })

    this.geometry = new THREE.CircleGeometry(5, 32)
    this.plane = new THREE.Mesh(this.geometry, this.material)
    this.plane.rotation.x = -Math.PI / 2
    this.plane.frustumCulled = true
    this.plane.receiveShadow = true
    this.plane.position.y = -0.7
    this.plane.position.z = 0.25
    this.scene.add(this.plane)
  }
  render() {
    this.elapsedTime = this.time.getElapsedTime()
    const radius = 3.25
    const speed = 0.04
    const angle = this.elapsedTime * speed

    // GSAP smooth position update
    gsap.to(this.camera.position, {
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius + 0.5,
      y: 0.2,
      duration: 0.5, // Adjust for responsiveness
      ease: 'power1.out',
    })

    this.camera.lookAt(0.5, 0, 1)

    requestAnimationFrame(this.render.bind(this))
    this.renderer.render(this.scene, this.camera)
  }
}

export default Canvas
