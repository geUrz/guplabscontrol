import { map } from 'lodash'
import { Loading } from '@/components/Layouts'
import { FaBuilding } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { useEffect, useState } from 'react'
import styles from './ResidencialesListSearch.module.css'
import { ResidencialDetalles } from '../ResidencialDetalles'

export function ResidencialesListSearch(props) {

  const { user, reload, onReload, residenciales, onToastSuccessMod, onToastSuccessDel } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [residencialSeleccionado, setResidencialSeleccionado] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (residencial) => {
    setResidencialSeleccionado(residencial)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setResidencialSeleccionado(null)
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
          {map(residenciales, (residencial) => (
            <div key={residencial.id} className={styles.section} onClick={() => onOpenDetalles(residencial)}>
              <div>
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
          ))}
        </div>
      }

      <BasicModal title='detalles del residencial' show={showDetalles} onClose={onCloseDetalles}>
        {residencialSeleccionado && (
          <ResidencialDetalles
            user={user}
            reload={reload}
            onReload={onReload}
            residencial={residencialSeleccionado}
            onCloseDetalles={onCloseDetalles}
            onToastSuccessMod={onToastSuccessMod}
            onToastSuccessDel={onToastSuccessDel}
          />
        )}
      </BasicModal>

    </>

  )
}
