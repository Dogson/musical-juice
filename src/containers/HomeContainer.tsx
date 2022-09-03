import React, { useEffect, useState } from 'react';

import AtmospheresEffects from '../components/atmospheres/AtmospheresEffects.component';
import Homepage from '../components/homepage/Homepage.component';
import YoutubeVideo from '../components/youtube-video/YoutubeVideo.component';
import useAppContextManager from '../hooks/useAppContextManager';
import PageLayout from '../layout/page/Page.layout';

const HomeContainer: React.FC = () => {
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
          <AtmospheresEffects />
        </>
      )}
    </PageLayout>
  );
};

export default HomeContainer;
