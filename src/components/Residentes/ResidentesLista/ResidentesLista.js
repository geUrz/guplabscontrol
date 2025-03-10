import { useEffect, useState } from 'react'
import styles from './ResidentesLista.module.css'
import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaUsers } from 'react-icons/fa'
import { ResidenteDetalles } from '../ResidenteDetalles'
import { BasicModal } from '@/layouts'

export function ResidentesLista(props) {

  const { reload, onReload, residentes, onToastSuccessMod } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [residenteSeleccionado, setResidenteSeleccionado] = useState(null)
  const [showLoading, setShowLoading] = useState(false)

  const onOpenDetalles = (residente) => {
    setResidenteSeleccionado(residente)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setResidenteSeleccionado(null)
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

      {showLoading ? (
        <Loading size={45} loading={1} />
      ) : (
        size(residentes) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(residentes, (residente) => (
              <div key={residente.id} className={styles.section} onClick={() => onOpenDetalles(residente)}>
                <div>
                  <div className={styles.column1}>
                    <FaUsers />
                  </div>
                  <div className={styles.column2}>
                    <div >
                      <h1>Nombre</h1>
                      <h2>{residente.nombre}</h2>
                    </div>
                    <div >
                      <h1>Usuario</h1>
                      <h2>{residente.usuario}</h2>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='detalles del residente' show={showDetalles} onClose={onCloseDetalles}>
        {residenteSeleccionado && (
          <ResidenteDetalles
            reload={reload}
            onReload={onReload}
            residente={residenteSeleccionado}
            onOpenCloseDetalles={onCloseDetalles}
            onToastSuccessMod={onToastSuccessMod}
          />
        )}
      </BasicModal>

    </>

  )
}
