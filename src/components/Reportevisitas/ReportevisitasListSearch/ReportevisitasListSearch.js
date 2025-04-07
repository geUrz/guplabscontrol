import { map, size } from 'lodash'
import { ListEmpty } from '../../Layouts/ListEmpty'
import { Loading } from '../../Layouts/Loading'
import { FaUserFriends } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { useState } from 'react'
import styles from './ReportevisitasListSearch.module.css'
import { VisitaDetalles } from '@/components/Visitas'
import { ReportevisitaDetalles } from '../ReportevisitaDetalles'

export function ReportevisitasListSearch(props) {

  const { reporteVisitas } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [reporteVisitaSeleccionada, setVisitaSeleccionada] = useState(null)

  const onOpenDetalles = (reporteVisitas) => {
    setVisitaSeleccionada(reporteVisitas)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setVisitaSeleccionada(null)
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
            {map(reporteVisitas, (visita) => (
              <div key={visita.id} className={styles.section} onClick={() => onOpenDetalles(visita)}>
                <div>
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
            )}
          </div>

        )
      )}

      <BasicModal title='detalles de la visita' show={showDetalles} onClose={onCloseDetalles}>
        {reporteVisitaSeleccionada && (
          <ReportevisitaDetalles
            reporteVisita={reporteVisitaSeleccionada}
            onCloseDetalles={onCloseDetalles}
          />
        )}
      </BasicModal>

    </>

  )
}
