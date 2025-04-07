const publicKey = 'BGBr3D7-Spcx08l-rcLhdg7qHxt7cmL9P4AvUxRLkD7S5EZuNdd9629wB0v_FJEgCXBIZ_s8Qremh0KTLrQi2Ms';

// Convierte la clave pública VAPID en un formato adecuado
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/\_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// Evento push
self.addEventListener('push', function(event) {
  if (event.notification) {
    event.notification.close(); // Cierra cualquier notificación anterior
  }

  // Verifica si hay una URL en los datos de la notificación, sino usa la ruta predeterminada
  const urlToOpen = event.notification?.data?.url || '/';
  console.log((urlToOpen));
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Asegúrate de que el código se ejecuta cuando el usuario interactúa directamente
      for (let client of clientList) {
        // Si la URL coincide y la ventana está abierta, darle foco
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }

      // Si no hay ventanas abiertas, intenta abrir una nueva, pero solo en respuesta al click
      return clients.openWindow(urlToOpen);
    })
  );

  let notificationData = { title: 'Notificación', body: 'Nuevo mensaje', icon: '/icons/click-192x192.png' };

  // Intenta extraer los datos de la notificación desde event.data si existen
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (error) {
      console.error('Error al procesar los datos de la notificación:', error);
    }
  }

  // Notificación que será mostrada
  const title = notificationData.title || 'Nueva Notificación';
  const options = {
    body: notificationData.body || 'Tienes una nueva notificación',
    icon: notificationData.icon || '/icons/clicknetcontrol-192x192.png',
    badge: notificationData.badge || '/badge.png',
  };

  event.waitUntil(
    // Muestra la notificación
    self.registration.showNotification(title, options)
  );
});
