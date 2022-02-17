/* eslint-disable */
import React, { useEffect } from 'react';

import * as styles from './Atmospheres.module.scss';

// demo namespace
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const demo: Record<string, any> = {
  // CUSTOMIZABLE PROPERTIES
  // - physics speed multiplier: allows slowing down or speeding up simulation
  speed: 1,
  // - color of particles
  color: {
    r: '80',
    g: '175',
    b: '255',
    a: '0.5',
  },

  // END CUSTOMIZATION
  // whether demo is running
  started: false,
  // canvas and associated context references
  canvas: null,
  ctx: null,
  // viewport dimensions (DIPs)
  width: 0,
  height: 0,
  // devicePixelRatio alias (should only be used for rendering, physics shouldn't care)
  dpr: window.devicePixelRatio || 1,
  // time since last drop
  drop_time: 0,
  // ideal time between drops (changed with mouse/finger)
  drop_delay: 25,
  // wind applied to rain (changed with mouse/finger)
  wind: 4,
  // color of rain (set in init)
  rain_color: null,
  rain_color_clear: null,
  // rain particles
  rain: [],
  rain_pool: [],
  // rain droplet (splash) particles
  drops: [],
  drop_pool: [],
};

const Ticker = (() => {
  const PUBLIC_API: Record<string, any> = {};

  // private
  let started = false;
  let lastTimestamp = 0;
  const listeners: any[] = [];
  // queue up a new frame (calls frameHandler)

  function queueFrame() {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    requestAnimationFrame(frameHandler);
  }

  function frameHandler(timestamp: number) {
    let frameTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    // make sure negative time isn't reported (first frame can be whacky)
    if (frameTime < 0) {
      frameTime = 17;
    }
    // - cap minimum framerate to 15fps[~68ms] (assuming 60fps[~17ms] as 'normal')
    else if (frameTime > 68) {
      frameTime = 68;
    }

    // fire custom listeners
    for (let i = 0, len = listeners.length; i < len; i += 1) {
      listeners[i].call(window, frameTime, frameTime / 16.67);
    }

    // always queue another frame
    queueFrame();
  }

  // public
  // will call function reference repeatedly once registered, passing elapsed time and a lag multiplier as parameters
  PUBLIC_API.addListener = function addListener(fn: () => void) {
    if (typeof fn !== 'function')
      throw new Error(
        'Ticker.addListener() requires a function reference passed in.',
      );

    listeners.push(fn);

    // start frame-loop lazily
    if (!started) {
      started = true;
      queueFrame();
    }
  };

  return PUBLIC_API;
})();

function Rain() {
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.speed = 25;
  this.splashed = false;
}

Rain.width = 2;
Rain.height = 40;
Rain.prototype.init = function () {
  this.y = Math.random() * -100;
  this.z = Math.random() * 0.5 + 0.5;
  this.splashed = false;
};
Rain.prototype.recycle = function () {
  demo.rain_pool.push(this);
};
// recycle rain particle and create a burst of droplets
Rain.prototype.splash = function () {
  if (!this.splashed) {
    this.splashed = true;
    const { drops } = demo;
    const { drop_pool } = demo;

    for (let i = 0; i < 16; i++) {
      // @ts-ignore
      const drop = drop_pool.pop() || new Drop();
      drops.push(drop);
      drop.init(this.x);
    }
  }
};

function Drop() {
  this.x = 0;
  this.y = 0;
  this.radius = Math.round(Math.random() * 2 + 1) * demo.dpr;
  this.speed_x = 0;
  this.speed_y = 0;
  this.canvas = document.getElementById('canvas-rain');
  this.ctx = this.canvas.getContext('2d');

  // render once and cache
  const diameter = this.radius * 2;
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight - 200;

  const grd = this.ctx.createRadialGradient(
    this.radius,
    this.radius,
    1,
    this.radius,
    this.radius,
    this.radius,
  );
  grd.addColorStop(0, demo.rain_color);
  grd.addColorStop(1, demo.rain_color_clear);
  this.ctx.fillStyle = grd;
  this.ctx.fillRect(0, 0, diameter, diameter);
}

Drop.max_speed = 2;

Drop.prototype.init = function (x) {
  this.x = x;
  this.y = 737;
  const angle = Math.random() * Math.PI - Math.PI * 0.5;
  const speed = Math.random() * Drop.max_speed;
  this.speed_x = Math.sin(angle) * speed;
  this.speed_y = -Math.cos(angle) * speed;
};
Drop.prototype.recycle = function () {
  demo.drop_pool.push(this);
};

const RainEffect: React.FC = () => {
  useEffect(() => {
    // Falling rain simulation using 2D canvas
    // - vanilla JS, no frameworks
    // - framerate independent physics
    // - slow-mo / fast-forward support via demo.speed
    // - supports high-DPI screens
    // - falling rain particles are drawn as vector lines
    // - splash particles are lazily pre-rendered so gradients aren't computed each frame
    // - all particles make use of object pooling to further boost performance

    // initialize

    window.addEventListener('resize', demo.resize);

    // demo initialization (should only run once)
    demo.init = function () {
      if (!demo.started) {
        console.log('bibi');
        demo.started = true;
        demo.canvas = document.getElementById('canvas-rain');
        demo.ctx = demo.canvas.getContext('2d');
        const c = demo.color;
        demo.rain_color = `rgba(${c.r},${c.g},${c.b},${c.a})`;
        demo.rain_color_clear = `rgba(${c.r},${c.g},${c.b},0)`;
        demo.resize();
        Ticker.addListener(demo.step);
      }
    };

    // (re)size canvas (clears all particles)
    demo.resize = () => {
      // localize common references
      const { rain } = demo;
      const { drops } = demo;
      // recycle particles
      for (let i = rain.length - 1; i >= 0; i -= 1) {
        rain.pop().recycle();
      }
      for (let i = drops.length - 1; i >= 0; i -= 1) {
        drops.pop().recycle();
      }
      // resize
      demo.width = window.innerWidth;
      demo.height = window.innerHeight;
      demo.canvas.width = demo.width * demo.dpr;
      demo.canvas.height = demo.height * demo.dpr;
    };

    demo.step = (time: number, lag: number) => {
      // localize common references
      // eslint-disable-next-line
      const { speed } = demo;
      const { width } = demo;
      const { height } = demo;
      const { wind } = demo;
      const { rain } = demo;
      const { rain_pool: rainPool } = demo;
      const { drops } = demo;
      const { drop_pool: dropPool } = demo;

      // multiplier for physics
      const multiplier = speed * lag;

      // spawn drops
      demo.drop_time += time * speed;
      while (demo.drop_time > demo.drop_delay) {
        demo.drop_time -= demo.drop_delay;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const newRain = rainPool.pop() || new Rain();
        newRain.init();
        const windExpand = Math.abs((height / newRain.speed) * wind); // expand spawn width as wind increases
        let spawnX = Math.random() * (width + windExpand);
        if (wind > 0) spawnX -= windExpand;
        newRain.x = spawnX;
        rain.push(newRain);
      }

      // rain physics
      for (let i = rain.length - 1; i >= 0; i -= 1) {
        const r = rain[i];
        r.y += r.speed * r.z * multiplier;
        r.x += r.z * wind * multiplier;
        // remove rain when out of view
        if (r.y > height) {
          // if rain reached bottom of view, show a splash
          r.splash();
        }
        // recycle rain
        if (
          r.y > height + Rain.height * r.z ||
          (wind < 0 && r.x < wind) ||
          (wind > 0 && r.x > width + wind)
        ) {
          r.recycle();
          rain.splice(i, 1);
        }
      }

      // splash drop physics
      const dropMaxSpeed = Drop.max_speed;
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.x += d.speed_x * multiplier;
        d.y += d.speed_y * multiplier;
        // apply gravity - magic number 0.3 represents a faked gravity constant
        d.speed_y += 0.3 * multiplier;
        // apply wind (but scale back the force)
        d.speed_x += (wind / 25) * multiplier;
        if (d.speed_x < -dropMaxSpeed) {
          d.speed_x = -dropMaxSpeed;
        } else if (d.speed_x > dropMaxSpeed) {
          d.speed_x = dropMaxSpeed;
        }
        // recycle
        if (d.y > height + d.radius) {
          d.recycle();
          drops.splice(i, 1);
        }
      }

      demo.draw();
    };

    demo.draw = function () {
      // localize common references
      const { width } = demo;
      const { height } = demo;
      const { dpr } = demo;
      const { rain } = demo;
      const { drops } = demo;
      const { ctx } = demo;

      // start fresh
      ctx.clearRect(0, 0, width * dpr, height * dpr);

      // draw rain (trace all paths first, then stroke once)
      ctx.beginPath();
      const rain_height = Rain.height * dpr;
      for (var i = rain.length - 1; i >= 0; i--) {
        const r = rain[i];
        var real_x = r.x * dpr;
        var real_y = r.y * dpr;
        ctx.moveTo(real_x, real_y);
        // magic number 1.5 compensates for lack of trig in drawing angled rain
        ctx.lineTo(
          real_x - demo.wind * r.z * dpr * 1.5,
          real_y - rain_height * r.z,
        );
      }
      ctx.lineWidth = Rain.width * dpr;
      ctx.strokeStyle = demo.rain_color;
      ctx.stroke();

      // draw splash drops (just copy pre-rendered canvas)
      for (var i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        var real_x = d.x * dpr - d.radius;
        var real_y = d.y * dpr - d.radius;
        ctx.drawImage(d.canvas, real_x, real_y);
      }
    };

    demo.init();
  }, []);

  return (
    <div className={styles.Atmospheres_rain}>
      <canvas id="canvas-rain" />
    </div>
  );
};

export default RainEffect;
