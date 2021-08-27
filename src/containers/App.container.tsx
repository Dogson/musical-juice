import React, { useEffect } from 'react';

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
      {!currentMix ? <div>LOADING</div> : <YoutubeVideo key={currentMix.id} />}
    </PageLayout>
  );
};

export default AppContainer;
