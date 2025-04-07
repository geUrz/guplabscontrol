import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaCarCrash } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { IncidenciaDetalles } from '../IncidenciaDetalles'
import { useState } from 'react'
import { getStatusClass } from '@/helpers/getStatusClass/getStatusClass'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './IncidenciasList.module.css'

export function IncidenciasList(props) {

  const { user, reload, onReload, incidencias, onToastSuccessMod, onToastSuccessDel } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState(null)

  const onOpenDetalles = (incidencia) => {
    setIncidenciaSeleccionada(incidencia)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setIncidenciaSeleccionada(null)
    setShowDetalles(false)
  }

  return (

    <>

      {!incidencias ? (
        <Loading size={45} loading={1} />
      ) : (
        size(incidencias) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(incidencias, (incidencia) => {
              const statusClass = getStatusClass(incidencia.estado)

              return (
                <div key={incidencia.id} className={styles.section} onClick={() => onOpenDetalles(incidencia)}>
                  <div className={`${styles[statusClass]}`}>
                    <div className={styles.column1}>
                      <FaCarCrash />
                    </div>
                    <div className={styles.column2}>
                      <div >
                        <h1>Incidencia</h1>
                        <h2>{incidencia.incidencia}</h2>
                      </div>
                      <div >
                        <h1>Zona</h1>
                        <h2>{incidencia.zona}</h2>
                      </div>
                      <div>
                        <h1>Estatus</h1>
                        <h2>{incidencia.estado}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      <BasicModal title='detalles de la incidencia' show={showDetalles} onClose={onCloseDetalles}>
        {incidenciaSeleccionada && (
          <IncidenciaDetalles
          user={user}
            reload={reload}
            onReload={onReload}
            incidencia={incidenciaSeleccionada}
            onCloseDetalles={onCloseDetalles}
            onToastSuccessMod={onToastSuccessMod}
            onToastSuccessDel={onToastSuccessDel}
          />
        )}
      </BasicModal>

    </>

  )
}
