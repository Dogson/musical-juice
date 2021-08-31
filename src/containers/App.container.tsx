import React, { useEffect } from 'react';

import Atmospheres from '../components/atmospheres/Atmospheres.component';
import Moods from '../components/moods/Moods.component';
import YoutubeVideo from '../components/youtube-video/YoutubeVideo.component';
import useAppContextManager from '../hooks/useAppContextManager';
import PageLayout from '../layout/page/Page.layout';

const AppContainer: React.FC = () => {
  const { loadData, currentMix } = useAppContextManager();

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <PageLayout>
      {!currentMix ? (
        <div>LOADING</div>
      ) : (
        <>
          <YoutubeVideo key={currentMix.id} />
          <div style={{ position: 'absolute', zIndex: 2 }}>
            <Atmospheres />
            <Moods />
          </div>
        </>
      )}
    </PageLayout>
  );
};

export default AppContainer;
