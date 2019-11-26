import React from 'react';
import { createStackNavigator } from "react-navigation-stack";

import { ProductEdit } from "./ProductEdit";
import { ProductList } from "./ProductList";

export const Products = createStackNavigator({
    productList: {screen: ProductList},
    productEdit: {screen: ProductEdit},
});

export * from './ProductStore';
