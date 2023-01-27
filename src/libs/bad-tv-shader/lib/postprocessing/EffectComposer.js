import './RenderPass';
import '../shaders/CopyShader';

/**
 * @author alteredq / http://alteredqualia.com/
 */
import THREE from '../three.min';

THREE.EffectComposer = function (renderer, renderTarget) {
  this.renderer = renderer;
  if (renderTarget === undefined) {
    const parameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
    };
    const size = renderer.getSize();
    renderTarget = new THREE.WebGLRenderTarget(
      size.width,
      size.height,
      parameters,
    );
  }

  this.renderTarget1 = renderTarget;
  this.renderTarget2 = renderTarget.clone();

  this.writeBuffer = this.renderTarget1;
  this.readBuffer = this.renderTarget2;

  this.passes = [];

  if (THREE.CopyShader === undefined)
    console.error('THREE.EffectComposer relies on THREE.CopyShader');

  this.copyPass = new THREE.ShaderPass(THREE.CopyShader);
};

THREE.EffectComposer.prototype = {
  swapBuffers() {
    const tmp = this.readBuffer;
    this.readBuffer = this.writeBuffer;
    this.writeBuffer = tmp;
  },

  addPass(pass) {
    this.passes.push(pass);
  },

  insertPass(pass, index) {
    this.passes.splice(index, 0, pass);
  },

  render(delta) {
    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;

    let maskActive = false;

    let pass;
    let i;
    const il = this.passes.length;

    for (i = 0; i < il; i++) {
      pass = this.passes[i];

      if (!pass.enabled) continue;

      pass.render(
        this.renderer,
        this.writeBuffer,
        this.readBuffer,
        delta,
        maskActive,
      );

      if (pass.needsSwap) {
        if (maskActive) {
          const { context } = this.renderer;

          context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff);

          this.copyPass.render(
            this.renderer,
            this.writeBuffer,
            this.readBuffer,
            delta,
          );

          context.stencilFunc(context.EQUAL, 1, 0xffffffff);
        }

        this.swapBuffers();
      }

      if (pass instanceof THREE.MaskPass) {
        maskActive = true;
      } else if (pass instanceof THREE.ClearMaskPass) {
        maskActive = false;
      }
    }
  },

  reset(renderTarget) {
    if (renderTarget === undefined) {
      const size = this.renderer.getSize();

      renderTarget = this.renderTarget1.clone();
      renderTarget.setSize(size.width, size.height);
    }

    this.renderTarget1.dispose();
    this.renderTarget2.dispose();
    this.renderTarget1 = renderTarget;
    this.renderTarget2 = renderTarget.clone();

    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;
  },

  setSize(width, height) {
    this.renderTarget1.setSize(width, height);
    this.renderTarget2.setSize(width, height);
  },
};
