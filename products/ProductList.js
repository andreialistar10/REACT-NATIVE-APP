import React, {Component} from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {getLogger, httpApiUrl} from "../core";
import Product from "./Product";

const log = getLogger('ProductList');

export class ProductList extends Component {

    constructor(props) {
        super(props);
        log('constructor');
        this.state = {
            isLoading: false,
            products: [],
            loadingError: null,
        };
    }

    componentDidMount() {
        this.loadProducts();
        log('componentDidMount');
    }

    componentWillUnmount() {
        log('componentWillUnmount');
    }

    loadProducts = () => {
        log("load products started");
        this.setState({isLoading: true, loadingError: null});
        fetch(`${httpApiUrl}/entities`)
            .then(response => {
                log('response: ', response);
                return response.json();
            })
            .then(json => {
                log('load products succeeded', json);
                this.setState({isLoading: false, products: json})
            })
            .catch(loadingError => {
                log('load products failed', loadingError);
                this.setState({isLoading: false, loadingError})
            })
    };

    render() {
        const  { products, loadingError, isLoading } = this.state;
        return (
            <View style={styles.container}>
                <ActivityIndicator animating = {isLoading} size = "large"/>
                {loadingError && <Text> {loadingError.message || 'Loading error'}</Text>}
                {products && products.map(product => <Product key={product.id} product={product}/>)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
    },
});
