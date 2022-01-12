import React, { useState, useEffect } from 'react';
import './estilo.css';
import { Alert } from 'react-bootstrap';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
// Include the locale utils designed for moment
import MomentLocaleUtils from 'react-day-picker/moment';
import 'moment/locale/es';
import { compararFechas } from '../../utils';

//const dias = ['Dom.', 'Lun.', 'Mar.', 'Mier.', 'Jue.', 'Vier', 'Sab.'];
const diasLargo = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const months = {
    0: 'enero',
    1: 'febrero',
    2: 'marzo',
    3: 'abril',
    4: 'mayo',
    5: 'junio',
    6: 'julio',
    7: 'agosto',
    8: 'septiembre',
    9: 'octubre',
    10: 'noviembre',
    11: 'diciembre'
  }
const Dia = ({indice, fecha, handleClick, elegido}) => {
    return (
        <div className={elegido ? 'botonFechaElegido' : 'botonFecha'} onClick={() => {handleClick(fecha)}}>
            {diasLargo[indice]} <b>{fecha.getDate()}</b>
        </div>
    );
}

const DiaElegido = ({fecha, handleClick}) => {
    return (
        <Alert variant='success' dismissible onClose={() => {handleClick(undefined)}}>
            <Alert.Heading>
                {diasLargo[fecha.getDay()]}
            </Alert.Heading>
            <p>{`${fecha.getDate()} de ${months[fecha.getMonth()]} de ${fecha.getFullYear()}`}</p>
        </Alert>
    );
}

const SelectorDeDias = ({handleClick, diaElegido}) => {
    

    const [otraFecha, setOtraFecha] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);
    function handleWindowSizeChange() {
            setWidth(window.innerWidth);
    }
    useEffect(() => {
            window.addEventListener('resize', handleWindowSizeChange);
            return () => {
                window.removeEventListener('resize', handleWindowSizeChange);
            }
    }, []);

    let isMobile = (width <= 768);
    
    function handleDayClick(day, {selected}) {
        handleClick(day);
    }

    const fecha = new Date();
    var d = [];
    var generarDias = isMobile ? 4 : 7;
    for (let i = 1; i < generarDias; i++) {
        let indice = fecha.getDay() + i;
        if (indice >= 7) {
            indice -= 7;
        }
        let f = new Date();
        f.setDate(fecha.getDate() + i);
        d.push({
            indice,
            fecha: f
        });
    }

    return (
        <>
            {
                otraFecha === false && 
                <div className='barraFecha'>
                    {d.map((dia, idx) => <Dia key={idx} {...dia} elegido={diaElegido !== undefined && compararFechas(dia.fecha, diaElegido)} handleClick={handleClick}/>)}
                    {
                        otraFecha === false &&
                        <div key={'otraFecha'} className='botonFecha' onClick={() => setOtraFecha(true)}>
                            Otra fecha
                        </div>
                    }
                </div>
            }
            
            {
                otraFecha &&
                <div className='text-center'>
                    <DayPicker 
                        localeUtils={MomentLocaleUtils} 
                        locale={'es'} 
                        selectedDays={diaElegido}
                        onDayClick={handleDayClick}
                        todayButton='Ir a hoy'
                        fromMonth={new Date(fecha.getFullYear(), fecha.getMonth())}
                        toMonth={new Date(fecha.getFullYear(), fecha.getMonth() + 1)}
                        disabledDays={[
                            new Date(),
                            {
                              after: new Date(0, 1, 20),
                              before: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()),
                            },
                          ]}
                        />
                </div>
            }
        </>
    );
};

export default SelectorDeDias;