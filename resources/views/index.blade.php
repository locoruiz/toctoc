<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="facebook-domain-verification" content="b3w05ly5pbgl83asu4w1kam1pqixub" />
        <title>Toc Toc</title>

        <link href="{{ asset('css/app.css') }}" rel="stylesheet">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <!-- Start of HubSpot Embed Code -->
        <script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/20333896.js"></script>
        <!-- End of HubSpot Embed Code -->

        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css" />

        <meta property="og:image" content="{{ asset('images/toctoc.jpeg') }}">
        <meta property="og:image:type" content="image/jpeg">
        <meta property="og:site_name" content="Toc Toc">
        <meta property="og:description" content="Servicio de limpieza a domicilio" />
        <meta property="og:title" content="Toc Toc" />
    </head>
    <body>
        <!-- React root DOM -->
        <div id="index">
        </div>

        <!-- React JS -->
        <script src="{{ asset('js/app.js') }}" defer></script>

        <!-- Facebook Pixel Code -->
        <script defer>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1013043112830080');
        fbq('track', 'PageView');
        </script>
        <noscript><img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=1013043112830080&ev=PageView&noscript=1"
        /></noscript>
        <!-- End Facebook Pixel Code -->
    </body>
</html>
