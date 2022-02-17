import React from 'react';

import useAppContextManager from '../../hooks/useAppContextManager';

const Moods: React.FC = () => {
  const { moods, currentMood, changeMood } = useAppContextManager();
  return (
    <select value={currentMood} onChange={(e) => changeMood(e.target.value)}>
      {moods.map((mood) => (
        <option value={mood} key={mood}>
          {mood}
        </option>
      ))}
    </select>
  );
};

export default Moods;
