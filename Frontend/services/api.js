const BASE_URL = 'http://192.168.0.232:8081';

export async function loginUsuario(mail, clave) {
  try {
    const response = await fetch(`${BASE_URL}/usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `mail=${encodeURIComponent(mail)}&clave=${encodeURIComponent(clave)}`
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Error al iniciar sesión');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en loginUsuario:', error.message);
    throw error;
  }
}
export async function obtenerRecetas() {
  const response = await fetch(`${BASE_URL}/recetas/recientes`);
  if (!response.ok) throw new Error('Error al obtener recetas');
  return await response.json();
}

