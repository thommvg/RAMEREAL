<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #1e293b; border-radius: 20px; overflow: hidden; border: 1px solid #7e22ce; }
        .header { background: linear-gradient(to right, #7e22ce, #9333ea); padding: 40px 20px; text-align: center; }
        .header h1 { color: white; margin: 0; font-style: italic; text-transform: uppercase; letter-spacing: 2px; }
        .content { padding: 30px; color: #e2e8f0; line-height: 1.6; text-align: center; }
        .footer-mail { padding: 20px; background-color: #0f172a; text-align: center; color: #94a3b8; font-size: 12px; }
        .button { display: inline-block; padding: 12px 30px; background-color: #a855f7; color: white; text-decoration: none; border-radius: 50px; font-weight: bold; margin-top: 20px; box-shadow: 0 4px 14px 0 rgba(147, 51, 234, 0.39); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Bienvenido a Rame!</h1>
        </div>
        <div class="content">
            <h2>Hola, {{ $user->name }} ✨</h2>
            <p>¡Gracias por unirte a nuestra comunidad! Ahora eres parte del sistema más completo para explorar el Valle de Aburrá.</p>
            <p>Ya puedes empezar a calificar tus lugares favoritos y descubrir los restaurantes mejor puntuados por otros usuarios.</p>
            <a href="{{ url('/dashboard') }}" class="button">EMPEZAR A EXPLORAR</a>
        </div>
        <div class="footer-mail">
            © 2026 Rame. Todos los derechos reservados. <br>
            Medellín, Antioquia.
        </div>
    </div>
</body>
</html>