import React, { useState, useEffect, useMemo } from 'react';
import { Container, Table, Button, Modal, Tabs, Tab } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import api from '../../api';
import Lottie from 'react-lottie';
import loadingData from '../../../assets/loading.json';
import { formatHora2 } from '../../components/Calculadora/Calculadora';
import whatsapp from '../../../assets/whatsapp.svg';

const cargandoOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
};
const Servicios = (props) => {
    
    let esAdmin = props.userStore.user.role === 'Admin';

    const [servicios, setServicios] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [servicio, setServicio] = useState(undefined);
    const [key, setKey] = useState('activos');
    useEffect(() => {
        setCargando(true);
        let url = esAdmin ? '/api/services/all' : '/api/services';

        api().get(url).then(res => {
            setServicios(res.data);
        })
        .finally(() => {
            setCargando(false);
        });
    }, [esAdmin]);

    function parseDate(s) {
        var from = s.split("-");
        return new Date(from[0], from[1] - 1, from[2]);
    }

    function formatFecha(fecha) {
        let f = parseDate(fecha);
        let hoy = new Date();
        if (f.getDate() === hoy.getDate() && f.getMonth() === hoy.getMonth() && hoy.getFullYear() === f.getFullYear()) {
            return 'Hoy';
        }
        let dia = f.getDate() < 10 ? '0'+f.getDate() : f.getDate();
        return dia+'/'+(f.getMonth() + 1)+'/'+f.getFullYear();
    }

    const activos = useMemo(() => {
        return servicios.filter(item => parseDate(item.fecha) >= new Date()).sort((a, b) => parseDate(a.fecha) - parseDate(b.fecha));
    }, [servicios]);

    const pasados = useMemo(() => {
        return servicios.filter(item => parseDate(item.fecha) < new Date()).sort((a, b) => parseDate(a.fecha) - parseDate(b.fecha));
    }, [servicios]);


    function urlDeDireccion(dir) {
        return `http://maps.google.com/maps?q=${dir.latitud},${dir.longitud}`;
    }

    function imprimirArray(arr) {
        return (
            arr.length > 0 ?
                <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th style={{width: '30px'}}>Codigo</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Tipo</th>
                        {
                            esAdmin && 
                            <th>Nombre</th>
                        }
                        <th>Dirección</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        arr.map((item, index) => {
                            let tipo = '';
                            switch(item.tipo) {
                                case 'normal':
                                    tipo = 'Limpieza estándar'
                                    break;
                                case 'profunda':
                                    tipo = 'Limpieza profunda'
                                    break;
                                case 'planchar':
                                    tipo = 'Planchado';
                                    break;
                            }
                            
                            let hora = JSON.parse(item.hora);
                            return (
                                <tr key={index}>
                                    <td className='text-right'>
                                    <Button variant='link' onClick={() => {setServicio(item)}}>{item.id}</Button>
                                    </td>
                                    <td className='text-right'>
                                        {formatFecha(item.fecha)}
                                    </td>
                                    
                                    <td className='text-right'>{formatHora2(hora.horaInicial)}</td>
                                    <td>{tipo}</td>
                                    {
                                        esAdmin && 
                                        <td>{item.nombre}</td>
                                    }
                                    <td><a target="_blank" href={urlDeDireccion(item.direccion)}>{item.direccion.description}</a></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
                </Table>
                :
                null
        )
    }

    if (cargando) {
        return (<Container>
            <h1>Servicios Programados</h1>
            <Lottie 
                    options={cargandoOptions}
                    height={150}
                    width={150}
                />
        </Container>);
    }

    let titulo = 'Servicio';
    let tipoCasa = '';
    let hora = servicio ? JSON.parse(servicio.hora) : 0;
    let tieneMateriales = '';
    let extras = '&lt;ul&gt;';
    let materialesExtras = '&lt;ul&gt;';
    let nombre = '';
    let numero = '';

    if (servicio) {
        nombre = servicio.nombre;
        numero = servicio.numero;
        switch(servicio.tipo) {
            case 'normal':
                titulo = 'Limpieza estándar de '
                break;
            case 'profunda':
                titulo = 'Limpieza profunda de '
                break;
            case 'planchar':
                titulo = 'Planchado en ';
                break;
        }
        
        switch(servicio.tipoCasa) {
            case 'estudio':
                tipoCasa = 'monoambiente';
                break;
            case 'departamento':
                tipoCasa = 'departamento';
                break;
            case 'casa':
                tipoCasa = 'casa';
                break;
        }
        titulo += tipoCasa;

        if (servicio.tipo === 'profunda') {
            switch(servicio.tipoProfunda) {
                case 'rutina':
                    titulo += ' - De rutina';
                    break;
                case 'mudanza':
                    titulo += ' - Pre Mudanza';
                    break;
                case 'construccion':
                    titulo += ' - Post Construccion';
                    break;
            }
        }
        let opcionales = JSON.parse(servicio.opcionales);
        opcionales.forEach(item => {
            if (item.seleccionado) {
                if (item.id == 4) {
                    tieneMateriales = 'Si';
                } else {
                    extras += '&lt;li&gt;'+item.texto+'&lt;/li&gt;';
                }
            }
        });
        extras += '&lt;/ul&gt;';
        let mExtras = JSON.parse(servicio.materialesExtras);
        if (mExtras.acido) {
            materialesExtras += '&lt;li&gt;Ácido Nítrico&lt;/li&gt;';
        }
        if (mExtras.inox) {
            materialesExtras += '&lt;li&gt;Lustra Inox&lt;/li&gt;';
        }
        if (mExtras.muebles) {
            materialesExtras += '&lt;li&gt;Lustra Muebles&lt;/li&gt;';
        }

        materialesExtras += '&lt;/ul&gt;';
    }

    function htmlDecode(input){
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }

    return (
        <Container>
            <h1>Servicios Programados</h1>
            <p>
                {
                    servicios.length === 0 ?
                    (esAdmin ? 'No hay servicios agendados' : 'Usted no tiene servicios agendados') :
                    (esAdmin ? 'Estos son todos los servicios agendados' : 'Estos son sus servicios agendados')
                }
            </p>

            <Tabs
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
                >
                <Tab eventKey="activos" title="Activos">
                    {
                        imprimirArray(activos)
                    }
                    {
                        activos.length === 0 &&
                        <p className='text-center mt-3'>
                            {esAdmin ? 'No hay servicios activos' : 'No tienes servicios activos'}
                        </p>
                    }
                </Tab>
                <Tab eventKey="pasados" title="Pasados">
                    {
                        imprimirArray(pasados)
                    }
                    
                    {
                        pasados.length === 0 &&
                        <p className='text-center mt-3'>{
                            esAdmin ? 'No hay servicios pasados' : 'No tienes servicios pasados'
                        }</p>
                    }
                </Tab>
                </Tabs>

            <Modal 
                show={servicio !== undefined}
                onHide={() => {setServicio(undefined)}}
                size='lg'
            >
                <Modal.Header closeButton>
                <Modal.Title>{titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        servicio &&
                        <Table striped bordered responsive>
                            <tbody>
                                {
                                    esAdmin && 
                                    <>
                                        <tr>
                                            <th className="w-25" scope="row"><strong>Nombre</strong></th>
                                            <td>{nombre}</td>
                                            <th className="w-25" scope="row"><strong>Numero</strong></th>
                                            <td>{numero}</td>
                                        </tr>
                                    </>
                                }
                                <tr>
                                    <th className="w-25" scope="row"><strong>Fecha</strong></th>
                                    <td>{formatFecha(servicio.fecha)}</td>
                                    <th className="w-25" scope="row"><strong>Hora</strong></th>
                                    <td>{formatHora2(hora.horaInicial)}</td>
                                </tr>
                                <tr>
                                    <th className="w-25" scope="row"><strong>Dirección</strong></th>
                                    <td colSpan={3}>{`${servicio.direccion.direction} `} <a style={{float:'right'}} target="_blank" href={urlDeDireccion(servicio.direccion)}>Ver mapa</a></td>
                                </tr>
                                <tr>
                                    <th className="w-25" scope="row"><strong>Referencia</strong></th>
                                    <td colSpan={3}>{`${servicio.direccion.referencia}`}</td>
                                </tr>
                                <tr>
                                    <th className="w-25" scope="row"><strong>Cantidad de profesionales</strong></th>
                                    <td>{servicio.profesionales}</td>
                                    <th className="w-25" scope="row"><strong>Horas Compartidas</strong></th>
                                    <td>{servicio.horasCompartidas}</td>
                                </tr>
                                
                                {
                                    servicio.tipo !== 'planchar' && 
                                    <>
                                    <tr>
                                        <th className="w-25" scope="row"><strong>Cuartos</strong></th>
                                        <td>{servicio.cuartos}</td>
                                        <th className="w-25" scope="row"><strong>Baños</strong></th>
                                        <td>{servicio.banos}</td>
                                    </tr>
                                    <tr>
                                        <th className="w-25" scope="row"><strong title='Requiere materiales de limpieza'>Materiales</strong></th>
                                        <td>{tieneMateriales}</td>
                                        <th className="w-25" scope="row"><strong>Tareas</strong></th>
                                        <td dangerouslySetInnerHTML={{ __html: htmlDecode(extras) }}/>
                                    </tr>
                                    <tr>
                                        <th className="w-25" scope="row"><strong>Materiales extras</strong></th>
                                        <td dangerouslySetInnerHTML={{ __html: htmlDecode(materialesExtras) }}/>
                                        <th className="w-25" scope="row"><strong>Horas extras</strong></th>
                                        <td>{servicio.horasPlanchado}</td>
                                    </tr>
                                    </>
                                }
                                <tr>
                                    {
                                        servicio.tipo !== 'planchar' ?
                                        <>
                                        <th className="w-25" scope="row"><strong>Total horas</strong></th>
                                        <td>{servicio.horas+servicio.horasPlanchado}</td>
                                        </> :
                                        <td colSpan={2}></td>
                                    }
                                    <th className="w-25" scope="row" style={{fontSize: '25px'}}><strong>Precio total</strong></th>
                                    <td style={{textAlign: 'right', fontSize: '25px'}}><b>Bs. {servicio.precio.toFixed(2)}</b></td>
                                </tr>
                            </tbody>
                        </Table>
                    }
                    {
                        !esAdmin &&
                        <div style={{textAlign: 'left'}}>En caso de querer modificar la solicitud <a target="_blank" href='https://api.whatsapp.com/send?phone=59177352532&text=Buenas%20tardes%2C%20quiero%20modificar%20la%20orden%20*2*%20por%20favor'>comuniquese con nosotros <img src={whatsapp} style={{opacity: '30%', marginLeft: '5px'}}/></a></div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => {setServicio(undefined)}}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default inject('userStore')(observer(Servicios));