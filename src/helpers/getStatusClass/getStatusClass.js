// utils/getStatusClass.js
export function getStatusClass(estado) {
  if (estado === 'En proceso') {
    return 'inProcess';
  }
  if (estado === 'Realizada') {
    return 'realizada';
  }
  return ''; // Retorna una clase por defecto o una cadena vacía si no coincide con ninguna condición
}

export function getStatusClassVisita(estado) {
  if (estado === 'Sin ingresar') {
    return 'sinIngresar';
  }
  if (estado === 'Ingresado') {
    return 'ingresado';
  }
  if (estado === 'Retirado') {
    return 'retirado';
  }
  return ''; // Retorna una clase por defecto o una cadena vacía si no coincide con ninguna condición
}
