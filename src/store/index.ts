/**
 * @author nstCactus
 * @date 12/01/2018 10:28
 */

import Vue from 'vue';
import Vuex, {StoreOptions} from 'vuex';
import {RootState} from '@/store/types';
import {authenticationVuexModule} from '@/store/modules/authentication';
import {cartVuexModule} from '@/store/modules/cart';
import {menuVuexModule} from '@/store/modules/menu';


Vue.use(Vuex);

const isDebug = process.env.NODE_ENV !== 'production';

const store: StoreOptions<RootState> = {
  strict:  isDebug,
  modules: {
    authentication: authenticationVuexModule,
    cart:           cartVuexModule,
    menu:           menuVuexModule,
  },
};

export default new Vuex.Store<RootState>(store);