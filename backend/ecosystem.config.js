module.exports = {
  apps: [{
    name: 'opendelivery-backend',
    script: 'dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      CORS_ORIGIN: 'https://fazmercado.com',
      LOG_LEVEL: 'info'
    }
  }]
};
