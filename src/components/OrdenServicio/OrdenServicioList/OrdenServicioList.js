import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaFileAlt } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { OrdenServicioDetalles } from '../OrdenServicioDetalles'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { formatDate } from '@/helpers'
import { getStatusClass } from '@/helpers/getStatusClass/getStatusClass'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './OrdenServicioList.module.css'

export function OrdenServicioList(props) {

  const { reload, onReload, ordenservicio, onToastSuccessMod, onToastSuccessDel } = props

  const { loading } = useAuth()

  const [showDetalles, setShowDetalles] = useState(false)
  const [ordenservicioSeleccionada, setOrdenservicioSeleccionada] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (ordenservicio) => {
    setOrdenservicioSeleccionada(ordenservicio)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setOrdenservicioSeleccionada(null)
    setShowDetalles(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 800) 

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <>

      {showLoading ? (
        <Loading size={45} loading={1} />
      ) : (
        size(ordenservicio) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(ordenservicio, (ordenservicio) => {
              const statusClass = getStatusClass(ordenservicio.estado)

              return (
                <div key={ordenservicio.id} className={styles.section} onClick={() => onOpenDetalles(ordenservicio)}>
                  <div className={`${styles[statusClass]}`}>
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
              )
            })}
          </div>
        )
      )}

      <BasicModal title='detalles de la órden de servicio' show={showDetalles} onClose={onCloseDetalles}>
        {ordenservicioSeleccionada && (
          <OrdenServicioDetalles
            reload={reload}
            onReload={onReload}
            ordenservicio={ordenservicioSeleccionada}
            onCloseDetalles={onCloseDetalles}
            onToastSuccessMod={onToastSuccessMod}
            onToastSuccessDel={onToastSuccessDel}
          />
        )}
      </BasicModal>

    </>

  )
}
