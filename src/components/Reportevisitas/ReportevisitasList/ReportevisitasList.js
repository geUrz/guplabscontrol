import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaUserFriends } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { ReportevisitaDetalles, VisitaDetalles } from '../ReportevisitaDetalles'
import { useEffect, useState } from 'react'
import { getStatusClassVisita } from '@/helpers/getStatusClass/getStatusClass'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './ReportevisitasList.module.css'

export function ReportevisitasList(props) {

  const { reload, onReload, reporteVisitas, onToastSuccessDel } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [reporteVisitaSeleccionada, setReportevisitaSeleccionada] = useState(null)

  const onOpenDetalles = (reporteVisitas) => {
    setReportevisitaSeleccionada(reporteVisitas)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setReportevisitaSeleccionada(null)
    setShowDetalles(false)
  }

  return (

    <>

      {!reporteVisitas ? (
        <Loading size={45} loading={1} />
      ) : (
        size(reporteVisitas) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(reporteVisitas, (visita) => {
              const statusClass = getStatusClassVisita(visita.estado)

              return (
                <div key={visita.id} className={styles.section} onClick={() => onOpenDetalles(visita)}>
                  <div className={`${styles[statusClass]}`}>
                    <div className={styles.column1}>
                      <FaUserFriends />
                    </div>
                    <div className={styles.column2}>
                      <div >
                        <h1>Nombre de la visita</h1>
                        <h2>{visita.visita}</h2>
                      </div>
                      <div >
                        <h1>Tipo de visita</h1>
                        <h2>{visita.tipovisita}</h2>
                      </div>
                      <div>
                        <h1>Acción</h1>
                        <h2>{visita.action}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      <BasicModal title='detalles de la visita' show={showDetalles} onClose={onCloseDetalles}>
        {reporteVisitaSeleccionada && (
          <ReportevisitaDetalles
            reload={reload}
            onReload={onReload}
            reporteVisita={reporteVisitaSeleccionada}
            onCloseDetalles={onCloseDetalles}
            onToastSuccessDel={onToastSuccessDel}
          />
        )}
      </BasicModal>

    </>

  )
}
