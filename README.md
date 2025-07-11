# OpenDelivery API Schema Validator 2

A comprehensive validation and certification tool for OpenDelivery API implementations. This project provides both a backend service for schema validation and a frontend interface for easy interaction.

## Features

### Backend
- Multi-version schema validation (1.0.0 → 1.6.0-rc)
- Schema version management system
- Compatibility checking between versions
- Security validation
- Certification system with scoring

### Frontend
- Interactive JSON editor with Monaco
- Version selector
- Real-time validation
- Compatibility checker
- Certification dashboard

## Project Structure

```
opendelivery/
├── backend/                 # Backend service
│   ├── src/
│   │   ├── services/       # Core services
│   │   ├── controllers/    # API controllers
│   │   ├── models/        # Data models
│   │   ├── schemas/       # JSON schemas
│   │   └── utils/         # Utility functions
│   ├── tests/             # Backend tests
│   └── package.json       # Backend dependencies
├── frontend/              # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
└── docs/                 # Documentation
    ├── SUPPORT.md        # Support documentation
    └── API.md           # API documentation
```

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9
- TypeScript >= 5.0

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/opendelivery.git
cd opendelivery
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Development

1. Start the backend service:
```bash
cd backend
npm run dev
```

2. Start the frontend application:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## API Endpoints

- `POST /validate` - Validate schema
- `POST /compatibility` - Check version compatibility
- `GET /breaking-changes` - Get breaking changes between versions
- `POST /certify` - Get OpenDelivery Ready certification
- `GET /health` - Service health check

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and documentation, please refer to the [SUPPORT.md](docs/SUPPORT.md) file.
