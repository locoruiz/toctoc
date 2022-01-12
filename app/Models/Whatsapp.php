<?php

namespace App\Models;
use Twilio\Rest\Client;
use Illuminate\Support\Facades\Log;

function object_to_array($data)
{
    if (is_array($data) || is_object($data))
    {
        $result = [];
        foreach ($data as $key => $value)
        {
            $result[$key] = (is_array($data) || is_object($data)) ? object_to_array($value) : $value;
        }
        return $result;
    }
    return $data;
}

class whatsapp {
    private $sid, $token;

    public function __construct() {
        $this->sid = "AC6f16a413991545b2b05255da7193794c";
        $this->token = "fa40d969af81b4bd5217744af033a5b9";
        $this->telefono = "+12399208502";
        //$this->telefono = "+14155238886";
    }

    public function enviarCodigoDeVerificacion($codigo, $telefono) {
        $twilio = new Client($this->sid, $this->token); 
    
        $message = $twilio->messages 
                    ->create("whatsapp:".$telefono, // to 
                            array( 
                                "from" => "whatsapp:".$this->telefono,
                                "body" => "Tu código de  TocToc es ".$codigo 
                            ) 
                    );
        $array = json_decode(json_encode($message), true);
        //Log::channel('custom')->info($message->sid);
    }
    public function enviarMensajeDeConfirmacion($codigo, $telefono) {
        $twilio = new Client($this->sid, $this->token); 
    
        $message = $twilio->messages 
                    ->create("whatsapp:".$telefono, // to 
                            array( 
                                "from" => "whatsapp:".$this->telefono,
                                "body" => "Tu servicio ha sido agendado, en unos momentos el equipo TocToc se contactará contigo. 
                                Tu número de orden es $codigo.
                                ¡Gracias por confiar en nosotros!" 
                            ) 
                    );
        $array = json_decode(json_encode($message), true);
    }
    public function enviarMensaje($telefono, $mensaje) {
        $twilio = new Client($this->sid, $this->token); 
    
        $message = $twilio->messages 
                    ->create("whatsapp:".$telefono, // to 
                            array( 
                                "from" => "whatsapp:".$this->telefono,
                                "body" => $mensaje
                            ) 
                    );
        $array = json_decode(json_encode($message), true);
    }
}