import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import { Loading } from '../Loading'
import axios from 'axios'
import { size } from 'lodash'

export default function ProtectedRouteNegocio(props) {

  const {children, ToastWarningNegocio} = props

  const { user, loading } = useAuth()
  const router = useRouter()
  const [businessLoaded, setBusinessLoaded] = useState(false)
  
  useEffect(() => {
    const checkBusiness = async () => {
      if (loading) return // Esperar hasta que la autenticación esté completa

      if (!user) {
        // Redirigir a la página de inicio de sesión si no está logueado
        router.push('/join/signin')
        return
      }

      try {
        const res = await axios.get(`/api/negocios/negocios?usuario_id=${user.id}`)
        
        if (res.data != null || res.data != undefined || size(res.data) != 0) {
          // Si el usuario tiene un negocio, redirigir inmediatamente a la página principal
          
          // Retrasar la redirección para mostrar el ToastWarning
          setTimeout(() => {
            router.replace('/');
          }, 1500); // 3 segundos de retraso (puedes ajustar el tiempo)

          return // Evitar que continúe la ejecución y renderice la página de registro
        } else {
          setBusinessLoaded(true); // Permitir la renderización del contenido si no tiene negocio
        }
      } catch (error) {
        console.error('Error al verificar los negocios del usuario:', error.message)
        setBusinessLoaded(true); // Permitir la renderización del contenido en caso de error
      }
    };

    checkBusiness()
  }, [loading, user, router])

  if (loading || !user || !businessLoaded) {
    return <Loading size={45} loading={0} />
  }

  // Renderizar el contenido de la página de registro solo si no tiene negocio
  return children
}
