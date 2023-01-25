import React, { useEffect } from 'react';

import Homepage from '../components/homepage/Homepage.component';
import useAppContextManager from '../hooks/useAppContextManager';
import PageLayout from '../layout/page/Page.layout';

const HomeContainer: React.FC = () => {
  const { loadData } = useAppContextManager();

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <PageLayout>
      <Homepage />
    </PageLayout>
  );
};

export default HomeContainer;
