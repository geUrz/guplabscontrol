import { AuthProvider } from '@/contexts'
import 'semantic-ui-css/semantic.min.css'
import '@/styles/globals.css'
import { useEffect } from 'react'

export default function App(props) {
  const { Component, pageProps } = props

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        subscribeUserToPush();
      } else {
        console.error('Permiso para notificaciones denegado');
      }
    }
  };

  const subscribeUserToPush = async () => {
    if (!('serviceWorker' in navigator)) {
      console.error('Service Worker no soportado en este navegador.');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registrado con éxito:', registration);

      const readyRegistration = await navigator.serviceWorker.ready; 
      console.log('Service Worker está listo:', readyRegistration);

      const subscription = await readyRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });

      console.log('Suscripción creada:', subscription);

      // Enviar la suscripción al servidor
      const response = await fetch('/guardar-suscripcion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription }),
      });

      if (response.ok) {
        console.log('Suscripción guardada exitosamente');
      } else {
        console.error('Error al guardar la suscripción');
      }
    } catch (error) {
      console.error('Error en la suscripción:', error);
    }
  };

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registrado con éxito:', registration);
        })
        .catch(error => {
          console.error('Error al registrar el Service Worker:', error);
        });
    } else {
      console.warn('Service Workers no son compatibles en este navegador.');
    }

    requestNotificationPermission();
  }, [])

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
