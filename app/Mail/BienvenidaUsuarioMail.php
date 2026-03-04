<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BienvenidaUsuarioMail extends Mailable // <--- CAMBIADO A USUARIO
{
    use Queueable, SerializesModels;

    public $user;

    public function __construct($user)
    {
        $this->user = $user;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '¡Bienvenido a Rame!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.bienvenida-usuario', 
        );
    }

    public function attachments(): array
    {
        return [];
    }
}