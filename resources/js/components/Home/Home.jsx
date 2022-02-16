import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import './home.css';
import vector7 from '../../../assets/vector7.svg';
import group129 from '../../../assets/group129.svg';
import vector6 from '../../../assets/vector6.svg';
import vector9 from '../../../assets/vector9.svg';
import vector10 from '../../../assets/vector10.svg';
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
import angela from '../../../assets/angela.svg';
import lucia from '../../../assets/lucia.svg';
import medalla from '../../../assets/medalla.svg';
import agente from '../../../assets/agente.svg';
import celu from '../../../assets/celu.svg';
import PreguntasFrecuentes from '../PreguntasFrecuentes/PreguntasFrecuentes';
import { Link } from 'react-router-dom';

const Home = () => {
    console.log("render home");
    return (
        <>
        <div className='recuadro1'>
            <h1 className='titulo'>La forma más fácil<br/> y confiable de<br/> cuidar tu hogar</h1>
            <p className='subtitulo1'>Querés dejar implecable tu:</p>
            <div className='barra-botones'><Link to={'/solicitar'}><Button variant='primary' size='lg' block>Hogar</Button></Link><Link to={'/solicitar'}><Button variant='secondary' size='lg'  block>Empresa</Button></Link></div>
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
            <h3>Comentarios <br/> destacados</h3>
            <div className="comments">
                <div className="cards">
                    <img src={angela}/>
                    <img className='medalla' src={medalla}/>
                    <div>
                        <div className="nombre">Angela Martinez</div>
                        <div className="comentario">Super buena y eficiente la limpieza!</div>
                    </div>
                </div>
                <div className="cards">
                    <img src={lucia}/>
                    <img className='medalla' src={medalla}/>
                    <div>
                        <div className="nombre">Lucia Arroyo</div>
                        <div className="comentario">Super buena y eficiente la limpieza!</div>
                    </div>
                </div>
                <div className="cards">
                    <img src={lucia}/>
                    <img className='medalla' src={medalla}/>
                    <div>
                        <div className="nombre">Lucia Arroyo</div>
                        <div className="comentario">Super buena y eficiente la limpieza!</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="textos-mobile">
            <div>Confianza</div>
            <div>Agentes de Confianza</div>
        </div>
        <div className="agentes">
            
            <div className='textos'>
                <div>Confianza</div>
                <div>Agentes de Confianza</div>
                <div>Profecionales experimentados que atraviesan un periodo de adaptación para trabajar con nosotros</div>
            </div>
            <div className="agente-texto-mobile">
                Profesionales experimentados que atraviesan un período de adaptación para trabajar con nosotros.
            </div>
            <img src={agente} alt="agente" className='agente'/>
        </div>
        <div className="pagos">
            <img src={celu} alt="Pago" className="celu"/>
            <div className="pagos-text">
                <div>CONVENIENTE</div>
                <div>
                    Pago con <span className="resaltar">efectivo</span> o con transferencia <span className="resaltar">bancaria</span>
                </div>
                <div>
                    Pague con transferencia solo después de que se haya completado el servicio o en efectivo directamente a la agente profesional.
                </div>
            </div>
        </div>

        <PreguntasFrecuentes/>

        <img src={vector9} alt="simbolo" className="vector9" />
        <img src={vector10} alt="simbolo" className="vector10" />
        </>
    );
}

export default Home;