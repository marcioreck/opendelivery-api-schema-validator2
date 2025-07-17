<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>@yield('title', 'OpenDelivery Validator')</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="{{ asset('vendor/opendelivery/favicon.svg') }}">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Base CSS -->
    <link href="{{ asset('vendor/opendelivery/css/app.css') }}" rel="stylesheet">
    
    <!-- Additional CSS -->
    @yield('styles')
    
    <!-- Configuration for React -->
    <script>
        window.Laravel = {
            csrfToken: '{{ csrf_token() }}',
            apiUrl: '{{ url('/opendelivery-api-schema-validator2') }}',
            appUrl: '{{ url('/') }}',
            locale: '{{ app()->getLocale() }}',
        };
    </script>
</head>
<body class="antialiased">
    <div id="app">
        @yield('content')
    </div>
    
    <!-- Scripts -->
    @yield('scripts')
    
    <!-- Additional Scripts -->
    @stack('scripts')
</body>
</html>
