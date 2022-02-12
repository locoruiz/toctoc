import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import './home.css';
import vector7 from '../../../assets/vector7.svg';
import group129 from '../../../assets/group129.svg';
import vector6 from '../../../assets/vector6.svg';
import casa from '../../../assets/casa.svg';
import reloj from '../../../assets/reloj.svg';
import user from '../../../assets/user.svg';
import check from '../../../assets/check.svg';
import mano from '../../../assets/mano.png';
import venado from '../../../assets/venado.svg';
import bristar from '../../../assets/bristar.svg';
import madepa from '../../../assets/madepa.svg';
import lineasIzq from '../../../assets/lineas-izq.svg';
import flecha from '../../../assets/flecha.svg';
import vector8 from '../../../assets/vector8.svg';

class Home extends Component {
    
    render() {
        return (
            <>
            <div className='recuadro1'>
                <h1 className='titulo'>La forma más fácil<br/> y confiable de<br/> cuidar tu hogar</h1>
                <p className='subtitulo1'>¿Querés dejar implecable tu:</p>
                <div className='barra botones'><Button variant='primary' size='lg'>Hogar</Button> <Button variant='secondary' size='lg'>Empresa</Button> </div>
            </div>
            <div className="mano">
                <img src={mano} alt='mano limpiando'/>
                <div className='porcientos'>
                    <div className="redondo"><span>+80</span><span>Profesionales en limpieza</span></div>
                    <div className="redondo"><span style={{color: '#D888A2'}}>6 <span style={{fontSize: 'clamp(20px, 2vw, 33px)'}}>mil</span></span><span>Hogares atendidos</span></div>
                    <div className="redondo"><span>+3</span><span>Años de experiencia</span></div>
                </div>
            </div>
            <img src={lineasIzq} alt="lineas" className="lineas-izq" />
            <img className="recuadro2" src={vector7}/>
            <img src={group129} alt="lines" className="recuadro3" />
            <img src={vector6} alt='figure' className='recuadro4'/>
            
            <div className="barra-medio">
                <img src={flecha} alt="flecha" />
                <img src={venado} alt="Grupo Venado" />
                <img src={bristar} alt="bristar"  />
                <img src={madepa} alt="madepa"  />
            </div>
            <div style={{position: 'relative', zIndex: '4'}}>
                <img style={{position: 'absolute', top: '-100px', left: '-50px', maxWidth: '50%'}} src={vector8}/>
            </div>
            <div className="recuadro5">
                <span>¿Cómo funciona?</span>
                <span>Paso a Paso</span>
            </div>

            <div className="pasos">
                <div>
                    <div className="numero">1<img src={casa} alt='casa' className="logo" /></div>
                    <div className="tit">Cuéntanos un poco de tu hogar</div>
                    <div className="descripcion">La cantidad de cuartos y baños con  la que cuentas.</div>
                </div>
                <div>
                    <div className="numero">2<img src={reloj} alt='relog' className="logo" /></div>
                    <div className="tit">Selecciona horario y fecha</div>
                    <div className="descripcion">Podés seleccionar la recurrencia de tu servicio (por única vez, semanal, mensual).</div>
                </div>
                <div>
                    <div className="numero">3<img src={user} alt='user' className="logo" /></div>
                    <div className="tit">Asignaremos la agente profesional  perfecta para ti</div>
                    <div className="descripcion">Luego de asignarte la agente profesional, recibirás un mensaje de confirmación del servicio.</div>
                </div>
                <div>
                    <div className="numero">4<img src={check} alt='check' className="logo" /></div>
                    <div className="tit">Relájate y disfruta de tu hogar</div>
                    <div className="descripcion">Ponte cómodo que dejaremos brillando tu hogar</div>
                </div>
            </div>
            <div className="comentarios">
                <h3>Comentarios destacados</h3>
                <div className="coments">
                    <div className="cards"></div>
                    <div className="cards"></div>
                    <div className="cards"></div>
                </div>
            </div>
            </>
        );
    }
}

export default Home;