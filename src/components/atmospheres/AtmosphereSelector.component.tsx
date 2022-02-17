import React from 'react';

import useAppContextManager from '../../hooks/useAppContextManager';
import * as styles from './Atmospheres.module.scss';

const AtmosphereSelector: React.FC = () => {
  const { atmospheres, currentAtmosphere, changeAtmosphere } =
    useAppContextManager();

  return (
    <div className={styles.AtmosphereSelector}>
      <select
        value={currentAtmosphere}
        onChange={(e) => changeAtmosphere(e.target.value)}
      >
        {atmospheres.map((atm) => (
          <option value={atm} key={atm}>
            {atm}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AtmosphereSelector;
