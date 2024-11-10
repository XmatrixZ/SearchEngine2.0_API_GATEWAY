const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

// Encryption parameters
const algorithm = process.env.ALGORITHM; // Same algorithm used for encryption
const key = Buffer.from(process.env.DECRYPT_SECRET_KEY, 'hex'); // Same key used for encryption
const iv = Buffer.from(process.env.DECRYPT_IV, 'hex'); // Same IV used for encryption

// Data to encrypt
const dataToEncrypt = JSON.stringify({
  email: 'shivansh121546@gmail.com',
  password: '1234',
});

// Encryption
const cipher = crypto.createCipheriv(algorithm, key, iv);
const encryptedPayload = cipher.update(dataToEncrypt, 'utf8', 'hex');

console.log(encryptedPayload);
