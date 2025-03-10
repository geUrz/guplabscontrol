import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaUserMd } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { VisitaProvDetalles } from '../VisitaProvDetalles'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { formatDateVT } from '@/helpers'
import { getStatusClassVisita } from '@/helpers/getStatusClass/getStatusClass'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './VisitaProvsList.module.css'

export function VisitaProvsList(props) {

  const { reload, onReload, visitaprovs, onToastSuccessMod, onToastSuccessDel } = props

  const { loading } = useAuth()
  
  const [showDetalles, setShowDetalles] = useState(false)
  const [visitaprovSeleccionada, setVisitaprovSeleccionada] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (visitaprov) => {
    setVisitaprovSeleccionada(visitaprov)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setVisitaprovSeleccionada(null)
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
        size(visitaprovs) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(visitaprovs, (visitaprov) => {
              const statusClass = getStatusClassVisita(visitaprov.estado)

              return (
                <div key={visitaprov.id} className={styles.section} onClick={() => onOpenDetalles(visitaprov)}>
                  <div className={`${styles[statusClass]}`}>
                    <div className={styles.column1}>
                      <FaUserMd />
                    </div>
                    <div className={styles.column2}>
                      <div >
                        <h1>Visita proveedor</h1>
                        <h2>{visitaprov.visitaprovedor}</h2>
                      </div>
                      <div>
                        <h1>Fecha</h1>
                        <h2>{formatDateVT(visitaprov.createdAt)}</h2>
                      </div>
                      <div>
                        <h1>Autorizó</h1>
                        <h2>{visitaprov.usuario_nombre}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      <BasicModal title='detalles de la visita proveedor' show={showDetalles} onClose={onCloseDetalles}>
        {visitaprovSeleccionada && (
          <VisitaProvDetalles
            reload={reload}
            onReload={onReload}
            visitaprov={visitaprovSeleccionada}
            onCloseDetalles={onCloseDetalles}
            onToastSuccessMod={onToastSuccessMod}
            onToastSuccessDel={onToastSuccessDel}
          />
        )}
      </BasicModal>

    </>

  )
}
