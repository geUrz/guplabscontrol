const webPush = require('web-push');

// Genera las claves VAPID
const vapidKeys = webPush.generateVAPIDKeys();

// Muestra las claves generadas
console.log('Public Key:', vapidKeys.publicKey);
console.log('Private Key:', vapidKeys.privateKey);
