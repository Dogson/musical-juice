import React from 'react';

import YoutubeVideo from '../components/youtube-video/YoutubeVideo.component';
import PageLayout from '../layout/page/Page.layout';

const IndexPage: React.FC = () => (
  <PageLayout>
    <YoutubeVideo />
  </PageLayout>
);

export default IndexPage;