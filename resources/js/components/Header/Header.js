import React, { Component } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import logo from '../../../assets/toctoc.jpeg';

const Header = props => {
    const logOut = () => {
        props.userStore.logOut();
        props.history.push('/login');
    }

    function irA(url) {
        props.history.push(url);
    }

    let esAdmin = props.userStore.user && props.userStore.user.role === 'Admin';

    let display  = props.location.pathname !== '/' ? 'd-block' : 'd-none';

    return (
        <Navbar  expand="md">
            <Navbar.Brand href="#" onClick={() => {irA('/')}} className={display+' d-md-block'}>
                <img src={logo} height='100'/>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" style={{marginBottom: '20px'}}/>
            
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Link href="#" onClick={() => {irA('/')}}>Inicio</Nav.Link>
                    
                    {
                        props.location.pathname !== '/solicitar' &&
                        <Nav.Link onClick={() => {irA('/solicitar')}}>Solicitar</Nav.Link>
                    }
                    {
                        props.userStore.isLoggedIn && props.location.pathname !== '/direcciones' &&
                        <Nav.Link  onClick={() => {irA('/direcciones')}}>Mis direcciones</Nav.Link>
                    }
                    {
                        props.userStore.isLoggedIn && props.location.pathname !== '/servicios' &&
                        <Nav.Link  onClick={() => {irA('/servicios')}}>
                            {
                                esAdmin ? 'Todos los servicios' : 'Mis Servicios'
                            }
                        </Nav.Link>
                    }
                    
                    {
                        props.userStore.isLoggedIn &&
                        <Nav.Link onClick={logOut}>Salir</Nav.Link>
                    }
                    {
                        !props.userStore.isLoggedIn && 
                        props.location.pathname !== '/login' &&
                        <><Nav.Link onClick={() => {irA('/login')}}>Ingresar</Nav.Link></>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default inject('userStore')(withRouter(observer(Header)));