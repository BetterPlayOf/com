/* ==========================
   Registro — Frontend
   Compatible con tu HTML
========================== */

// ---------- Elementos ----------
const form = document.getElementById('registerForm');
const nameInput = document.getElementById('name');
const mcInput = document.getElementById('mcname');
const emailInput = document.getElementById('email');
const roleSelect = document.getElementById('role');

// ---------- Toast simple ----------
const toast = document.createElement('div');
toast.style.position = 'fixed';
toast.style.bottom = '20px';
toast.style.left = '50%';
toast.style.transform = 'translateX(-50%)';
toast.style.background = 'rgba(0,0,0,0.8)';
toast.style.color = '#fff';
toast.style.padding = '10px 18px';
toast.style.borderRadius = '8px';
toast.style.fontSize = '14px';
toast.style.display = 'none';
toast.style.zIndex = '9999';
document.body.appendChild(toast);

function showToast(msg, time = 3000) {
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', time);
}

// ---------- Validaciones ----------
function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------- IndexedDB (Base de datos local) ----------
const DB_NAME = 'better_play_db';
const STORE_NAME = 'registrations';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveRegistration(data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.add(data);

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

// ---------- Envío del formulario ----------
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const mcname = mcInput.value.trim();
    const email = emailInput.value.trim();
    const role = roleSelect.value;

    // Validaciones
    if (!name) return showToast('Por favor, introduce tu nombre');
    if (!mcname) return showToast('Introduce tu usuario de Minecraft');
    if (!email || !validEmail(email)) return showToast('Correo electrónico inválido');

    const data = {
      name,
      mcname,
      email,
      role,
      created_at: new Date().toISOString()
    };

    try {
      await saveRegistration(data);
      showToast('Solicitud enviada correctamente ✔');
      form.reset();
    } catch (err) {
      console.error(err);
      showToast('Error al guardar los datos');
    }
  });
}

window.addEventListener('load', () => {
  console.log('Registro listo, gracias por elegir Better Play');
});


