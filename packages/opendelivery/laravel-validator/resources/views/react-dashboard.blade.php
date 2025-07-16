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
@vite(['resources/js/main.tsx', 'resources/css/app.css'], 'vendor/opendelivery')
@endsection
