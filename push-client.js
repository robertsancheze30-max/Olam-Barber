// push-client.js
// Maneja el registro del service worker y la suscripción push del admin

const VAPID_PUBLIC_KEY = "BBuGF90uhEswZN8BMZvSiGi_J-HC9KVgufxrJ5DzfcAcobmptKtVhUFpIVYRUHyluZzECw0xgaSiNAwdFsS3EfE";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function enablePushNotifications(barberoId) {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    alert("Este navegador no soporta notificaciones push.");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("No se otorgó permiso para notificaciones.");
      return;
    }

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }

    // Espera a que admin-src.html haya expuesto la conexion a Firebase
    let intentos = 0;
    while ((!window.__db || !window.__dbSet || !window.__dbRef) && intentos < 20) {
      await new Promise(r => setTimeout(r, 150));
      intentos++;
    }
    if (!window.__db) {
      alert("No se pudo conectar con la base de datos. Recarga la pagina e intenta de nuevo.");
      return;
    }

    await window.__dbSet(window.__dbRef(window.__db, "pushSubscriptions/" + barberoId), subscription.toJSON());

    alert("Notificaciones activadas correctamente.");
  } catch (err) {
    console.error("Error activando notificaciones push:", err);
    alert("Hubo un error activando las notificaciones.");
  }
}
