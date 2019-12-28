import React from 'react';
import { createStackNavigator } from "react-navigation-stack";

import { ProductEdit } from "./ProductEdit";
import { ProductList } from "./ProductList";
import { MyMap } from "./MyMap";

export const Products = createStackNavigator({
    productList: {screen: ProductList},
    productEdit: {screen: ProductEdit},
    mapView: {screen: MyMap},
});

export * from './ProductStore';
