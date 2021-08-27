import { IAppContext } from '../context/AppContext.types';

export interface IUseAppContextManager extends IAppContext {
  loadData: () => void;
}
