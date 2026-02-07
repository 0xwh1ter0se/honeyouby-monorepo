
// Run this script with: node generate-secret.js
const crypto = require('crypto');
const secret = crypto.randomBytes(32).toString('hex');
console.log('Your BETTER_AUTH_SECRET is:');
console.log(secret);
console.log('\nMake sure to add this to your Environment Variables in Vercel/Render!');
