<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

use App\Models\Service;
use App\Models\Direction;
use App\Models\User;

class SolicitudMail extends Mailable
{
    use Queueable, SerializesModels;

    public $service, $direction, $user;


    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Service $service, Direction $direction, User $user)
    {
        $this->service = $service;
        $this->user = $user;
        $this->direction = $direction;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Nueva Solicitud TocToc')->markdown('emails.solicitud');
    }
}
