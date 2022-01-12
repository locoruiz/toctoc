import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Main } from './Router';
import { Provider } from 'mobx-react';
import UserStore from './stores/UserStore';
import "../css/app.css";
const stores = {
    userStore: new UserStore()
}

class Index extends Component {
    render() {
        return (
            <BrowserRouter>
                <Provider {...stores}>
                    <Route component={Main}/>
                </Provider>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(<Index/>, document.getElementById('index'));