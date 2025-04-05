import * as THREE from 'three'
import sceneUtils from './SceneUtils'
import gsap from 'gsap'
class AboutCanvas {
  constructor(options) {
    this.scene = new THREE.Scene()
    this.container = options.dom
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor(0xececec, 1)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(sceneUtils.colorPalatte.primaryColor, 1)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.container.appendChild(this.renderer.domElement)

    sceneUtils.cameraController(this)
    this.time = new THREE.Clock()
    this.elapsedTime = 0
    sceneUtils.loadHDR(this)
    sceneUtils.loadModels(this)
    sceneUtils.addObjects(this)
    sceneUtils.addLights(this)
    sceneUtils.setupResize(this)
    sceneUtils.resize(this)
    this.render()
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

export default AboutCanvas
