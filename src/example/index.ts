// example/index.ts

import { createCoreFactory } from '../lib/coreFactory';
import { services } from './services/_services';
import { store } from './store/_store';
import { DependenciesType } from './utils/types';

export const CoreClass = createCoreFactory<DependenciesType>()(store, services);

const core = new CoreClass();

const myAuthService = core.getService('AuthService');
myAuthService.authenticate();
