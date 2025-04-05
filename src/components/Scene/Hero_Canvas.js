import * as THREE from 'three'
import { Tween, Easing, Group } from 'three/examples/jsm/libs/tween.module.js'
import sceneUtils from './SceneUtils'
import gsap from 'gsap'
class HeroCanvas {
  constructor(options) {
    sceneUtils.initializeScene(this, options)
    sceneUtils.cameraController(this)
    this.tweenGroup = new Group()
    this.initialCameraZ = 0

    this.loadAssets()
    this.loadAudios()
    sceneUtils.addObjects(this)
    sceneUtils.addLights(this)
    sceneUtils.setupResize(this)
    sceneUtils.resize(this)
    this.render()
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

    this.textureLoader = new THREE.TextureLoader(this.loadingManager)

    sceneUtils.assetPaths.forEach((path) => {
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
          sceneUtils.rotateAroundView(that)
          headerContainer.classList.add('show')
          mainContainer.classList.add('show')
          setTimeout(() => {
            document.body.style.overflowY = 'auto'
          }, 5000)
        })
      this.tweenGroup.add(this.tweenCover)
    }
  }

  render() {
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
