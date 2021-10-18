if (!process.env.JWT_PRIVATE_KEY) {
  console.log('JWT_PRIVATE_KEY not defined. Exiting...');
  process.exit(1);
}

if (!process.env.IOT_API_KEY) {
  console.log('IOT_API_KEY not defined. Exiting...');
  process.exit(1);
}

console.log('All environment variables in place.');

require('./database').connect();
