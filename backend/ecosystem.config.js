module.exports = {
  apps: [{
    name: 'opendelivery-backend',
    script: 'dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3001,
      LOG_LEVEL: 'info'
    }
  }]
};
