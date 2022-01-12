import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import './home.css';

class Home extends Component {
    
    render() {
        return (
            <div className='recuadro1'>
                <h1 className='titulo'>La forma más fácil<br/> y confiable de<br/> cuidar tu hogar</h1>
                <p className='subtitulo1'>¿Querés dejar implecable tu:</p>
                <div className='barra botones'><Button variant='primary' size='lg'>Hogar</Button> <Button variant='secondary' size='lg'>Empresa</Button> </div>
            </div>
        );
    }
}

export default Home;