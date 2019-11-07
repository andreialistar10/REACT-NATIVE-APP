import React from 'react';
import {getLogger, navService} from './core';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {ProductEdit, ProductList, ProductStore} from "./products";

const log = getLogger('App');

const MainNavigator = createStackNavigator({
    productList: {screen: ProductList},
    productEdit: {screen: ProductEdit},
});

const AppContainer = createAppContainer(MainNavigator);

const App = () => {
    log('render');
    return (
        <ProductStore>
            <AppContainer ref={navigationRef => {
                navService.setTopLevelNavigator(navigationRef);
            }}/>
        </ProductStore>
    )
};

export default App;
