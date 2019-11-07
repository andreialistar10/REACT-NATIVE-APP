import React from 'react';
import { getLogger } from './core';
import {ProductList, ProductStore} from "./products";

const log = getLogger('App');

const App = () => {
    log('render');
    return(
        <ProductStore>
            <ProductList/>
        </ProductStore>
    )
};

export default App;
