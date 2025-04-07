import Link from 'next/link'
import styles from './Card.module.css'
import { useEffect, useState } from 'react'
import { LoadingMini } from '@/components/Layouts'

export function Card(props) {

  const {
    children, title, link, count=true, countVisitas, countIncidencias, countAnuncios, countVisitaprovedores, countResidenciales, countUsuarios, countResidentes, countReportevisitas
  } = props

  const [loading, setLoading] = useState(true)

  // Objeto que contiene los contadores
  const counts = {
    '/visitas': countVisitas,
    '/incidencias': countIncidencias,
    '/anuncios': countAnuncios,
    '/visitaprovedores': countVisitaprovedores,
    '/residenciales': countResidenciales,
    '/usuarios': countUsuarios,
    '/residentes': countResidentes,
    '/reportevisitas': countReportevisitas
  }

  // Simulamos que los datos están siendo cargados
  useEffect(() => {
    // Este `setTimeout` es solo para simular que los datos están siendo cargados,
    // puedes eliminarlo si ya tienes la lógica para obtener los datos desde una API.
    const timer = setTimeout(() => {
      setLoading(false)
    }, 600) // Esto es solo para simular el "loading"

    return () => clearTimeout(timer)
  }, [])

  // Mostramos el contador real solo cuando `loading` sea false
  return (
    <Link href={`${link}`} className={styles.card}>
      <div>
        {children}
      </div>
      <div>
        {loading ? (
          // Muestra el LoadingMini solo cuando estamos cargando
          <LoadingMini />
        ) : (
          // Muestra el número directamente cuando ya no estamos cargando
          count ? <h1>{counts[link] || 0}</h1> : ''
        )}
        <h2>{title}</h2>
      </div>
    </Link>
  )
}
