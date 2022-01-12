<?php

if (!function_exists('formatHora')) {
    function formatHora($h) {
        if (is_int($h)) {
            return  $h < 10 ? '0'.$h.':00' : $h.':00';
        }
        $decimalPart = $h % 1;
        $correct = $decimalPart;
        $minutos = floor($correct * 60);
        $horas = floor($h);
        if ($horas < 10) {
            $horas = '0' . $horas;
        }
        if ($minutos < 10) {
            $minutos = '0' . $minutos;
        }
        return $horas.':'.$minutos;
    }
}