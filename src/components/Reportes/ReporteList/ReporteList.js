import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaClipboard } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { ReporteDetalles } from '../ReporteDetalles'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { formatDate } from '@/helpers'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './ReporteList.module.css'

export function ReporteList(props) {

  const { reload, onReload, reportes, onToastSuccessMod, onToastSuccessDel } = props

  const { loading } = useAuth()

  const [showDetalles, setShowDetalles] = useState(false)
  const [reporteSeleccionado, setReporteSeleccionada] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (reporte) => {
    setReporteSeleccionada(reporte)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setReporteSeleccionada(null)
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
        size(reportes) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(reportes, (reporte) => (
                <div key={reporte.id} className={styles.section} onClick={() => onOpenDetalles(reporte)}>
                  <div>
                    <div className={styles.column1}>
                      <FaClipboard />
                    </div>
                    <div className={styles.column2}>
                      <div >
                        <h1>Reporte</h1>
                        <h2>{reporte.reporte}</h2>
                      </div>
                      <div >
                        <h1>Fecha</h1>
                        <h2>{formatDate(reporte.date)}</h2>
                      </div>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='detalles del reporte' show={showDetalles} onClose={onCloseDetalles}>
        {reporteSeleccionado && (
          <ReporteDetalles
            reload={reload}
            onReload={onReload}
            reporte={reporteSeleccionado}
            onCloseDetalles={onCloseDetalles}
            onToastSuccessMod={onToastSuccessMod}
            onToastSuccessDel={onToastSuccessDel}
          />
        )}
      </BasicModal>

    </>

  )
}
