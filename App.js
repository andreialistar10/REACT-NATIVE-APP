import React from 'react';
import { getLogger } from './core';
import { ProductList } from "./products";

const log = getLogger('App');

const App = () => {
    log('render');
    return (<ProductList/>)
};

export default App;
