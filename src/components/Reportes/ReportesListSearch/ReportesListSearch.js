import { map } from 'lodash'
import { Loading } from '@/components/Layouts'
import { FaFileInvoice } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { formatDate } from '@/helpers'
import { ReporteDetalles } from '../ReporteDetalles'
import styles from './ReportesListSearch.module.css'

export function ReportesListSearch(props) {

  const { reload, onReload, reportes, onToastSuccessMod, onToastSuccessDel } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (reporte) => {
    setReporteSeleccionado(reporte)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setReporteSeleccionado(null)
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
            {map(reportes, (reporte) => (
             <div key={reporte.id} className={styles.section} onClick={() => onOpenDetalles(reporte)}>
             <div>
               <div className={styles.column1}>
                 <FaFileInvoice />
               </div>
               <div className={styles.column2}>
                 <div>
                   <h1>Reporte</h1>
                   <h2>{reporte.reporte}</h2>
                 </div>
                 <div>
                   <h1>Fecha</h1>
                   <h2>{formatDate(reporte.date)}</h2>
                 </div>
               </div>
             </div>
           </div>
            ))}
          </div>
      }

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
