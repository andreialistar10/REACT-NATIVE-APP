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
        log('render');
        return (
            <Provider value={this.state}>
                {this.props.children}
            </Provider>
        )
    }
}