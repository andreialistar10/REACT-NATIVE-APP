import React from 'react';
import {getLogger, navService} from './core';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {Products, ProductStore} from "./products";
import {Auth, AuthLoading} from "./auth";

const log = getLogger('App');

const MainNavigator = createSwitchNavigator(
    { AuthLoading, Products, Auth},
    { initialRouteName: 'AuthLoading' },
);

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
