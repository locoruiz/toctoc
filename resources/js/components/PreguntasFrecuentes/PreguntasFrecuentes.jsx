import React, { useState } from 'react'
import pregunta from '../../../assets/pregunta.svg';

import './estilo.css';

function PreguntasFrecuentes() {
    const [preguntas, setPreguntas] = useState([
        {
            id: 1,
            pregunta: '¿Quién me atendera?',
            respuesta: 'Un profesional será asignado antes de la fecha, también podrá solicitar a un profesional particular',
            extendida: false
        },
        {
            id: 2,
            pregunta: 'Limpieza y materiales',
            respuesta: 'Se llevaran materiales de limpieza por un monto adicional',
            extendida: false
        },
        {
            id: 3,
            pregunta: 'Sobre el pago',
            respuesta: 'Podrá pagar en efectivo una vez finalizada la limpieza al profesional asignado, también podrá realizar una transferencia o pago con QR',
            extendida: false
        },
        {
            id: 4,
            pregunta: 'Cancelacion y reprogramación',
            respuesta: 'Pordá cancelar con 12 horas de anticipación, pasado esto se le cobrará una multa en la próxima limpieza',
            extendida: false
        },
        {
            id: 5,
            pregunta: 'Suscripción',
            respuesta: 'Pordá suscribirse a que vaya un profesional a limpiar su hogar todos los dias, día por medio o como usted necesite',
            extendida: false
        }
    ]);

    function togglePregunta(id) {
        setPreguntas(preguntas.map(p => {
            if (p.id === id) {
                p.extendida = !p.extendida;
            }
            return p;
        }))
    }
    return (
        <div className="preguntas-frecuentes">
            <img src={pregunta} alt="Sigo de interrogacion" />
            <h3>Preguntas Frecuentes</h3>
            {
                preguntas.map(pregunta => <div key={pregunta.id}>
                    <div className="pregunta" onClick={() => {togglePregunta(pregunta.id)}}>{pregunta.pregunta}</div>
                    <div className={pregunta.extendida ? 'respuesta activa' : 'respuesta'}>{pregunta.respuesta}</div>
                    <div className="linea"></div>
                </div>)
            }
        </div>
    )
}

export default PreguntasFrecuentes