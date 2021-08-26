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

const initTvShader = (containerClassName) => {
  let shaderTime = 0;
  const videoContainer = document.getElementsByClassName(containerClassName)[0];
  let video = document.createElement('video');
  video.loop = true;
  video.muted = true;
  video.src = 'assets/persona.mp4';
  video.play();
  // init video texture
  const videoTexture = new THREE.Texture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  const videoMaterial = new THREE.MeshBasicMaterial({
    map: videoTexture,
  });

  // init camera
  const camera = new THREE.PerspectiveCamera(55, 1080 / 720, 20, 3000);
  camera.position.z = 1000;
  const scene = new THREE.Scene();

  // Add video plane
  const planeGeometry = new THREE.PlaneGeometry(1080, 720, 1, 1);
  const plane = new THREE.Mesh(planeGeometry, videoMaterial);
  scene.add(plane);
  plane.z = 0;
  // eslint-disable-next-line no-multi-assign
  plane.scale.x = plane.scale.y = 1.45;

  // init renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(800, 600);
  console.log(videoContainer);
  videoContainer.prepend(renderer.domElement);

  const renderPass = new THREE.RenderPass(scene, camera);
  const badTVPass = new THREE.ShaderPass(THREE.BadTVShader);
  const rgbPass = new THREE.ShaderPass(THREE.RGBShiftShader);
  const filmPass = new THREE.ShaderPass(THREE.FilmShader);
  // const staticPass = new THREE.ShaderPass(THREE.StaticShader);
  const copyPass = new THREE.ShaderPass(THREE.CopyShader);

  filmPass.uniforms.grayscale.value = 0;

  const composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(filmPass);
  composer.addPass(badTVPass);
  composer.addPass(rgbPass);
  // composer.addPass(staticPass);
  composer.addPass(copyPass);
  copyPass.renderToScreen = true;
  //set shader uniforms
  filmPass.uniforms.grayscale.value = 0;

  const badTVParams = {
    mute: true,
    show: true,
    distortion: 3.0,
    distortion2: 1.0,
    speed: 0.3,
    rollSpeed: 0.1,
  };

  const staticParams = {
    show: true,
    amount: 0.5,
    size: 4.0,
  };

  const rgbParams = {
    show: true,
    amount: 0.005,
    angle: 0.0,
  };

  const filmParams = {
    show: true,
    count: 800,
    sIntensity: 0.9,
    nIntensity: 0.4,
  };

  badTVPass.uniforms['distortion'].value = badTVParams.distortion;
  badTVPass.uniforms['distortion2'].value = badTVParams.distortion2;
  badTVPass.uniforms['speed'].value = badTVParams.speed;
  badTVPass.uniforms['rollSpeed'].value = badTVParams.rollSpeed;

  // staticPass.uniforms['amount'].value = staticParams.amount;
  // staticPass.uniforms['size'].value = staticParams.size;

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

  onResize();

  window.addEventListener('resize', onResize, false);

  const animate = () => {
    shaderTime += 0.1;
    badTVPass.uniforms.time.value = shaderTime;
    filmPass.uniforms.time.value = shaderTime;
    // staticPass.uniforms.time.value = shaderTime;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      if (videoTexture) videoTexture.needsUpdate = true;
    }

    requestAnimationFrame(animate);
    composer.render(0.1);
  };

  animate();
};

const animateTvShader = () => {};

export { initTvShader, animateTvShader };
