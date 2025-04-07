import { map } from 'lodash'
import { Loading } from '@/components/Layouts'
import { FaCarCrash } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { useEffect, useState } from 'react'
import { formatDate } from '@/helpers'
import styles from './IncidenciasListSearch.module.css'
import { IncidenciaDetalles } from '../IncidenciaDetalles'

export function IncidenciasListSearch(props) {

  const { reload, onReload, incidencias, onToastSuccessMod, onToastSuccessDel } = props

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

      {!incidencias ?
        <Loading size={45} loading={1} /> :
        <div className={styles.main}>
          {map(incidencias, (incidencia) => (
            <div key={incidencia.id} className={styles.section} onClick={() => onOpenDetalles(incidencia)}>
              <div>
                <div className={styles.column1}>
                  <FaCarCrash />
                </div>
                <div className={styles.column2}>
                  <div>
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
          ))}
        </div>
      }

      <BasicModal title='detalles del incidencia' show={showDetalles} onClose={onCloseDetalles}>
        {incidenciaSeleccionada && (
          <IncidenciaDetalles
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
