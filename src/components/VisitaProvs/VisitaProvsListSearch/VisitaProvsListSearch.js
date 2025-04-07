import { map } from 'lodash'
import { Loading } from '@/components/Layouts'
import { FaUserMd } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { useState } from 'react'
import { VisitaProvDetalles } from '../VisitaProvDetalles'
import styles from './VisitaProvsListSearch.module.css'
import { formatDateVT } from '@/helpers'

export function VisitaProvsListSearch(props) {

  const { reload, onReload, visitaprovs, onToastSuccessMod, onToastSuccessDel } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [visitaprovSeleccionado, setVisitaprovSeleccionado] = useState(null)

  const onOpenDetalles = (visitaprov) => {
    setVisitaprovSeleccionado(visitaprov)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setVisitaprovSeleccionado(null)
    setShowDetalles(false)
  }

  return (

    <>

      {!visitaprovs ?
        <Loading size={45} loading={1} /> :
        <div className={styles.main}>
          {map(visitaprovs, (visitaprov) => (
            <div key={visitaprov.id} className={styles.section} onClick={() => onOpenDetalles(visitaprov)}>
              <div>
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
          ))}
        </div>
      }

      <BasicModal title='detalles de la visita proveedor' show={showDetalles} onClose={onCloseDetalles}>
        {visitaprovSeleccionado && (
          <VisitaProvDetalles
            reload={reload}
            onReload={onReload}
            visitaprov={visitaprovSeleccionado}
            onCloseDetalles={onCloseDetalles}
            onToastSuccessMod={onToastSuccessMod}
            onToastSuccessDel={onToastSuccessDel}
          />
        )}
      </BasicModal>

    </>

  )
}
