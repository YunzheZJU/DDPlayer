/**
 * Created by Yunzhe on 2018/10/11.
 */

'use strict';

import localForage from 'localforage';

export default {
    createStorage: storeName => localForage.createInstance({
        name: 'DDMusic',
        storeName,
    }),
};