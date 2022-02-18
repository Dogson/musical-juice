import React from 'react';

import { IAppContext } from './AppContext.types';

const AppContext = React.createContext<IAppContext>({} as IAppContext);

const AppProvider = AppContext.Provider;

export default AppContext;
export { AppProvider };
