import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaBuilding } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { ResidencialDetalles } from '../ResidencialDetalles'
import { useState } from 'react'
import { getStatusClass } from '@/helpers/getStatusClass/getStatusClass'
import styles from './ResidencialList.module.css'

export function ResidencialList(props) {

  const { user, reload, onReload, residenciales, onToastSuccessMod } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [residencialSeleccionado, setReporteSeleccionada] = useState(null)

  const onOpenDetalles = (residencial) => {
    setReporteSeleccionada(residencial)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setReporteSeleccionada(null)
    setShowDetalles(false)
  }

  return (

    <>

      {!residenciales ? (
        <Loading size={45} loading={1} />
      ) : (
        size(residenciales) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(residenciales, (residencial) => {
              const statusClass = getStatusClass(residencial.estado)

              return (
                <div key={residencial.id} className={styles.section} onClick={() => onOpenDetalles(residencial)}>
                  <div className={`${styles[statusClass]}`}>
                    <div className={styles.column1}>
                      <FaBuilding />
                    </div>
                    <div className={styles.column2}>
                      <div >
                        <h1>Residencial</h1>
                        <h2>{residencial.nombre}</h2>
                      </div>
                      <div >
                        <h1>Dirección</h1>
                        <h2>{residencial.direccion}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      <BasicModal title='detalles del residencial' show={showDetalles} onClose={onCloseDetalles}>
        {residencialSeleccionado && (
          <ResidencialDetalles
            user={user}
            reload={reload}
            onReload={onReload}
            residencial={residencialSeleccionado}
            onCloseDetalles={onCloseDetalles}
            onToastSuccessMod={onToastSuccessMod}
          />
        )}
      </BasicModal>

    </>

  )
}
