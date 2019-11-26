import { createStackNavigator } from 'react-navigation-stack';

import { Login } from "./Login";

export const Auth = createStackNavigator({
    Login: {screen: Login},
});

export * from './AuthLoading';
export * from './AuthStore';
