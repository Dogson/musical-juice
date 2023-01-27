import React from 'react';
import Particles from 'react-tsparticles';
import { ISourceOptions } from 'tsparticles';

import * as styles from './Atmospheres.module.scss';

const FireEffect: React.FC = () => {
  const options = {
    particles: {
      number: {
        value: 400,
        density: {
          enable: true,
          value_area: 3000,
        },
      },
      color: {
        value: '#fd7907',
      },
      shape: {
        type: 'circle',
        stroke: {
          width: 0,
          color: '#000000',
        },
        polygon: {
          nb_sides: 3,
        },
        image: {
          src: 'img/github.svg',
          width: 100,
          height: 100,
        },
      },
      opacity: {
        value: 0.8,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: false,
          speed: 5,
          size_min: 1,
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
        speed: 10,
        direction: 'top',
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
    <div className={styles.Atmospheres_fire}>
      <Particles params={options} />
    </div>
  );
};

export default FireEffect;
