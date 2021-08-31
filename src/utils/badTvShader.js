/* eslint-disable */
import '../libs/bad-tv-shader/js/BadTVShader';
import '../libs/bad-tv-shader/js/StaticShader';
import '../libs/bad-tv-shader/lib/dat.gui.min';
import '../libs/bad-tv-shader/lib/stats.min';
import '../libs/bad-tv-shader/lib/shaders/CopyShader';
import '../libs/bad-tv-shader/lib/shaders/FilmShader';
import '../libs/bad-tv-shader/lib/shaders/RGBShiftShader';
import '../libs/bad-tv-shader/lib/postprocessing/EffectComposer';
import '../libs/bad-tv-shader/lib/postprocessing/MaskPass';
import '../libs/bad-tv-shader/lib/postprocessing/RenderPass';
import '../libs/bad-tv-shader/lib/postprocessing/ShaderPass';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import THREE from '../libs/bad-tv-shader/lib/three.min';

const initTvShader = (containerClassName, backgroundVideo, staticOnly) => {
  const isBrowser = typeof window !== 'undefined';

  if (!isBrowser) return;

  const removeShaders = () => {
    const badTvShader = document.getElementById('bad-tv-shader');
    if (badTvShader) badTvShader.remove();
    window.removeEventListener('pauseVideo', window.onPause);
    window.removeEventListener('playVideo', window.onPlay);
    window.removeEventListener('skipStart', window.onSkipStart);
    window.removeEventListener('skipEnd', window.onSkipEnd);
  };

  removeShaders();

  let shaderTime = 0;
  const videoContainer = document.getElementsByClassName(containerClassName)[0];
  let video = document.createElement('video');
  video.loop = true;
  video.muted = true;
  if (backgroundVideo) {
    video.src = backgroundVideo;
    video.play();
  }
  // init video texture
  const videoTexture = new THREE.Texture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  const videoMaterial = new THREE.MeshBasicMaterial({
    map: videoTexture,
  });

  // init camera
  const camera = new THREE.PerspectiveCamera(55, 1280 / 720, 20, 3000);
  camera.position.z = 1000;
  const scene = new THREE.Scene();

  // Add video plane
  const planeGeometry = new THREE.PlaneGeometry(1280, 720, 1, 1);
  const plane = new THREE.Mesh(planeGeometry, videoMaterial);
  scene.add(plane);
  plane.z = 0;
  // eslint-disable-next-line no-multi-assign
  plane.scale.x = plane.scale.y = 1.45;

  // init renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.id = 'bad-tv-shader';
  videoContainer.prepend(renderer.domElement);

  const renderPass = new THREE.RenderPass(scene, camera);
  const badTVPass = new THREE.ShaderPass(THREE.BadTVShader);
  const rgbPass = new THREE.ShaderPass(THREE.RGBShiftShader);
  const filmPass = new THREE.ShaderPass(THREE.FilmShader);
  const staticPass = new THREE.ShaderPass(THREE.StaticShader);
  const copyPass = new THREE.ShaderPass(THREE.CopyShader);

  filmPass.uniforms.grayscale.value = 0;

  const composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(filmPass);
  composer.addPass(badTVPass);
  composer.addPass(rgbPass);
  composer.addPass(staticPass);
  composer.addPass(copyPass);
  copyPass.renderToScreen = true;
  //set shader uniforms
  filmPass.uniforms.grayscale.value = 0;

  const badTVParams = {
    mute: true,
    show: true,
    distortion: 0,
    distortion2: 0,
    speed: 0.3,
    rollSpeed: 0,
  };

  const staticParams = {
    show: staticOnly,
    amount: staticOnly ? 1 : 0,
    size: 6.0,
  };

  const rgbParams = {
    show: true,
    amount: 0.004,
    angle: 0.0,
  };

  const filmParams = {
    show: true,
    count: 1000,
    sIntensity: 0.7,
    nIntensity: 0.3,
  };

  badTVPass.uniforms['distortion'].value = badTVParams.distortion;
  badTVPass.uniforms['distortion2'].value = badTVParams.distortion2;
  badTVPass.uniforms['speed'].value = badTVParams.speed;
  badTVPass.uniforms['rollSpeed'].value = badTVParams.rollSpeed;

  staticPass.uniforms['amount'].value = staticParams.amount;
  staticPass.uniforms['size'].value = staticParams.size;

  rgbPass.uniforms['angle'].value = rgbParams.angle * Math.PI;
  rgbPass.uniforms['amount'].value = rgbParams.amount;

  filmPass.uniforms['sCount'].value = filmParams.count;
  filmPass.uniforms['sIntensity'].value = filmParams.sIntensity;
  filmPass.uniforms['nIntensity'].value = filmParams.nIntensity;

  const onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };

  let shouldAnimate = true;

  window.onPause = () => {
    if (!video.paused) {
      shouldAnimate = false;
      video.pause();
      badTVPass.uniforms['distortion'].value = 1.7;
      badTVPass.uniforms['distortion2'].value = 1;
      staticPass.uniforms['amount'].value = 0.1;
    }
  };
  window.pauseVideo = new Event('pauseVideo');
  window.addEventListener('pauseVideo', window.onPause, false);

  window.onPlay = () => {
    if (video.paused) {
      video.play().then(() => {
        shouldAnimate = true;
      });
      badTVPass.uniforms['distortion'].value = 0;
      badTVPass.uniforms['distortion2'].value = 0;
      staticPass.uniforms['amount'].value = 0;
    }
  };
  window.playVideo = new Event('playVideo');
  window.addEventListener('playVideo', window.onPlay, false);

  window.onSkipStart = () => {
    video.playbackRate = 2;
    badTVPass.uniforms['distortion'].value = 3;
    badTVPass.uniforms['distortion2'].value = 2;
    staticPass.uniforms['amount'].value = 0.1;
  };
  window.skipStart = new Event('skipStart');
  window.addEventListener('skipStart', window.onSkipStart, false);

  window.onSkipEnd = () => {
    video.playbackRate = 1;
    badTVPass.uniforms['distortion'].value = 0;
    badTVPass.uniforms['distortion2'].value = 0;
    staticPass.uniforms['amount'].value = 0;
  };
  window.skipEnd = new Event('skipEnd');
  window.addEventListener('skipEnd', window.onSkipEnd, false);

  onResize();

  window.addEventListener('resize', onResize, false);

  let blurred = false;

  window.onfocus = () => {
    blurred = false;
  };

  window.onblur = () => {
    blurred = true;
  };

  const animate = () => {
    shaderTime += 0.1;
    badTVPass.uniforms.time.value = shaderTime;
    filmPass.uniforms.time.value = shaderTime;
    staticPass.uniforms.time.value = shaderTime;
    if (
      video.readyState === video.HAVE_ENOUGH_DATA &&
      shouldAnimate &&
      !blurred
    ) {
      if (videoTexture) videoTexture.needsUpdate = true;
    }

    requestAnimationFrame(animate);
    composer.render(0.1);
  };

  animate();
};

export { initTvShader };
