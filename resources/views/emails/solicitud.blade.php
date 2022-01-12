@component('mail::message', ['service' => $service, 'user' => $user, 'direction' => $direction])
# Nueva solicitud de servicio
@php
    $comps = explode('-', $service->fecha);
    $fecha = $comps[2].'/'.$comps[1].'/'.$comps[0];

    $titulo = 'Servicio';
    $tipoCasa = '';
    $tieneMateriales = '';
    $extras = '<ul>';
    $materialesExtras = '<ul>';
    
    if ($service) {
        switch($service->tipo) {
            case 'normal':
                $titulo = 'Limpieza estándar de ';
                break;
            case 'profunda':
                $titulo = 'Limpieza profunda de ';
                break;
            case 'planchar':
                $titulo = 'Planchado en ';
                break;
        }
        
        switch($service->tipoCasa) {
            case 'estudio':
                $tipoCasa = 'monoambiente';
                break;
            case 'departamento':
                $tipoCasa = 'departamento';
                break;
            case 'casa':
                $tipoCasa = 'casa';
                break;
        }
        $titulo .= $tipoCasa;

        
        if ($service->tipo == 'profunda') {
            switch($service->tipoProfunda) {
                case 'rutina':
                    $titulo .= ' - De rutina';
                    break;
                case 'mudanza':
                    $titulo .= ' - Pre Mudanza';
                    break;
                case 'construccion':
                    $titulo .= ' - Post Construccion';
                    break;
            }
        }
        $opcionales = json_decode($service->opcionales);
        foreach($opcionales as $item) {
            if ($item->seleccionado) {
                if ($item->id == 4) {
                    $tieneMateriales = 'Si';
                } else {
                    $extras .= '<li>'.$item->texto.'</li>';
                }
            }
        }
        $extras .= '</ul>';
        $mExtras = json_decode($service->materialesExtras);
        if ($mExtras->acido) {
            $materialesExtras .= '<li>Ácido Nítrico</li>';
        }
        if ($mExtras->inox) {
            $materialesExtras .= '<li>Lustra Inox</li>';
        }
        if ($mExtras->muebles) {
            $materialesExtras .= '<li>Lustra Muebles</li>';
        }

        $materialesExtras .= '</ul>';
    }
@endphp
<table class='tabla' style='margin-bottom: 3rem; width: 100%'>
    <tr>
        <td><strong>Nombre</strong></td><td>{{$user->name}}</td>
    </tr>
    <tr>
        <td><strong>Telefono</strong></td><td>{{$user->phone}}</td>
    </tr>
    <tr>
        <td><strong>Dirección</strong></td><td>{{$direction->direction}}</td>
    </tr>
    <tr>
        <td><strong>Referencia</strong></td><td>{{$direction->referencia}}</td>
    </tr>
    <tr>
        <td><strong>Mapa</strong></td><td><a target="_blank"  href={{"http://maps.google.com/maps?q=".$direction->latitud.",".$direction->longitud}}>Ver mapa</a></td>
    </tr>
    <tr>
        <td><strong>Fecha</strong></td><td>{{$fecha}}</td>
    </tr>
    <tr>
        <td><strong>Hora</strong></td><td>{{formatHora(json_decode($service->hora)->horaInicial)}} - {{formatHora(json_decode($service->hora)->horaFinal)}}</td>
    </tr>
</table>


# {{$titulo}}


<div style='overflow: auto; max-width: 100%'>
<table class='tabla' >
    <tbody>
        <tr>
            <th ><strong>Cantidad de profesionales</strong></th>
            <td style='text-align: right'>{{$service->profesionales}}</td>
            <th ><strong>Horas Compartidas</strong></th>
            <td style='text-align: right'>{{$service->horasCompartidas}}</td>
        </tr>
        @if($service->tipo != 'planchar')
            <tr>
                <th><strong>Cuartos</strong></th>
                <td style='text-align: right'>{{$service->cuartos}}</td>
                <th><strong>Baños</strong></th>
                <td style='text-align: right'>{{$service->banos}}</td>
            </tr>
            <tr>
                <th><strong title='Requiere materiales de limpieza'>Materiales</strong></th>
                <td>{{$tieneMateriales}}</td>
                <th><strong>Tareas</strong></th>
                <td>{!!$extras!!}</td>
            </tr>
            <tr>
                <th><strong>Materiales extras</strong></th>
                <td>{!!$materialesExtras!!}</td>
                <th><strong>Horas extras</strong></th>
                <td>{{$service->horasPlanchado}}</td>
            </tr>
        @endif
        <tr>
            @if($service->tipo != 'planchar')
                <th><strong>Total horas</strong></th>
                <td>{{$service->horas+$service->horasPlanchado}}</td>
            @else
                <td col-span='2'></td>
            @endif
            <th style='font-size: 25px'><strong>Precio total</strong></th>
            <td style='text-align: right; font-size: 25px'><b>Bs. {{number_format($service->precio, 2)}}</b></td>
        </tr>
    </tbody>
</table>
</div>

@endcomponent
