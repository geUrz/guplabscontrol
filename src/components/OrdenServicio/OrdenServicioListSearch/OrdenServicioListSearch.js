import { map } from 'lodash'
import { Loading } from '@/components/Layouts'
import { BasicModal } from '@/layouts'
import { useEffect, useState } from 'react'
import { formatDate } from '@/helpers'
import { OrdenServicioDetalles } from '../OrdenServicioDetalles'
import { FaFileAlt } from 'react-icons/fa'
import styles from './OrdenServicioListSearch.module.css'

export function OrdenServicioListSearch(props) {

  const { reload, onReload, ordenservicio, onToastSuccessMod, onToastSuccessDel } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [ordenservicioSeleccionado, setOrdenservicioSeleccionado] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (ordenservicio) => {
    setOrdenservicioSeleccionado(ordenservicio)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setOrdenservicioSeleccionado(null)
    setShowDetalles(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (

    <>

      {showLoading ?
        <Loading size={45} loading={1} /> :
        <div className={styles.main}>
          {map(ordenservicio, (ordenservicio) => (
            <div key={ordenservicio.id} className={styles.section} onClick={() => onOpenDetalles(ordenservicio)}>
              <div>
                <div className={styles.column1}>
                  <FaFileAlt />
                </div>
                <div className={styles.column2}>
                  <div >
                    <h1>Orden de servicio</h1>
                    <h2>{ordenservicio.nombre}</h2>
                  </div>
                  <div >
                    <h1>Fecha</h1>
                    <h2>{formatDate(ordenservicio.date)}</h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      }

      <BasicModal title='detalles de la orden de servicio' show={showDetalles} onClose={onCloseDetalles}>
        {ordenservicioSeleccionado && (
          <OrdenServicioDetalles
            reload={reload}
            onReload={onReload}
            ordenservicio={ordenservicioSeleccionado}
            onCloseDetalles={onCloseDetalles}
            onToastSuccessMod={onToastSuccessMod}
            onToastSuccessDel={onToastSuccessDel}
          />
        )}
      </BasicModal>

    </>

  )
}
