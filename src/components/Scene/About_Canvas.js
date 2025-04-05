import sceneUtils from './SceneUtils'
import gsap from 'gsap'
class AboutCanvas {
  constructor(options) {
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

  render() {
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
