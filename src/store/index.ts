import { Viewer } from 'cesium';
import { InjectionKey } from 'vue';
import { ActionTree, createStore, GetterTree, MutationTree, Store, StoreOptions } from 'vuex';

// Declare state struct
declare interface globalStore {
    viewer: Viewer | undefined;
}

// Define All params of StoreOptions
const globalStoreState: globalStore = {
    viewer: undefined,
};

const globalStoreGetters: GetterTree<globalStore, any> = {
    fakeName: (state) => state.viewer,
};

const globalStoreMutations: MutationTree<globalStore> = {
    UPDATE_FAKE_NAME(state, payload) {
        state.viewer = payload;
    },
};

const globalStoreActions: ActionTree<globalStore, any> = {
    updateFakeName({ commit }, payload) {
        commit('UPDATE_FAKE_NAME', payload);
    },
};

// Define StoreOptions
const globalStoreOption: StoreOptions<globalStore> = {
    state: globalStoreState,
    getters: globalStoreGetters,
    mutations: globalStoreMutations,
    actions: globalStoreActions,
};

// Defind current store key
export const globalStoreKey: InjectionKey<Store<globalStore>> = Symbol();

export default createStore<globalStore>(globalStoreOption);