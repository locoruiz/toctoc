import React, { useState, useRef, useEffect } from 'react';
import { Container, Table, Button, Alert, Modal, Form } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import { Trash, Pen } from 'react-bootstrap-icons';
import api from '../../../api';
import { MapContainer, TileLayer, useMapEvent, Marker } from 'react-leaflet';
import './estilo.css';
import Lottie from 'react-lottie';
import loadingData from '../../../../assets/loading.json';
import quintoAnillo from '../../../../assets/quintoAnillo.json';
import octavoAnillo from '../../../../assets/octavoAnillo.json';
import urubo from '../../../../assets/urubo.json';

const cargandoOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
};

const santaCruz = [-17.782537, -63.179908];

const Direcciones = (props) => {
    const { userStore } = props;
    const [error, setError] = useState({mensaje: '', success: false});
    const [editandoDireccion, setEditandoDireccion] = useState(undefined);
    const [direccion, setDireccion] = useState({});
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(undefined);
    const [zona, setZona] = useState(-1);
    const [errorMap, setErrorMap] = useState('');
    const [errorModal, setErrorModal] = useState('');
    const [validated, setValidated] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [direccionSeleccionada, seleccionarDireccion] = useState(undefined);

    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        setCargando(true);
        api().get('/api/directions').then(res => {
            userStore.actualizarDirecciones(res.data.map(item => ({
                id: item.id,
                descripcion: item.description,
                direccion: item.direction,
                referencia: item.referencia,
                latitud: item.latitud,
                longitud: item.longitud,
                zona: item.zona
            })));
        }).finally(() => {
            setCargando(false);
        });
    }, []);

    function eliminarDireccion(id) {
        setError({mensaje: ''});
        api().delete('/api/directions/'+id).then(res => {
            if (res.data.success) {
                userStore.actualizarDirecciones(userStore.direcciones.filter(item => item.id !== id));
            }
            setError({mensaje: res.data.message, success: res.data.success});
        }).catch(e => {
            let error = e;
            if (e.response && e.response.data) {
                error = e.response.data.message ? e.response.data.message : 'Hubo un error al eliminar';
            }
            console.log('error a ver: ', error);
            setError({mensaje: error, success: false});
        });
    }

    function editarDireccion(item) {
        setError({mensaje: ''});
        setEditandoDireccion(item);
        setDireccion({...item});
        setMarker({lat: item.latitud, lon: item.longitud});
        setZona(item.zona);
        setErrorMap('');
        setValidated(false);
    }

    function guardarDireccion() {
        var todoBien = true;
        if (direccion.descripcion.length === 0) {
            todoBien = false;
        }
        
        if (direccion.direccion.length === 0) {
            todoBien = false;
        }

        if (direccion.referencia.length === 0) {
            todoBien = false;
        }
        
        if (marker === undefined) {
            todoBien = false;
            setErrorMap('Debe elegir su ubicacion en el mapa!');
        }

        setValidated(true);

        if (!todoBien) {
            return;
        }
        setGuardando(true);
        setErrorModal('');
        if (editandoDireccion.id) {
            // Estamos en edicion
            api().put('/api/directions/'+editandoDireccion.id, {
                description: direccion.descripcion,
                direction: direccion.direccion,
                referencia: direccion.referencia,
                latitud: marker.lat,
                longitud: marker.lon,
                zona
            }).then(res => {
                console.log(res.data);
                if (res.data.success) {
                    // actualizar las direcciones
                    userStore.actualizarDirecciones(userStore.direcciones.map(item => {
                        if (item.id !== editandoDireccion.id) {
                            return item
                        }
                        return {...direccion, latitud: marker.lat, longitud: marker.lon}
                    }));
                    ocultarModal();
                } else {
                    console.log(res);
                    setErrorModal('Hubo un error al guardar');
                }
            })
            .catch(e => {
                if (e.response && e.response.data) {
                    console.log(e.response.data);
                } else {
                    console.log(e);
                }
                setErrorModal('Hubo un error al guardar');
            })
            .finally(() => {
                setGuardando(false);
            });
        } else {
            api().post('/api/directions', {
                description: direccion.descripcion,
                direction: direccion.direccion,
                referencia: direccion.referencia,
                latitud: marker.lat,
                longitud: marker.lon,
                zona
            }).then(res => {
                if (res.data.success) {
                    // actualizar las direcciones
                    userStore.actualizarDirecciones([{id: res.data.direction.id, ...direccion, latitud: marker.lat, longitud: marker.lon, zona}, ...userStore.direcciones]);
                    
                    ocultarModal();
                } else {
                    console.log(res.data);
                    setErrorModal('Hubo un error al guardar');
                }
            })
            .catch(e => {
                if (e.response.data) {
                    console.log(e.response.data);
                }
                setErrorModal('Hubo un error al guardar');
            })
            .finally(() => {
                setGuardando(false);
            });
        }
    }

    function nuevaDireccion() {
        setZona(-1);
        setMarker(undefined);
        setValidated(false);
        setErrorMap('');
        setDireccion({descripcion: '', direccion: '', referencia: ''});
        setEditandoDireccion({descripcion: '', direccion: '', referencia: ''});
    }

    function cambioDescripcion(e) {
        setDireccion({...direccion, descripcion: e.target.value});
    }

    function cambioDireccion(e) {
        setDireccion({...direccion, direccion: e.target.value});
    }

    function cambioReferencia(e) {
        setDireccion({...direccion, referencia: e.target.value});
    }

    // Funciones del mapa

    function redibuarElMapa() {
        if (map) {
            map.invalidateSize();
            if (marker) {
                map.setView([marker.lat, marker.lon]);
            } else {
                map.setView(santaCruz);
            }
        }
    }

    function dentroDelPlygono(punto, poligono) {
        var polyPoints = poligono;       
        var x = punto.lat, y = punto.lng;

        console.log(polyPoints);
        console.log('x = '+x+' , y = '+y);

        var inside = false;
        for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
            var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
            var xj = polyPoints[j].lat, yj = polyPoints[j].lng;

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    }

    function SetViewOnClick() {
        const map = useMapEvent('click', (e) => {
            map.setView(e.latlng, map.getZoom(), {
                animate: true
            });
            const lat = e.latlng.lat;
            const lon = e.latlng.lng;
            let z = -1;

            if (dentroDelPlygono(e.latlng, quintoAnillo)) {
                z = 1;
            } else if (dentroDelPlygono(e.latlng, octavoAnillo)) {
                z = 2;
            } else if (dentroDelPlygono(e.latlng, urubo)) {
                z = 4;
            } else {
                z = 3; // Fuera del octavo anillo
            }
            console.log(z);
            setZona(z);
            setMarker({lat, lon});
            setErrorMap('');
        })
        return null;
    }
      
    const animateRef = useRef(false);

    function ocultarModal() {
        setEditandoDireccion(undefined)
        setValidated(false);
        setErrorModal('');
        setErrorMap('');
    }

    function elegirDireccion(dir) {
        if (props.cambioDireccion) {
            props.cambioDireccion(dir.zona);
        }
        seleccionarDireccion(dir);
    }

    if (cargando) {
        return (<Container>
            <h1>{
                props.callback ?
                'Dirección' :
                'Direcciones'
            }</h1>
            <Lottie 
                options={cargandoOptions}
                height={150}
                width={150}
            />
        </Container>);
    }

    return (
        <Container>
            <h1>{
                props.callback ?
                'Dirección' :
                'Direcciones'
            }</h1>
            {
                props.callback ?
                <p className='mt-3'>Elija la dirección que requiere el servicio</p>
                :
                <p className='mt-3'>Aqui estan todas tus direcciones registradas</p>
            }
            <div className='text-right mb-4'>
                <Button onClick={() => {nuevaDireccion()}} variant='secondary'>Agregar Dirección</Button>
            </div>
            {
                userStore.direcciones.length > 0 ?
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Descripción</th>
                            <th>Dirección</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            userStore.direcciones.map((item, index) => {
                                let style = {};
                                if (direccionSeleccionada && item.id == direccionSeleccionada.id) {
                                    style = {
                                        backgroundColor:'#D888A2'
                                    };
                                }
                                return (
                                    <tr key={index} style={style}>
                                    <td>{index + 1}</td>
                                    <td>
                                        {
                                            props.callback ?
                                            <Button variant='link' onClick={() => {elegirDireccion(item)}}>{item.descripcion}</Button>
                                            :
                                            <Button variant='link' onClick={() => {editarDireccion(item)}}>{item.descripcion}</Button>
                                        }
                                    </td>
                                    <td>{item.direccion}</td>
                                    <td className='text-center'>
                                        {
                                            props.callback &&
                                            <>
                                                <Button title='Editar dirección' variant="link" size='sm' onClick={() => {editarDireccion(item)}}><Pen/></Button> | 
                                            </>
                                        }
                                        <Button title='Eliminar dirección' variant="link" size='sm' onClick={() => {eliminarDireccion(item.id)}}><Trash/></Button>
                                    </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                    </Table>
                    :
                    <div className='text-center'>No tienes direcciones registradas</div>
            }
            
            {
                error.mensaje.length > 0 &&
                <Alert variant={error.success ? 'success' : 'danger'}>
                    {error.mensaje}
                </Alert>
            }

            {
                props.callback && direccionSeleccionada &&
                <div className='text-center mt-3'>
                    <div className='btnSolicitar' onClick={() => {props.callback(direccionSeleccionada)}}>Solicitar Servicio</div>
                </div>
            }

            <Modal 
                onEntered={() => redibuarElMapa()}
                show={editandoDireccion !== undefined} 
                onHide={() => {
                    ocultarModal();
                }}
            >
                <Modal.Header closeButton>
                <Modal.Title>{ editandoDireccion && editandoDireccion.descripcion ? 'Editar dirección' : 'Nueva dirección'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} >
                        <Form.Group  controlId="validationCustom01">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Ej. Mi Casa"
                                value={direccion.descripcion}
                                onChange={cambioDescripcion}
                            />
                            <Form.Control.Feedback type='invalid'>Debe introducir una descripcion!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="validationCustom02">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Ej. Av. Beni y segundo anillo"
                                value={direccion.direccion}
                                onChange={cambioDireccion}
                            />
                            <Form.Control.Feedback type='invalid'>Debe introducir una direccion!</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="validationCustom03">
                            <Form.Label>Referencia</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Ej. Al lado de la casa amarilla"
                                as="textarea" rows={2} 
                                value={direccion.referencia}
                                onChange={cambioReferencia}
                            />
                            <Form.Control.Feedback type='invalid'>Debe introducir una referencia!</Form.Control.Feedback>
                        </Form.Group>

                        <MapContainer 
                            center={santaCruz} 
                            zoom={13} 
                            scrollWheelZoom={false}
                            whenCreated={setMap}
                            style={{height: '300px'}}
                            >
                            <TileLayer
                            attribution='<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token={accessToken}"
                            accessToken='EcPBdZmlLwXJ4FN5TtW1ekPxpoo7h4hoJcBjboeMT5ljsZ4qrDYs45T6M1MUl0as'
                            />
                            <SetViewOnClick animateRef={animateRef} />

                            {
                                marker &&
                                <Marker position={[marker.lat, marker.lon]}/>
                            }

                        </MapContainer>
                        {
                            errorMap &&
                            <div style={{color:'#e3342f', fontSize:'80%'}}>
                                {errorMap}
                            </div>
                        }
                    </Form>
                    {
                        errorModal &&
                        <Alert className='mt-3' variant='danger'>{errorModal}</Alert>
                    }
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={() => {ocultarModal()}}>
                    Cancelar
                </Button>
                <Button variant="secondary" onClick={() => {guardarDireccion()}}  disabled={guardando}>
                    Guardar
                </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default inject('userStore')(observer(Direcciones));