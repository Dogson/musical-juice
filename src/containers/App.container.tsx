import React, { useEffect, useState } from 'react';

import Atmospheres from '../components/atmospheres/Atmospheres.component';
import Homepage from '../components/homepage/Homepage.component';
import Moods from '../components/moods/Moods.component';
import YoutubeVideo from '../components/youtube-video/YoutubeVideo.component';
import useAppContextManager from '../hooks/useAppContextManager';
import PageLayout from '../layout/page/Page.layout';

const AppContainer: React.FC = () => {
  const { loadData, currentMix } = useAppContextManager();
  const [hasClicked, setHasClicked] = useState(false);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <PageLayout>
      {!hasClicked || !currentMix ? (
        <Homepage onClick={() => setHasClicked(true)} />
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
