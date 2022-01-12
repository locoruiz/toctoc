import React from 'react';
import { Check, Checked } from '../iconos';
import './estilo.css';


const Checkbox = (props) => {
    return (
        <div className='padre' style={{...props.style}}>
            <div 
                className={props.seleccionado ? 'botonSeleccionado' : 'checkbox'}
                onClick={props.onClick}
            >
                {
                    props.seleccionado ? 
                    <Checked/>
                    :
                    <Check/>
                }
                <div className='texto'>{props.texto}</div>
            </div>
        </div>
    );
}

export default Checkbox;