@extends('opendelivery::layouts.app')

@section('title', 'OpenDelivery Validator - React Dashboard')

@section('content')
<div id="opendelivery-app">
    <div class="d-flex justify-content-center align-items-center" style="height: 50vh;">
        <div class="text-center">
            <div class="opendelivery-spinner mb-3"></div>
            <p class="text-muted">Loading OpenDelivery Validator...</p>
        </div>
    </div>
</div>
@endsection

@section('scripts')
{{-- Load the built React assets dynamically from manifest --}}
@php
    $manifestPath = public_path('vendor/opendelivery/build/.vite/manifest.json');
    $manifest = file_exists($manifestPath) ? json_decode(file_get_contents($manifestPath), true) : [];
    
    $mainEntry = $manifest['resources/js/main.tsx'] ?? null;
    $cssEntry = $manifest['resources/css/app.css'] ?? null;
@endphp

@if($cssEntry)
    <link rel="stylesheet" href="{{ asset('vendor/opendelivery/build/' . $cssEntry['file']) }}">
@endif

@if($mainEntry)
    <script type="module" src="{{ asset('vendor/opendelivery/build/' . $mainEntry['file']) }}"></script>
@endif
@endsection
