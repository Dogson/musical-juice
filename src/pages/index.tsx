import React, { useEffect } from 'react';

import YoutubeVideo from '../components/youtube-video/YoutubeVideo.component';
import { AppProvider } from '../context/AppContext';
import useAppContextManager from '../hooks/useAppContextManager';
import PageLayout from '../layout/page/Page.layout';

const IndexPage: React.FC = () => {
  const {
    loadData,
    mixes,
    moods,
    atmospheres,
    changeAtmosphere,
    nextMix,
    changeMood,
    currentAtmosphere,
    currentMix,
    currentMood,
  } = useAppContextManager();

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <PageLayout>
      {mixes.length === 0 ? (
        <div>LOADING</div>
      ) : (
        <AppProvider
          value={{
            mixes,
            moods,
            atmospheres,
            nextMix,
            changeMood,
            changeAtmosphere,
            currentMood,
            currentAtmosphere,
            currentMix,
          }}
        >
          <YoutubeVideo />
        </AppProvider>
      )}
    </PageLayout>
  );
};

export default IndexPage;
