import React from 'react';
import Particles from 'react-tsparticles';
import { ISourceOptions } from 'tsparticles';

import birdSvg from './assets/bird.svg';
import * as styles from './Atmospheres.module.scss';

const NatureEffect: React.FC = () => {
  const options = {
    particles: {
      number: {
        value: 30,
        density: {
          enable: true,
          value_area: 3000,
        },
      },
      color: {
        value: '#fd7907',
      },
      shape: {
        type: 'image',
        stroke: {
          width: 0,
          color: '#000000',
        },
        polygon: {
          nb_sides: 3,
        },
        image: {
          src: birdSvg,
          width: 100,
          height: 100,
        },
      },
      opacity: {
        value: 0.8,
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 20,
        random: false,
        anim: {
          enable: false,
          speed: 5,
          size_min: 18,
          sync: false,
        },
      },
      line_linked: {
        enable: false,
        distance: 500,
        color: '#ffffff',
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 6,
        direction: 'right',
        random: false,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: false,
          mode: 'bubble',
        },
        onclick: {
          enable: false,
          mode: 'repulse',
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 0.5,
          },
        },
        bubble: {
          distance: 400,
          size: 4,
          duration: 0.3,
          opacity: 1,
          speed: 3,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
        push: {
          particles_nb: 4,
        },
        remove: {
          particles_nb: 2,
        },
      },
    },
    retina_detect: true,
  } as ISourceOptions;

  return (
    <div className={styles.Atmospheres_fire}>
      <Particles params={options} />
    </div>
  );
};

export default NatureEffect;
