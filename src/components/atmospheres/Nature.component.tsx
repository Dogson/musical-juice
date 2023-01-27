import React from 'react';
import Particles from 'react-tsparticles';
import { ISourceOptions } from 'tsparticles';

import leaf1 from './assets/leaf1.svg';
import leaf2 from './assets/leaf2.svg';
import leaf3 from './assets/leaf3.svg';
import leaf4 from './assets/leaf4.svg';
import * as styles from './Atmospheres.module.scss';

const NatureEffect: React.FC = () => {
  const options = {
    particles: {
      number: {
        value: 50,
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
        image: [
          {
            src: leaf1,
            width: 100,
            height: 100,
          },
          {
            src: leaf2,
            width: 100,
            height: 100,
          },
          {
            src: leaf3,
            width: 100,
            height: 100,
          },
          {
            src: leaf4,
            width: 100,
            height: 100,
          },
        ],
      },
      opacity: {
        value: 1,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.7,
          sync: false,
        },
      },
      size: {
        value: 25,
        random: true,
        anim: {
          enable: false,
          speed: 4,
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
      rotate: {
        random: true,
        animation: {
          enable: true,
          speed: 7,
        },
      },
      move: {
        enable: true,
        speed: 6,
        direction: 'bottom',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
  } as ISourceOptions;

  return (
    <div className={styles.Atmospheres_nature}>
      <Particles params={options} />
    </div>
  );
};

export default NatureEffect;
