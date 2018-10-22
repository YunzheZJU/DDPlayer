/**
 * Created by Yunzhe on 2018/10/22.
 */

'use strict';
import PRIVATE from './private';
// You must create public.js to make it work, while this is a secrete file.
import PUBLIC from './public';

const API = {
    private: PRIVATE,
};

// Hide PUBLIC in dist files !important
// noinspection JSUnresolvedVariable
if (IS_PUBLIC) {
    API.public = PUBLIC;
}

export default API;