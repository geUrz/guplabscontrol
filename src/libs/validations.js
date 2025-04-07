export function isUserActive(userData) {
  if (userData.isactive !== 1) {
    throw new Error('Usuario desactivado');
  }
}

export function isUserAdmin(userData) {
  if (userData.isadmin !== 'Admin') {
    throw new Error('Acceso denegado. Solo usuarios con permisos pueden acceder a esta página');
  }
}

export function hasPermission(userData, permission) {
  const permissions = {
    visitas: true,
    validarvisitas: userData.isadmin === 'Admin' || userData.isadmin === 'ComitéSU' || userData.isadmin === 'Caseta',
    incidencias: true,
    anuncios: true,
    visitaprovedores: true,
    usuarios: userData.isadmin === 'Admin',  
    residentes: userData.isadmin === 'Admin', 
    residenciales: userData.isadmin === 'Admin', 
    reportevisitas: userData.isadmin === 'Admin' || userData.isadmin === 'ComitéSU', 
  };

  if (!permissions[permission]) {
    throw new Error('¡No tiene permisos para acceder!');
  }
}
