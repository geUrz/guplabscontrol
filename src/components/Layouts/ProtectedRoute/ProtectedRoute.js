import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Loading } from '../Loading';
import styles from './ProtectedRoute.module.css'
import { FaInfoCircle } from 'react-icons/fa';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  const isUserActive = useMemo(() => user?.isactive === 1, [user])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/join/signin')
    }
  }, [loading, user, router])

  if (loading || !user) {
    return <Loading size={45} loading={'L'} />
  }

  if (!isUserActive) {
    return (
      <div className={styles.bannerNoActive}>
        <div>
          <FaInfoCircle />
          <h1>¡ Usuario desactivado !</h1>
          <h2>Su cuenta presenta un atraso en el pago. Por favor, póngase en contacto con el comité para resolverlo.</h2>
        </div>
      </div>
    )
  }

  return children;
}
