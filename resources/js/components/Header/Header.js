import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import logo from '../../../assets/logo.svg';
import useWindowWidth from '../../hooks/useWindowWidth';

const Header = props => {
    const windowWidth = useWindowWidth();

    const logOut = () => {
        props.userStore.logOut();
        props.history.push('/login');
    }

    function irA(url) {
        props.history.push(url);
    }

    let esAdmin = props.userStore.user && props.userStore.user.role === 'Admin';

    let linkStyles = {
        fontWeight: 'bold',
        fontSize: '16px',
        lineHeight: '19px',
        color: '#7D8790'
    }

    let estaEnSolicitar = props.location.pathname === '/solicitar';

    let estiloToggle = {margin: '20px', borderRadius: '5px'}

    if (estaEnSolicitar) {
        estiloToggle.visibility = 'hidden';
        estiloToggle.margin = 0;
    }

    const navStyle = {alignItems: 'center', borderRadius: '10px'};

    if (windowWidth < 760) {
        navStyle.backgroundColor = '#33333333';
    }
 

    return (
        <Navbar  expand="md" style={{position: 'relative', zIndex: 5}}>
            {
                props.location.pathname !== '/solicitar' &&
                <Navbar.Brand href="#" onClick={() => {irA('/')}} >
                    <img style={{height: '50px', marginTop: '10px', marginLeft: '10px'}} src={logo} />
                </Navbar.Brand>
            }

            <Navbar.Toggle aria-controls={"basic-navbar-nav"} style={estiloToggle}/>
            
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto" style={navStyle}>
                    {
                        props.location.pathname !== '/' &&
                        <Nav.Link href="#" onClick={() => {irA('/')}} style={linkStyles}>Inicio</Nav.Link>
                    }
                    {
                        props.location.pathname !== '/solicitar' &&
                        <Nav.Link onClick={() => {irA('/solicitar')}}  style={linkStyles}>Solicitar</Nav.Link>
                    }
                    {
                        props.userStore.isLoggedIn && props.location.pathname !== '/direcciones' &&
                        <Nav.Link  onClick={() => {irA('/direcciones')}}  style={linkStyles}>Mis direcciones</Nav.Link>
                    }
                    {
                        props.userStore.isLoggedIn && props.location.pathname !== '/servicios' &&
                        <Nav.Link  onClick={() => {irA('/servicios')}}  style={linkStyles}>
                            {
                                esAdmin ? 'Todos los servicios' : 'Mis Servicios'
                            }
                        </Nav.Link>
                    }
                    
                    {
                        props.userStore.isLoggedIn &&
                        <Nav.Link onClick={logOut}  style={linkStyles}>Salir</Nav.Link>
                    }
                    {
                        !props.userStore.isLoggedIn && 
                        props.location.pathname !== '/login' &&
                        <><Nav.Link onClick={() => {irA('/login')}}  style={linkStyles}>Ingresar</Nav.Link></>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default inject('userStore')(withRouter(observer(Header)));