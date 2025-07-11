const https = require('https');
const fs = require('fs');
const path = require('path');

const SCHEMA_VERSIONS = [
  { version: 'beta', url: 'https://abrasel-nacional.github.io/docs/versions/beta/openapi.yaml' },
  { version: '1.6.0-rc', url: 'https://abrasel-nacional.github.io/docs/versions/rc/openapi.yaml' },
  { version: '1.5.0', url: 'https://abrasel-nacional.github.io/docs/openapi.yaml' }, // Latest stable version
  { version: '1.4.0', url: 'https://abrasel-nacional.github.io/docs/versions/1.4.0/openapi.yaml' },
  { version: '1.3.0', url: 'https://abrasel-nacional.github.io/docs/versions/1.3.0/openapi.yaml' },
  { version: '1.2.1', url: 'https://abrasel-nacional.github.io/docs/versions/1.2.1/openapi.yaml' },
  { version: '1.2.0', url: 'https://abrasel-nacional.github.io/docs/versions/1.2.0/openapi.yaml' },
  { version: '1.1.1', url: 'https://abrasel-nacional.github.io/docs/versions/1.1.1/openapi.yaml' },
  { version: '1.1.0', url: 'https://abrasel-nacional.github.io/docs/versions/1.1.0/openapi.yaml' },
  { version: '1.0.1', url: 'https://abrasel-nacional.github.io/docs/versions/1.0.1/openapi.yaml' },
  { version: '1.0.0', url: 'https://abrasel-nacional.github.io/docs/versions/1.0.0/openapi.yaml' }
];

const SCHEMAS_DIR = path.join(__dirname, '..', 'schemas');

// Create schemas directory if it doesn't exist
if (!fs.existsSync(SCHEMAS_DIR)) {
  fs.mkdirSync(SCHEMAS_DIR);
}

function downloadSchema(version, url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download schema ${version}: ${response.statusCode}`));
        return;
      }

      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        const filePath = path.join(SCHEMAS_DIR, `${version}.yaml`);
        fs.writeFileSync(filePath, data);
        console.log(`Downloaded schema ${version}`);
        resolve();
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadAllSchemas() {
  console.log('Starting schema downloads...');
  
  for (const schema of SCHEMA_VERSIONS) {
    try {
      await downloadSchema(schema.version, schema.url);
    } catch (error) {
      console.error(`Error downloading schema ${schema.version}:`, error.message);
    }
  }
  
  console.log('Finished downloading schemas');
}

downloadAllSchemas(); 