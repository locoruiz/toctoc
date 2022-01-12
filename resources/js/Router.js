import React from 'react';
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';

import Home from './components/Home/Home';
import Login from './views/Login/Login';
import NotFound from './views/NotFound/NotFound'
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

// User is logger in
import PrivateRoute from './PrivateRoute';
import Direcciones from './views/user/Direcciones/Direcciones';
import Servicios from './views/Servicios/Servicios';
import Calculadora from './components/Calculadora/Calculadora';

export const Main = props => (
    <div className='frame852'>
    <Header/>
    <Switch>
        {/*user might be logged in*/}
        <Route exact path='/' component={Home}/>
        <Route exact path='/solicitar' component={Calculadora}/>
        {/*User will login*/}
        <Route path='/login' component={Login}/>
        {/*user is logged in*/}
        <PrivateRoute path='/direcciones' component={Direcciones}/>
        <PrivateRoute path='/servicios' component={Servicios}/>
        {/*Not found*/}
        <Route component={NotFound}/>
    </Switch>
    <Footer/>
    </div>
)
