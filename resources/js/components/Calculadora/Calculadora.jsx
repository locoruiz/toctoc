import React, { useMemo, useState } from 'react';
import { Row, Col, Button, ButtonGroup, Container, Modal, Alert, Table } from 'react-bootstrap';
import './estilo.css';
import SelectorDeDias from '../SelectorDeDias/SelectorDeDias';
import {Spray, Info, Materiales, Plancha, Dolar, Ubicacion, Reloj, User} from '../iconos';
import Checkbox from '../Checkbox/Checkbox';
import { useRef } from 'react';
import Login from '../../views/Login/Login';
import Direcciones from '../../views/user/Direcciones/Direcciones';
import { inject, observer } from 'mobx-react';
import { ArrowLeft, CheckCircle, XCircle, CurrencyDollar } from 'react-bootstrap-icons';
import api from '../../api';
import Lottie from 'react-lottie';
import animData from '../../../assets/success-check.json';
import errorData from '../../../assets/process-failed.json';
import loadingData from '../../../assets/loading.json';
import { withRouter } from 'react-router-dom';
import hamburger from '../../../assets/hamburger.svg';
import dolarPrecio from '../../../assets/dolarPrecio.svg';

const cargandoOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
};
const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
};
const errorOptions = {
    loop: false,
    autoplay: true,
    animationData: errorData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
};

export function fpFix(n) {
    return Math.round(n * 100000000) / 100000000;
}
  
export function formatHora(h) {
    if (Number.isInteger(h)) {
        return  h > 1 ? h+' horas' : h+' hora';
    }
    let decimalPart = h % 1;
    let correct = fpFix(decimalPart);
    let minutos = Math.floor(correct * 60);

    return Math.floor(h)+" h "+minutos+" m";
}

export function formatHora2(h) {
    if (Number.isInteger(h)) {
        return  h < 10 ? `0${h}:00` : h+':00';
    }
    let decimalPart = h % 1;
    let correct = fpFix(decimalPart);
    let minutos = Math.floor(correct * 60);
    let horas = Math.floor(h);
    if (horas < 10) {
        horas = '0' + horas;
    }
    if (minutos < 10) {
        minutos = '0' + minutos;
    }
    return `${horas}:${minutos}`;
}

const Calculadora = (props) => {
    const [tipo, setTipo] = useState('normal'); // Tipod de limpieza, normal, profunda, planchar
    const [tipoCasa, setTipoCasa] = useState('estudio'); // tipo de casa, estudio, departamento, casa
    const [banos, setBanos] = useState(1);
    const banosText = `${banos} ${banos > 1 ? 'baños' : 'baño'}`;
    const [cuartos, setCuartos] = useState(1);
    const cuartosText = `${cuartos} ${cuartos > 1 ? 'cuartos' : 'cuarto'}`;
    const [horas, setHoras] = useState(2);
    const [horasCompartidas, setHorasCompartidas] = useState(2);
    const [profesionales, setProfesionales] = useState(1);
    const [horasText, setHorasText] = useState('0 horas');
    const [mensajeHoras, setMensajeHoras] = useState('');
    const [fecha, setFecha] = useState(undefined);
    const [horaSeleccionada, setHoraSeleccionada] = useState(-1); // es el indice del array
    const [horasDisponibles, setHorasDisponibles] = useState([]);
    const [mostrarModalMateriales, setMostrarModalMateriales] = useState(false);
    const [itemsExtra, setItemsExtra] = useState([
        {id: 1, texto: 'Interior de la heladera', seleccionado: false},
        {id: 2, texto: 'Lavado de galeria (hasta 20 m2)', seleccionado: false},
        {id: 3, texto: 'Limpieza de churrasquera', seleccionado: false},
        {id: 4, texto: 'Con materiales de limpieza', seleccionado: true}
    ]);
    const [hover, setHover] = useState('');
    const [materialesExtras, setMaterialesExtras] = useState({
        acido: false,
        inox: false,
        muebles: false
    });
    const [tipoProfunda, setTipoProfunda] = useState('rutina');
    const [direccion, setDireccion] = useState(1);
    const divRef = useRef();
    const [error, setError] = useState('');
    const [paso, setPaso] = useState(1);
    const [horasPlanchado, setHorasPlanchado] = useState(0);
    const [solicitarState, setSolicitarState] = useState({mostrarModal: false, cargando: false, success: false});
    const [mostrarModalInfo, setMostrarModalInfo] = useState(false);
    
    var horaSugerida = useMemo(() => {
        let h = 0;
        if (tipo === 'profunda') {
            if (tipoProfunda === 'rutina') {
                if (tipoCasa === 'estudio') {
                    h = 10;
                } else if (tipoCasa === 'departamento') {
                    let suma = cuartos + banos;
                    switch(suma) {
                        case 2:
                        case 3:
                            h = 10;
                            break;
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                            h = 20;
                            break;
                        case 8:
                        case 9:
                        case 10:
                            h = 30;
                            break;
                    }
                } else {
                    // casa
                    let suma = cuartos + banos;
                    switch(suma) {
                        case 2:
                        case 3:
                            h = 10;
                            break;
                        case 4:
                        case 5:
                            h = 20;
                            break;
                        case 6:
                        case 7:
                            h = 30;
                            break;
                        case 8:
                        case 9:
                            h = 40;
                            break;
                        case 10:
                        case 11:
                            h = 50;
                            break;
                        case 12:
                        case 13:
                            h = 60;
                            break;
                        case 14:
                        case 15:
                            h = 70;
                            break;
                        case 16:
                            h = 80;
                            break;
                    }
                }
            } else if (tipoProfunda === 'mudanza') {
                if (tipoCasa === 'estudio') {
                    h = 10;
                } else if (tipoCasa === 'departamento') {
                    let suma = cuartos + banos;
                    switch(suma) {
                        case 2:
                        case 3:
                            h = 10;
                            break;
                        case 4:
                        case 5:
                        case 6:
                            h = 20;
                            break;
                        case 7:
                        case 8:
                            h = 30;
                            break;
                        
                        case 9:
                        case 10:
                            h = 40;
                            break;
                    }
                } else {
                    // casa
                    let suma = cuartos + banos;
                    switch(suma) {
                        case 2:
                            h = 10;
                            break;
                        case 3:
                            h = 20;
                            break;
                        case 4:
                        case 5:
                            h = 30;
                            break;
                        case 6:
                        case 7:
                            h = 40;
                            break;
                        case 8:
                        case 9:
                            h = 50;
                            break;
                        case 10:
                        case 11:
                            h = 60;
                            break;
                        case 12:
                        case 13:
                            h = 70;
                            break;
                        case 14:
                        case 15:
                            h = 80;
                            break;
                        case 16:
                            h = 90;
                            break;
                    }
                }
            } else {
                // construccion
                if (tipoCasa === 'estudio') {
                    h = 20;
                } else if (tipoCasa === 'departamento') {
                    let suma = cuartos + banos;
                    switch(suma) {
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                            h = 20;
                            break;
                        case 6:
                        case 7:
                            h = 30;
                            break;
                        case 8:
                        case 9:
                            h = 30;
                            break;
                        case 10:
                            h = 50;
                            break;
                    }
                } else {
                    // casa
                    let suma = cuartos + banos;
                    switch(suma) {
                        case 2:
                            h = 16;
                            break;
                        case 3:
                            h = 20;
                            break;
                        case 4:
                        case 5:
                            h = 30;
                            break;
                        case 6:
                        case 7:
                            h = 40;
                            break;
                        case 8:
                        case 9:
                        case 10:
                            h = 50;
                            break;
                        case 11:
                        case 12:
                            h = 60;
                            break;
                        case 13:
                        case 14:
                            h = 70;
                            break;
                        case 15:
                        case 16:
                            h = 80;
                            break;
                    }
                }
            }
        } else if (tipo === 'normal') {
            if (tipoCasa === 'estudio') {
                h = 2;
            } else if (tipoCasa === 'departamento') {
                h = 3; // por 2 horas
                let suma = cuartos + banos;
                if (suma === 3){
                    h = 4;
                }
                if (suma > 3) {
                    h = suma;
                }
            } else {
                // casa
                h = 3; // por 2 horas
                let suma = cuartos + banos;
                
                if (suma < 7) {
                    h = suma + 1;
                }

                if (suma === 7) {
                    h = 7;
                }
                if (suma > 7 && suma < 10) {
                    h = 10;
                }
                if (suma >= 10 && suma < 12) {
                    h = 12;
                }
                if (suma === 12) {
                    h = 14;
                }
                if (suma === 13) {
                    h = 16;
                }
                if (suma === 14 || suma === 15) {
                    h = 24;
                }
                if (suma === 16) {
                    h = 32;
                }
            }
            h = h + horasPlanchado;
        } else {
            // planchado
            h = horasPlanchado;
            if (h < 3) {
                h = 3;
            }
        }
        if (tipo === 'normal') {
            itemsExtra.forEach(item => {
                if (item.id !== 4) { // Todos los anteriores, si hay que cambiar algo que mati nos diga
                    if (item.seleccionado) {
                        h += 0.5;
                    }
                }
            });
        }
        setTimeout(() => {
            actualizarHoras(h);
        }, 300);
        return h;
    }, [tipo, cuartos, banos, tipoProfunda, itemsExtra, materialesExtras, tipoCasa, horasPlanchado]);

    var precio = useMemo(() => {
        let p = 0;
        if (tipo === 'normal') {
            if (tipoCasa === 'estudio') {
                p = 100;
            } else if (tipoCasa === 'departamento') {
                p = 100;
                let suma = cuartos + banos;
                if (suma == 3 || suma == 4){
                    p = 130;
                }
                if (suma == 5) {
                    p = 150;
                }
                if (suma == 6) {
                    p = 170;
                }
                if (suma == 7) {
                    p = 190;
                }
                if (suma == 8) {
                    p = 210;
                }
                if (suma == 9) {
                    p = 230;
                }
                if (suma == 10) {
                    p = 250;
                }
            } else {
                // casa
                p = 100;
                let suma = cuartos + banos;
                if (suma === 3){
                    p = 130;
                }
                if (suma === 4) {
                    p = 150;
                }
                if (suma === 5) {
                    p = 170;
                }
                if (suma === 6) {
                    p = 190;
                }
                if (suma === 7) {
                    p = 210;
                }
                if (suma === 8) {
                    p = 300;
                }
                if (suma === 9) {
                    p = 300;
                }
                if (suma === 10 || suma === 11) {
                    p = 340;
                }
                if (suma === 12) {
                    p = 420;
                }
                if (suma === 13) {
                    p = 500;
                }
                if (suma === 14 || suma === 15) {
                    p = 630;
                }
                if (suma === 16) {
                    p = 840;
                }
            }
            if (direccion == 2) {
                p += 0; // dentro del octavo anillo
            } else if (direccion == 3) {
                p += 10;
            } else if (direccion == 4) {
                p += 40;
            }
            
        } else if (tipo === 'profunda') {
            if (tipoProfunda === 'rutina') {
                if (tipoCasa === 'estudio') {
                    p = 592.5;
                } else if (tipoCasa === 'departamento') {
                    let suma = cuartos + banos;
                    switch(suma) {
                        case 2:
                        case 3:
                            p = 592.5;
                            break;
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                            p = 960;
                            break;
                        case 8:
                        case 9:
                        case 10:
                            p = 1327.5;
                            break;
                    }
                } else {
                    // casa
                    let suma = cuartos + banos;
                    switch(suma) {
                        case 2:
                            p = 645;
                            break;
                        case 3:
                        case 4:
                        case 5:
                            p = 1065;
                            break;
                        case 6:
                        case 7:
                            p = 1485;
                            break;
                        case 8:
                        case 9:
                            p = 1905;
                            break;
                        case 10:
                        case 11:
                            p = 2325;
                            break;
                        case 12:
                        case 13:
                            p = 2745;
                            break;
                        case 14:
                        case 15:
                            p = 3165;
                            break;
                        case 16:
                            p = 3585;
                            break;
                    }
                }
            } else if (tipoProfunda === 'mudanza') {
                if (tipoCasa === 'estudio') {
                    p = 592.5;
                } else if (tipoCasa === 'departamento') {
                    let suma = cuartos + banos;
                    switch(suma) {
                        case 2:
                        case 3:
                            p = 592.5;
                            break;
                        case 4:
                        case 5:
                        case 6:
                            p = 960;
                            break;
                        case 7:
                        case 8:
                            p = 1327.5;
                            break;
                        case 9:
                        case 10:
                            p = 1695;
                            break;
                    }
                } else {
                    // casa
                    let suma = cuartos + banos;
                    switch(suma) {
                        case 2:
                            p = 645;
                            break;
                        case 3:
                            p = 1065;
                            break;
                        case 4:
                        case 5:
                            p = 1485;
                            break;
                        case 6:
                        case 7:
                            p = 1905;
                            break;
                        case 8:
                        case 9:
                            p = 2325;
                            break;
                        case 10:
                        case 11:
                            p = 2745;
                            break;
                        case 12:
                        case 13:
                            p = 3165;
                            break;
                        case 14:
                        case 15:
                            p = 3585;
                            break;
                        case 16:
                            p = 4005;
                            break;
                    }
                }
            } else {
                // construccion
                if (tipoCasa === 'estudio') {
                    p = 1005;
                } else if (tipoCasa === 'departamento') {
                    let suma = cuartos + banos;
                    switch(suma) {
                        case 2:
                            p = 1005;
                            break;
                        case 3:
                        case 4:
                        case 5:
                            p = 1065;
                            break;
                        case 6:
                        case 7:
                            p = 1485;
                            break;
                        case 8:
                        case 9:
                            p = 1905;
                            break;
                        case 10:
                            p = 2325;
                            break;
                    }
                } else {
                    // casa
                    let suma = cuartos + banos;
                    switch(suma) {
                        case 2:
                        case 3:
                            p = 1065;
                            break;
                        case 4:
                        case 5:
                            p = 1485;
                            break;
                        case 6:
                        case 7:
                            p = 1905;
                            break;
                        case 8:
                        case 9:
                        case 10:
                            p = 2325;
                            break;
                        case 11:
                        case 12:
                            p = 2745;
                            break;
                        case 13:
                        case 14:
                            p = 3165;
                            break;
                        case 15:
                        case 16:
                            p = 3585;
                            break;
                    }
                }
            }
            if (direccion == 2) {
                p += 10 * profesionales; // dentro del octavo anillo
            } else if (direccion == 3) {
                p += 20 * profesionales;
            } else if (direccion == 4) {
                p += 40 * profesionales;
            }
        } else {
            p = 40; // hora de planchado
            
            if (direccion == 2) {
                p += 0; // dentro del octavo anillo
            } else if (direccion == 3) {
                p += 10;
            } else if (direccion == 4) {
                p += 40;
            }
        }
        
        p += horasPlanchado * 20;

        // Materiales
        if (tipo === 'normal') {
            itemsExtra.forEach(item => {
                if (item.id === 4) { // Todos los anteriores, si hay que cambiar algo que mati nos diga
                    if (item.seleccionado) {
                        // con materiales!
                        // materiales por cada trabajador
                        p += 50 * profesionales;
                        if (materialesExtras.acido) {
                            p += 15;
                        }
                        if (materialesExtras.muebles) {
                            p += 15;
                        }
                        if (materialesExtras.inox) {
                            p += 15;
                        }
                    }
                } else {
                    if (item.seleccionado) {
                        p += 10;
                    }
                }
            });
        }
        return p;
    }, [tipo, horas, direccion, profesionales, materialesExtras, itemsExtra, horasPlanchado, cuartos, banos, tipoProfunda]);

    function actualizarTipo(t) {
        setTipo(t);
        if (t === 'planchar') {
            if (horasPlanchado < 3) {
                actualizarhorasPlanchado(3);
            }
        }
        if (t === 'profunda') {
            actualizarhorasPlanchado(0);
        }
    }

    function aumentarCuartos() {
        let c = cuartos + 1;
        if (c > 20) {
            c = 20;
        }
        setCuartos(c);
    }

    function reducirCuartos() {
        let c = cuartos - 1;
        if (c < 1) {
            c = 1;
        }
        setCuartos(c);
    }

    function aumentarBanos() {
        let c = banos + 1;
        if (c > 20) {
            c = 20;
        }
        setBanos(c);
    }

    function reducirBanos() {
        let c = banos - 1;
        if (c < 1) {
            c = 1;
        }
        setBanos(c);
    }

    function elegirEstudio() {
        setTipoCasa('estudio');
        setBanos(1);
        setCuartos(1);
        setItemsExtra(itemsExtra.map((item, idx) => (idx !== 4 ? item : {...item, seleccionado: true})));
    }
    function elegirDepartamento() {
        setTipoCasa('departamento');
        if (cuartos > 5) {
            setCuartos(5);
        }
        if (banos > 5) {
            setBanos(5);
        }
    }

    function actualizarHoras(h) {
        setHoras(h);
        let profs = Math.ceil(h / 10);
        let m = h / profs;
        m = Math.round(m * 100) / 100;
        setHorasCompartidas(m);
        setProfesionales(profs);
        /*
        if (h >= 10 && h <= 20) {
            m = h / 2;
            setHorasCompartidas(m);
            setProfesionales(2);
        } else if (h >= 19) {
            m = h / 3;
            m = Math.round(m * 100) / 100;
            setHorasCompartidas(m);
            setProfesionales(3);
        } else {
            setHorasCompartidas(h);
        }*/
        // Calcular las horas disponibles
        let horaInicial = 8;
        
        let horas = [];
        let horaFinal = horaInicial + m;
        while(horaFinal <= 18) {
            horas.push({
                horaInicial,
                horaFinal
            });
            horaInicial += 1;
            horaFinal += 1;
        }
        setHorasDisponibles(horas);
        setHoraSeleccionada(-1);
        setError('');
    }

    function actualizarhorasPlanchado(h) {
        let mensaje = '';
        switch(h) {
            case 1:
                mensaje = '8 a 12'
                break;
            case 2:
                mensaje = '12 a 20';
                break;
            case 3:
                mensaje = '20 a 25';
                break;
            case 4:
                mensaje = '25 a 30';
                break;
            case 5:
                mensaje = '30 a 35';
                break;
            case 6:
                mensaje = '35 a 40';
                break;
            case 7:
                mensaje = '40 a 45';
                break;
            case 8:
                mensaje = '45 a 50';
                break;
        }
        if (h > 0) {
            setMensajeHoras(`Sugerencia para planchar entre ${mensaje} prendas`);
        } else {
            setMensajeHoras('');
        }
        setHorasText(`${formatHora(h)}`);
        setProfesionales(1);
        setHorasPlanchado(h);
    }

    function aumentarHoras() {
        let increment = 1;
        
        let h = horasPlanchado + increment;
        if (h > 8) {
            h = 8;
        }

        actualizarhorasPlanchado(h);
    }

    function disminuirHoras() {
        let increment = 1;
        
        let h = horasPlanchado - increment;
        if (tipo === 'planchar') {
            if (h < 3) {
                h = 3;
            }
        } else {
            if (h < 0) {
                h = 0;
            }
        }
        actualizarhorasPlanchado(h);
    }

    function elegirFecha(fecha) {
        setError('');
        setFecha(fecha);
    }

    function toggleItem(id) {
        var activando = false;
        let newItems = itemsExtra.map(item => {
            if (item.id === id) {
                activando = !item.seleccionado;
                if (tipoCasa === 'estudio' && id === 4) {
                    activando = true;
                    return {...item, seleccionado: true};
                }
                return {...item, seleccionado: !item.seleccionado}
            } else {
                return {...item};
            }
        })

        setItemsExtra(newItems);
        if (activando && id === 4) {
            setMostrarModalMateriales(true);
        }
    }

    function cambioMateriales(e, item) {
        let me = {...materialesExtras};
        me[item] = e.target.checked;
        console.log(me);
        setMaterialesExtras(me);
    }

    function siguientePaso() {
        if (fecha === undefined) {
            setError('Debe elegir una fecha!');
            return;
        }
        if (horaSeleccionada < 0) {
            setError('Debe elegir una hora!');
            return;
        }
        if (horaSeleccionada >= horasDisponibles.length) {
            setError('Elija una hora valida');
            return;
        }
        // TODO: continar al login!
        setError('');
        if (props.userStore.isLoggedIn) {
            setPaso(3);
        } else {
            setPaso(2);
        }
    }

    function toIso(f) {
        return f.getFullYear()+'-'+(f.getMonth() + 1)+'-'+f.getDate();
    }

    function solicitarServicio(dir) {
        console.log('solicitando servicio:', dir);
        if (solicitarState.mostrarModal == false) {
            setSolicitarState({mostrarModal: true, cargando: true});
            console.log(horas,
                precio,
                horasCompartidas);
            api().post('/api/services', {
                tipo,
                tipoCasa,
                tipoProfunda,
                horas,
                precio,
                horasCompartidas,
                profesionales,
                cuartos,
                banos,
                horasPlanchado,
                direction_id: dir.id,
                referencia: direccion,
                opcionales: JSON.stringify(itemsExtra),
                materialesExtras: JSON.stringify(materialesExtras),
                fecha: toIso(fecha),
                hora: JSON.stringify(horasDisponibles[horaSeleccionada])
            })
            .then(res => {
                console.log("respuesta = ", res);
                setSolicitarState({mostrarModal: true, cargando: false, success: true});
            })
            .catch(e => {
                if (e.response.data) {
                    console.log(e.response.data);
                } else {
                    console.log(e);
                }
                setSolicitarState({mostrarModal: true, cargando: false, success: false});
            });
        }
    }

    function noSePuedenAumentarCuartos() {
        if (tipoCasa === 'estudio') {
            return true;
        }
        if (tipoCasa === 'departamento' && cuartos === 5) {
            return true;
        }
        if (tipoCasa === 'casa' && cuartos === 8) {
            return true;
        }
        return false;
    }

    function noSePuedenAumentarBanos() {
        if (tipoCasa === 'estudio') {
            return true;
        }
        if (tipoCasa === 'departamento' && banos === 5) {
            return true;
        }
        if (tipoCasa === 'casa' && banos === 8) {
            return true;
        }
        return false;
    }

    function toggleNav() {
        let btn = document.getElementsByClassName('navbar-toggler')[0];
        btn.click();
    }
    
    return (
        <Container fluid>
            <Row className='d-block d-md-none'>
                <Col xs={12} md={0} className='barraPrecio'>
                    <img src={dolarPrecio} className='dolarPrecio'/>
                    <span className='span'>
                        <p className='precioMobile'>Bs. <span style={{color: 'white'}}>{precio.toFixed(2)}</span></p>
                        <p className='horaMobile'>por <span style={{color: '#081047'}}>{horas}</span> horas de <span style={{color: '#081047'}}>trabajo</span></p>
                    </span>
                    <button onClick={() => {toggleNav()}}><img src={hamburger}/></button>
                </Col>
            </Row>
            <Row>
                <Col md={8}>
                    {
                        paso === 2 &&
                        <>
                            <Button onClick={() => {setPaso(1)}}  variant='secondary' className='mb-3'>
                                <ArrowLeft/>
                            </Button>
                            <Login callback={() => {setPaso(3)}}/>
                        </>
                    }
                    {
                        paso === 3 &&
                        <>
                            <Button onClick={() => {setPaso(1)}} variant='secondary' className='mb-3'>
                                <ArrowLeft/>
                            </Button>
                            <Direcciones 
                                callback={(dir) => {
                                    solicitarServicio(dir);
                                }}
                                cambioDireccion={(zona) => {
                                    setDireccion(zona);
                                }}
                            />
                        </>
                    }
                    {
                        paso === 1 &&
                        <>
                        <div  className='pl-xs-2 pl-md-5'>
                            <div>
                                <div className='capsula'>
                                    {
                                        tipo !== 'profunda' ?
                                        <span>1/4</span> :
                                        <span>1/3</span> 
                                    }
                                </div>
                                <Row className='mt-3'>
                                    <Col>
                                        <h1 className='titulo'>¿Cual es su ubicación?</h1>
                                    </Col>
                                </Row>
                                <Row className='mt-2'>
                                    <Col>
                                        <select 
                                            className='form-control' 
                                            style={{maxWidth: '200px', borderRadius: '30px'}}
                                            value={direccion}
                                            onChange={(e) => {setDireccion(e.target.value)}}
                                            >
                                            <option value='1'>Dentro del 5to anillo</option>
                                            <option value="2">Del 5to al 8tvo anillo</option>
                                            <option value="3">Fuera del 8vo anillo</option>
                                            <option value="4">Urubó</option>
                                        </select>
                                    </Col>
                                </Row>
                                <div className='capsula mt-5'>
                                    {
                                        tipo !== 'profunda' ?
                                        <span>2/4</span> :
                                        <span>2/3</span> 
                                    }
                                </div>
                                {/*TODO: Agregar al top el precio */}
                                <Row className='mt-3'>
                                    <Col>
                                        <h1 className='titulo'>¿Qué tipo de servicio requiere?</h1>
                                    </Col>
                                </Row>
                                <center>
                                    
                                </center>
                                <Row className='mt-2 barra '>
                                {/*Esta fila es para celulares*/}
                                    <Col className='text-center d-block d-md-none p-0'>
                                        <div className='fila'>
                                            <div>
                                                <div
                                                    className={tipo === 'normal' ? 'seleccionado boton' : 'boton'}
                                                    onClick={() => {actualizarTipo('normal')}}
                                                    onMouseEnter={() => setHover('normal')}
                                                    onMouseLeave={() => setHover('')}
                                                    style={{
                                                        display: 'flex',
                                                        width: '92px',
                                                        height: '88px',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        paddingRight: '8px'
                                                    }}
                                                >
                                                    <Spray style={{marginRight: '10px'}} color={tipo === 'normal' || hover === 'normal' ? 'white' : '#081047'}/>
                                                </div>
                                            </div>
                                            <div>
                                                <div
                                                    className={tipo === 'profunda' ? 'seleccionado boton' : 'boton'}
                                                    onClick={() => {actualizarTipo('profunda')}}
                                                    onMouseEnter={() => setHover('profunda')}
                                                    onMouseLeave={() => setHover('')}
                                                    style={{
                                                        display: 'flex',
                                                        width: '92px',
                                                        height: '88px',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <Materiales color={tipo === 'profunda' || hover === 'profunda' ? 'white' : '#081047'}/>
                                                </div>
                                            </div>
                                            <div>
                                                <div
                                                    className={tipo === 'planchar' ? 'seleccionado boton' : 'boton'}
                                                    onClick={() => {actualizarTipo('planchar')}}
                                                    onMouseEnter={() => setHover('planchar')}
                                                    onMouseLeave={() => setHover('')}
                                                    style={{
                                                        display: 'flex',
                                                        width: '92px',
                                                        height: '88px',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <Plancha color={tipo === 'planchar' || hover === 'planchar' ? 'white' : '#081047'}/>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                
                                {/*Esta fila es para grandes*/}
                                    <Col className='text-center d-none d-md-block mr-3'>
                                        <Row 
                                            className={tipo === 'normal' ? 'seleccionado boton' : 'boton'}
                                            onClick={() => {actualizarTipo('normal')}}
                                            onMouseEnter={() => setHover('normal')}
                                            onMouseLeave={() => setHover('')}
                                        >
                                            <Col xs={0} md={3} className='text-center p-0'>
                                                <Spray color={tipo === 'normal' || hover === 'normal' ? 'white' : '#081047'}/>
                                            </Col>
                                            <Col xs={9} md={6} className='text-center p-0'>
                                                Limpieza estándar
                                            </Col>
                                            <Col xs={2} className='text-left p-0'>
                                                <Info color={hover === 'normal' ? 'white' : '#081047'} onClick={() => {
                                                    setMostrarModalInfo(true);
                                                }}/>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col className='d-none d-md-block ml-3 mr-3'>
                                        <Row 
                                            className={tipo === 'profunda' ? 'seleccionado boton' : 'boton'}
                                            onClick={() => {actualizarTipo('profunda')}}
                                            onMouseEnter={() => setHover('profunda')}
                                            onMouseLeave={() => setHover('')}
                                        >
                                            <Col xs={0} md={3} className='text-right p-0'>
                                                <Materiales color={tipo === 'profunda' || hover === 'profunda' ? 'white' : '#081047'}/>
                                            </Col>
                                            <Col xs={10} md={7} className='text-center p-0'>
                                                Limpieza<br/>profunda
                                            </Col>
                                            <Col xs={2} className='text-left p-0'>
                                                <Info color={hover === 'profunda' ? 'white' : '#081047'} 
                                                    onClick={() => {setMostrarModalInfo(true)}}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col className='text-center  d-none d-md-block ml-3'>
                                        <Row 
                                            className={tipo === 'planchar' ? 'seleccionado boton' : 'boton'}
                                            onClick={() => {actualizarTipo('planchar')}}
                                            onMouseEnter={() => setHover('planchar')}
                                            onMouseLeave={() => setHover('')}
                                        >
                                            <Col xs={0} md={3} className='text-right p-0'>
                                                <Plancha color={tipo === 'planchar' || hover === 'planchar' ? 'white' : '#081047'}/>
                                            </Col>
                                            <Col xs={10} md={7} className='text-center p-0'>
                                                Planchado
                                            </Col>
                                            <Col xs={2} className='text-left p-0'>
                                                <Info color={hover === 'planchar' ? 'white' : '#081047'} 
                                                    onClick={() => {setMostrarModalInfo(true)}}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <div className='mt-2 celu' style={{alignItems: 'center'}}>
                                    <div className='celuTitle'>
                                        {
                                            tipo === 'normal' && 'Limpieza estándar'
                                        }
                                        
                                        {
                                            tipo === 'profunda' && 'Limpieza profunda'
                                        }
                                        {
                                            tipo === 'planchar' && 'Planchado'
                                        }
                                    </div>
                                    {
                                        (tipo === 'normal' || tipo === 'planchar') &&
                                            <div style={{marginLeft: '10px', fontSize: '1rem'}}>
                                                <Info color='#081047' onClick={() => {
                                                setMostrarModalInfo(true);
                                            }}/>
                                        </div>
                                    }
                                </div>
                                {
                                    tipo === 'profunda' && 
                                    <>
                                    <Row className='mt-4'>
                                        <Col>
                                            <h2 style={{color: '#AA7EB5'}}>¿Que tipo de limpieza profunda?</h2>
                                        </Col>
                                    </Row>
                                    {/*Esta fila es para celulares*/}
                                    <div className='text-center d-block d-md-none'>
                                        <div>
                                            <div>
                                                <div
                                                    className={tipoProfunda === 'rutina' ? 'botonSeleccionado1' : 'boton1'}
                                                    onClick={() => {setTipoProfunda('rutina')}}
                                                    style={{marginTop: '20px'}}
                                                >
                                                    De Rutina
                                                </div>
                                            </div>
                                            <div>
                                            <div
                                                className={tipoProfunda === 'mudanza' ? 'botonSeleccionado1' : 'boton1'}
                                                onClick={() => {setTipoProfunda('mudanza')}}
                                                style={{marginTop: '20px'}}
                                            >
                                                Pre Mudanza
                                            </div>
                                            </div>
                                            <div>
                                            <div
                                                className={tipoProfunda === 'construccion' ? 'botonSeleccionado1' : 'boton1'}
                                                onClick={() => {setTipoProfunda('construccion')}}
                                                style={{marginTop: '20px'}}
                                            >
                                                Post Construcción
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Row className='mt-2 barra p-0 d-none d-md-flex'>
                                        {/*Esta es para grandes*/}
                                        <Col className='text-center d-none d-md-block pl-1 pt-1 pb-1'>
                                            <div
                                                className={tipoProfunda === 'rutina' ? 'botonSeleccionado1' : 'boton1'}
                                                onClick={() => {setTipoProfunda('rutina')}}
                                            >
                                                De Rutina
                                            </div>
                                        </Col>
                                        <Col className='d-none d-md-block pt-1 pb-1'>
                                            <div
                                                className={tipoProfunda === 'mudanza' ? 'botonSeleccionado1' : 'boton1'}
                                                onClick={() => {setTipoProfunda('mudanza')}}
                                            >
                                                Pre Mudanza
                                            </div>
                                        </Col>
                                        <Col className='d-none d-md-block pr-1 pt-1 pb-1'>
                                            <div
                                                className={tipoProfunda === 'construccion' ? 'botonSeleccionado1' : 'boton1'}
                                                onClick={() => {setTipoProfunda('construccion')}}
                                            >
                                                Post Construcción
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className='text-center'>
                                            {
                                                tipoProfunda !== '' &&
                                                <Button variant='link' onClick={() => {setMostrarModalInfo(true)}}>¿Qué está incluido?</Button>
                                            }
                                        </Col>
                                    </Row>
                                    </>
                                }
                                
                                {
                                    tipo !== 'planchar' &&
                                    <>
                                    <Row className='mt-4'>
                                        <Col>
                                            <h2 style={{color: '#AA7EB5'}}>¿Cómo es tu hogar?</h2>
                                        </Col>
                                    </Row>
                                    {/*Esta fila es para celulares*/}
                                    <div className='text-center d-block d-md-none'>
                                        <div>
                                            <div>
                                                <div
                                                    className={tipoCasa === 'estudio' ? 'botonSeleccionado1' : 'boton1'}
                                                    onClick={() => {elegirEstudio()}}
                                                    style={{marginTop: '24px'}}
                                                >
                                                    Monoambiente
                                                </div>
                                            </div>
                                            <div>
                                                <div
                                                    className={tipoCasa === 'departamento' ? 'botonSeleccionado1' : 'boton1'}
                                                    onClick={() => {elegirDepartamento()}}
                                                    style={{marginTop: '46px'}}
                                                >
                                                    Departamento
                                                </div>
                                            </div>
                                            <div>
                                                <div
                                                    className={tipoCasa === 'casa' ? 'botonSeleccionado1' : 'boton1'}
                                                    onClick={() => {setTipoCasa('casa')}}
                                                    style={{marginTop: '46px'}}
                                                >
                                                    Casa
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Row className='mt-2 barra p-0 d-none d-md-flex'>
                                        {/*Esta es para grandes*/}
                                        <Col className='text-center d-none d-md-block pl-1 pt-1 pb-1'>
                                            <div
                                                className={tipoCasa === 'estudio' ? 'botonSeleccionado1' : 'boton1'}
                                                onClick={() => {elegirEstudio()}}
                                            >
                                                Monoambiente
                                            </div>
                                        </Col>
                                        <Col className='d-none d-md-block pt-1 pb-1'>
                                            <div
                                                className={tipoCasa === 'departamento' ? 'botonSeleccionado1' : 'boton1'}
                                                onClick={() => {elegirDepartamento()}}
                                            >
                                                Departamento
                                            </div>
                                        </Col>
                                        <Col className='d-none d-md-block pr-1 pt-1 pb-1'>
                                            <div
                                                className={tipoCasa === 'casa' ? 'botonSeleccionado1' : 'boton1'}
                                                onClick={() => {setTipoCasa('casa')}}
                                            >
                                                Casa
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className='celu' style={{height: '60px'}}></div>
                                    <Row className='mt-3 justify-content-center'>
                                        <Col className='text-center pt-2 pb-2' xs={8} md={5}>
                                            <div className='incrementador'>
                                                <div className='botonRedondo' onClick={reducirCuartos} disabled={cuartos <= 1}>-</div>
                                                <div className='label'>{cuartosText}</div>
                                                <div className='botonRedondo' onClick={aumentarCuartos} disabled={noSePuedenAumentarCuartos()}>+</div>
                                            </div>
                                        </Col>
                                        <Col className='text-center align-self-center' xs={12} md={2}
                                            style={{fontSize: '20px',
                                                    lineHeight: '24px',
                                                    color: '#081047'}}
                                        >
                                            Con
                                        </Col>
                                        <Col className='text-center  pt-2 pb-2'  xs={8} md={5}>
                                            <div className='incrementador'>
                                                <div className='botonRedondo' onClick={reducirBanos} disabled={banos <= 1}>-</div>
                                                <div className='label'>{banosText}</div>
                                                <div className='botonRedondo' onClick={aumentarBanos} disabled={noSePuedenAumentarBanos()}>+</div>
                                            </div>
                                        </Col>
                                    </Row>
                                    </>
                                }
                            </div>
                            <div className='mt-5' style={{display: tipo !== 'profunda' ? 'block' : 'none'}}>
                                <div className='capsula'>
                                    {
                                        tipo !== 'profunda' ?
                                        <span>3/4</span> :
                                        null
                                    }
                                </div>
                                {
                                    tipo === 'normal' &&
                                    <Row className='mt-2'>
                                        <Col>
                                            <h1 className='titulo'>Opcionales</h1>
                                            <p>Personaliza tus elementos opcionales.</p>
                                            <Row className='contenedorOpcionales'>
                                                <Col xs={12} lg={6}>
                                                {
                                                    itemsExtra.map((item, index) => (
                                                        index < itemsExtra.length/2 ? 
                                                        <Checkbox 
                                                            key={item.id} 
                                                            texto={item.texto} 
                                                            seleccionado={item.seleccionado} 
                                                            onClick={() => {toggleItem(item.id)}}
                                                            style={{marginBottom: '20px'}}
                                                            /> : null
                                                    ))
                                                }
                                                </Col>
                                                <Col  xs={12} lg={6}>
                                                {
                                                    itemsExtra.map((item, index) => (
                                                        index >= itemsExtra.length/2 ? 
                                                        <Checkbox 
                                                            key={item.id} 
                                                            texto={item.texto} 
                                                            seleccionado={item.seleccionado} 
                                                            onClick={() => {toggleItem(item.id)}}
                                                            style={{marginBottom: '20px'}}
                                                            /> : null
                                                    ))
                                                }
                                                {
                                                    (materialesExtras.acido || materialesExtras.inox || materialesExtras.muebles) &&
                                                    <ul style={{listStyleType: '"+ "'}}>
                                                         {
                                                             materialesExtras.acido &&
                                                             <li>Ácido Nítrico (+ 15 bs.)</li>
                                                         }
                                                         {
                                                             materialesExtras.inox &&
                                                             <li>Lustra Inox (+ 15 bs.)</li>
                                                         }
                                                         {
                                                             materialesExtras.muebles &&
                                                             <li>Lustra muebles(+ 15 bs.)</li>
                                                         }
                                                    </ul>
                                                }
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                }
                                {
                                    (tipo === 'planchar' || tipo === 'normal') &&
                                    <Row className='mt-2'>
                                        <Col>
                                        <h2 className='titulo'>{
                                            tipo === 'normal' ?
                                            'Horas extras'
                                            :
                                            'Horas de planchado'
                                        }</h2>
                                        <p>{
                                            tipo === 'normal' ?
                                            '¿Necesita planchar ropa o necesita horas extras?' :
                                            '¿Cuantas horas necesita?'
                                        }</p>
                                        <Row>
                                            <Col xs={12} md={6}>
                                                <div className='incrementador'>
                                                    <div className='botonRedondo' onClick={disminuirHoras} disabled={(tipo === 'normal' && horasPlanchado <= 0) || (tipo === 'planchar' && horasPlanchado <= 3)}>-</div>
                                                    <div className='label'>{horasText}</div>
                                                    <div className='botonRedondo' onClick={aumentarHoras} disabled={horasPlanchado >= 8}>+</div>
                                                </div>
                                            </Col>
                                            {
                                                horasPlanchado > 0 &&
                                                <Col  xs={12} md={6} className='mensajeHoras'>
                                                    <div className='flecha'></div>
                                                    <p>{mensajeHoras}</p>
                                                </Col>
                                            }
                                        </Row>
                                        <p className='mt-4'>
                                            * Puede solicitar horas extra para planchado de ropa o continuar con la limpieza<br/>
                                            * En caso de solicitar horas adicionales (+ Bs 20 x hora extra)<br/>
                                            * Se podra solicitar lavado de vidrios a la agente de limpieza, se estima un tiempo promedio de 20 mins por hoja de blindex
                                        </p>
                                        </Col>
                                    </Row>
                                }
                            </div>
                            <div className='mt-5'>
                                <div className='capsula'>
                                    {
                                        tipo !== 'profunda' ?
                                        <span>4/4</span> :
                                        <span>3/3</span> 
                                    }
                                </div>
                                <Row className='mt-3'>
                                    <Col>
                                        <h1 className='titulo'>Fecha</h1>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <SelectorDeDias handleClick={elegirFecha} diaElegido={fecha}/>
                                    </Col>
                                </Row>
                                <Row className='mt-5'>
                                <Col xs={12} sm={6} className='text-center'>
                                        {
                                            horasDisponibles.map((h, idx) => (
                                                idx <= horasDisponibles.length/2 ?
                                                <div key={idx * 2} className='botonHoraPadre'>
                                                    <div 
                                                        className={idx === horaSeleccionada ? 'botonHoraSeleccionada' : 'botonHora'}
                                                        onClick={() => {setError(''); setHoraSeleccionada(idx)}}
                                                        >
                                                            {formatHora2(h.horaInicial)+" - "+formatHora2(h.horaFinal)}
                                                    </div>
                                                </div>
                                                :
                                                null
                                            ))
                                        }
                                    </Col>
                                    <Col xs={12} sm={6} className='text-center'>
                                        {
                                            horasDisponibles.map((h, idx) => (
                                                idx > horasDisponibles.length/2 ?
                                                <div key={idx * 2 + 1} className='botonHoraPadre'>
                                                    <div 
                                                        className={idx === horaSeleccionada ? 'botonHoraSeleccionada' : 'botonHora'}
                                                        onClick={() => {setError(''); setHoraSeleccionada(idx)}}
                                                        >
                                                            {formatHora2(h.horaInicial)+" - "+formatHora2(h.horaFinal)}
                                                    </div>
                                                </div>
                                                : null
                                            ))
                                        }
                                    </Col>
                                </Row>
                                <Row className='mt-4'>
                                    <Col className='textoSubrayado'>
                                        El ingreso puede variar entre 15 y 20 minutos
                                    </Col>
                                </Row>
                                <Row className='mt-5'>
                                    <Col xs={12} className='text-center'>
                                        {
                                            error !== '' &&
                                            <Alert variant='danger'>{error}</Alert>
                                        }
                                        <div className='btnSolicitar' onClick={() => {siguientePaso()}}>Continuar</div>
                                    </Col>
                                </Row>
                            </div>
                            
                            </div>
                        </>
                    }
                </Col>
                <Col 
                    ref={divRef} 
                    md={4} 
                    className='d-none d-md-block' 
                    >
                    <div className='panel'>
                        <div style={{boxShadow: 'none'}}>
                            {
                                tipo === 'normal' && 
                                <>
                                <Row 
                                    className={'boton seleccionado'}
                                    style={{
                                        backgroundColor: '#F5F8FF', 
                                        color: '#081047', 
                                        cursor: 'default',
                                        borderRadius: '30px'
                                    }}
                                    >
                                        <Col xs={3} className='text-center p-0'>
                                        <Spray color={'#FFFFFF'}/>
                                        </Col>
                                        <Col xs={8} className='text-center p-0'>
                                            Limpieza estándar
                                        </Col>
                                    </Row>
                                </>
                            }
                            {
                                tipo === 'profunda' && 
                                <>
                                <Row 
                                    className={'boton seleccionado'}
                                    style={{
                                        backgroundColor: '#F5F8FF', 
                                        color: '#081047', 
                                        cursor: 'default',
                                        borderRadius: '30px'
                                    }}
                                    >
                                        <Col xs={3} className='text-center p-0'>
                                        <Materiales color={'#FFFFFF'}/>
                                        </Col>
                                        <Col xs={8} className='text-center p-0'>
                                            Limpieza profunda
                                        </Col>
                                    </Row>
                                </>
                            }
                            {
                                tipo === 'planchar' && 
                                <>
                                <Row 
                                    className={'boton seleccionado'}
                                    style={{
                                        backgroundColor: '#F5F8FF', 
                                        color: '#081047', 
                                        cursor: 'default',
                                        borderRadius: '30px'
                                    }}
                                    >
                                        <Col xs={3} className='text-center p-0'>
                                        <Plancha color={'#FFFFFF'}/>
                                        </Col>
                                        <Col xs={8} className='text-center p-0'>
                                            Planchado
                                        </Col>
                                    </Row>
                                </>
                            }
                        </div>
                        <div style={{padding: '20px', width: 'fit-content', margin: 'auto'}}>
                            <p className='centrado'><Ubicacion/> 
                                <span style={{color: '#000', marginLeft: '15px'}}>
                                    {
                                        direccion == 1 && "Dentro del 5to anillo"
                                    }
                                    {
                                        direccion == '2' && 'Del 5to al 8tvo anillo'
                                    }
                                    {
                                        direccion == '3' && 'Fuera del 8vo anillo'
                                    }
                                    {
                                        direccion == '4' && 'Urubó'
                                    }
                                </span>
                            </p>
                            <p className='centrado'><Reloj/> <span style={{color: '#000', marginLeft: '15px'}}>{horasCompartidas} horas</span></p>
                            <p className='centrado'><User/> <span style={{color: '#000', marginLeft: '15px'}}>{profesionales} {profesionales > 1 ? 'profesionales' : 'profesional'}</span></p>
                            <div className='divisor'></div>
                            <p className='centrado'><Dolar/> <span className='precio'>Bs. <span style={{color: 'white'}}>{precio.toFixed(2)}</span></span></p>
                        </div>
                    </div>
                </Col>
            </Row>
            <Modal size='sm' show={mostrarModalMateriales} onHide={() => {setMostrarModalMateriales(false)}} centered>
                <Modal.Header closeButton>
                <Modal.Title>Incluir materiales de limpieza</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label><input type='checkbox' checked={true} disabled/> Líquido limpia vidrios</label><br/>
                    <label><input type='checkbox' checked={true} disabled/> Sacagrasa (cocina) </label><br/>
                    <label><input type='checkbox' checked={true} disabled/> Líquido para limpiar pisos</label><br/>
                    <label><input type='checkbox' checked={true} disabled/> Lavavajilla</label><br/>
                    <label><input type='checkbox' checked={true} disabled/> Quitasarro</label><br/>
                    <label><input type='checkbox' checked={true} disabled/> Paños multiusos</label><br/>
                    <label><input type='checkbox' checked={true} disabled/> Lavandina</label><br/>
                    <label><input type='checkbox' checked={true} disabled/> Trapeador</label><br/>
                    <label><input type='checkbox' checked={true} disabled/> Escoba</label><br/>
                    <label><input type='checkbox' checked={true} disabled/> Recogedor de basura</label><br/>
                    <label><input type='checkbox' checked={true} disabled/> Esponjas</label><br/>
                    <label><input type='checkbox' checked={materialesExtras.acido} onChange={e => cambioMateriales(e, 'acido')}/> Ácido Nítrico (+ 15 bs.)</label><br/>
                    <label><input type='checkbox' checked={materialesExtras.inox} onChange={e => cambioMateriales(e, 'inox')}/> Lustra Inox (+ 15 bs.)</label><br/>
                    <label><input type='checkbox' checked={materialesExtras.muebles} onChange={e => cambioMateriales(e, 'muebles')}/> Lustra muebles(+ 15 bs.)</label><br/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {setMostrarModalMateriales(false)}}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={solicitarState.mostrarModal} centered>
                <Modal.Header>
                <Modal.Title>Enviando solicitud</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        solicitarState.cargando &&
                        <Lottie 
                            options={cargandoOptions}
                            height={150}
                            width={150}
                        />
                    }
                    {
                        solicitarState.cargando === false && solicitarState.success && 
                        <div className='text-center'>
                        <Lottie 
                            options={defaultOptions}
                            height={150}
                            width={150}
                        />
                        <Alert variant='success'>Solicitud recibida correctamente</Alert>
                        </div>
                    }
                    {
                        solicitarState.cargando === false && solicitarState.success === false && 
                        <div className='text-center'>
                        <Lottie 
                            options={errorOptions}
                            height={150}
                            width={150}
                        />
                        <Alert variant='danger'>Hubo un error con su solicitud, intenelo mas tarde</Alert>
                        </div>
                    }
                </Modal.Body>
                {
                    solicitarState.cargando === false &&
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {solicitarState.success ? props.history.push('/servicios') : setSolicitarState({mostrarModal: false})}}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                }
            </Modal>
            <Modal size='md' show={mostrarModalInfo} onHide={() => {setMostrarModalInfo(false)}}>
                <Modal.Header closeButton>
                <Modal.Title>¿Que incluye el servicio?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Table striped bordered responsive size='sm'>
                    <thead>
                        <tr>
                            <th>Estándar</th>
                            <th>Profunda</th>
                            <th>Actividad</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='text-center text-success'>
                                <CheckCircle/>
                            </td>
                            <td className='text-center text-success'>
                                <CheckCircle/>
                            </td>
                            <td>
                                Barrer y trapear el piso
                            </td>
                        </tr>
                        <tr>
                            <td className='text-center text-success'>
                                <CheckCircle/>
                            </td>
                            <td className='text-center text-success'>
                                <CheckCircle/>
                            </td>
                            <td>
                                Limpieza Exteriror de muebles y eléctronicos
                            </td>
                        </tr>
                        <tr>
                            <td className='text-center text-success'>
                                <CheckCircle/>
                            </td>
                            <td className='text-center text-success'>
                                <CheckCircle/>
                            </td>
                            <td>
                                Lavado de vajilla, lavaplatos y área externa del horno, 
                            </td>
                        </tr>
                        <tr>
                            <td className='text-center text-success'>
                                <CheckCircle/>
                            </td>
                            <td className='text-center text-success'>
                                <CheckCircle/>
                            </td>
                            <td>
                                Lavado de inodoro,box/ducha, lavamanos y espejo
                            </td>
                        </tr>
                        <tr>
                            <td className='text-center text-success'>
                                <CheckCircle/>
                            </td>
                            <td className='text-center text-success'>
                                <CheckCircle/>
                            </td>
                            <td>
                                Tender la cama y organizar ropa que haya en la habitación
                            </td>
                        </tr>
                        <tr>
                            <td className='text-center text-success'>
                                <CheckCircle/>
                            </td>
                            <td className='text-center text-success'>
                                <CheckCircle/>
                            </td>
                            <td>
                                Organizar artículos diarios / Reemplazar bolsas de basura
                            </td>
                        </tr>
                        <tr>
                            <td className='text-center text-success'>
                                <CheckCircle/>
                            </td>
                            <td className='text-center text-success'>
                                <CheckCircle/>
                            </td>
                            <td>
                                Lavado de ropa en máquina (previa explicación a agente)
                            </td>
                        </tr>
                        <tr>
                            <td className='text-center text-success'>
                            <span style={{whiteSpace: 'nowrap'}}><CurrencyDollar/> Adicional</span>
                            </td>
                            <td className='text-center text-success'>
                                <CheckCircle/>
                            </td>
                            <td>
                                Materiales de limpieza
                            </td>
                        </tr>
                        <tr>
                            <td className='text-center text-success'>
                            <span style={{whiteSpace: 'nowrap'}}><CurrencyDollar/> Adicional</span>
                            </td>
                            <td className='text-center text-success'>
                                <CheckCircle/>
                            </td>
                            <td>
                                Limpieza interior de heladeras
                            </td>
                        </tr>
                        <tr>
                            <td className='text-center text-success'>
                            <span style={{whiteSpace: 'nowrap'}}><CurrencyDollar/> Adicional</span>
                            </td>
                            <td className='text-center text-success'>
                                <CheckCircle/>
                            </td>
                            <td>
                                Lavado de ventanas y blindex
                            </td>
                        </tr>
                        <tr>
                            <td className='text-center text-success'>
                            <span style={{whiteSpace: 'nowrap'}}><CurrencyDollar/> Adicional</span>
                            </td>
                            <td className='text-center text-success'>
                                <CheckCircle/>
                            </td>
                            <td>
                                Limpieza de churrasquera
                            </td>
                        </tr>
                        <tr>
                            <td className='text-center text-success'>
                                <span style={{whiteSpace: 'nowrap'}}><CurrencyDollar/> Adicional</span>
                            </td>
                            <td className='text-center text-success'>
                                <CheckCircle/>
                            </td>
                            <td>
                                Lavado de galeria
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={3} className='text-center'>Limitantes</td>
                        </tr>
                        <tr>
                            <td className='text-center text-danger'>
                                <XCircle/>
                            </td>
                            <td className='text-center text-danger'>
                                <XCircle/>
                            </td>
                            <td>
                                Lavado de ropa a mano
                            </td>
                        </tr>
                        <tr>
                            <td className='text-center text-danger'>
                                <XCircle/>
                            </td>
                            <td className='text-center text-danger'>
                                <XCircle/>
                            </td>
                            <td>
                                Actividades con riesgos para la integridad física de la profesional: limpieza exterior de ventanas / luces o superficies de difícil acceso, arrastre de muebles pesados.
                            </td>
                        </tr>
                        <tr>
                            <td className='text-center text-danger'>
                                <XCircle/>
                            </td>
                            <td className='text-center text-danger'>
                                <XCircle/>
                            </td>
                            <td>
                                Exterminación de ratas, insectos y/o ningún tipo de plaga.
                            </td>
                        </tr>
                        <tr>
                            <td className='text-center text-danger'>
                                <XCircle/>
                            </td>
                            <td className='text-center text-danger'>
                                <XCircle/>
                            </td>
                            <td>
                                Limpieza de desechos animales.
                            </td>
                        </tr>
                        <tr>
                            <td className='text-center text-danger'>
                                <XCircle/>
                            </td>
                            <td className='text-center text-danger'>
                                <XCircle/>
                            </td>
                            <td>
                                Servicios de jardinería.
                            </td>
                        </tr>
                        <tr>
                            <td className='text-center text-danger'>
                                <XCircle/>
                            </td>
                            <td className='text-center text-danger'>
                                <XCircle/>
                            </td>
                            <td>
                                Eliminación de manchas de moho o costras
                            </td>
                        </tr>
                    </tbody>
                    </Table>
                    <Table className='mt-3' bordered striped responsive size='sm'>
                        <thead>
                            <tr>
                                <th colSpan={2}>Planchado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='text-center text-success'>
                                    <CheckCircle/>
                                </td>
                                <td>Ropa de diario (Pantalones,camisas, jeans, etc)</td>
                            </tr>
                            <tr>
                                <td className='text-center text-danger'>
                                    <XCircle/>
                                </td>
                                <td>Ropa de fiesta (Trajes, vestidos, corbatas )</td>
                            </tr>
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {setMostrarModalInfo(false)}}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
        
    );
}

export default inject('userStore')(withRouter(observer(Calculadora)));