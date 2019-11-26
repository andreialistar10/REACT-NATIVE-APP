import React, {Component} from 'react';
import {getLogger, httpApiUrl} from "../core";
import {Provider} from './context';

const log = getLogger('ProductStore');

export class ProductStore extends Component {

    constructor(props) {
        super(props);
        log('constructor');
        this.state = {
            isLoading: false,
            products: [],
            loadingError: null,
            onSubmitEditing: this.handleAddProduct,
        };
    }

    componentDidMount() {
        log('componentDidMount');
        this.loadProducts();
    }

    componentWillUnmount() {
        log('componentWillUnmount');
    }

    loadProducts = () => {
        log("load products started");
        this.setState({isLoading: true, loadingError: null});
        fetch(`${httpApiUrl}/entities`)
            .then(response => {
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

    handleAddProduct = (name, price) => this.postProduct(text, price);

    postProduct = (name, price) =>{
        log('post product started');
        return fetch(`${httpApiUrl}/entities`, {
            method: 'POST',
            body: JSON.stringify({ name, price }),
        })
            .then(response => response.json())
            .then( json => {
                log('post product succeeded', json);
                return Promise.resolve();
            })
            .catch(error => {
                log('post product failed');
                console.error(error);
                return Promise.reject();
            })
    };

    render() {
        log('render');
        return (
            <Provider value={this.state}>
                {this.props.children}
            </Provider>
        )
    }
}
