import { map } from 'lodash'
import { Loading } from '@/components/Layouts'
import { BasicModal } from '@/layouts'
import { useEffect, useState } from 'react'
import { formatDate } from '@/helpers'
import { VisitaTecnicaDetalles } from '../VisitaTecnicaDetalles'
import { FaUserCog } from 'react-icons/fa'
import styles from './VisitaTecnicaListSearch.module.css'

export function VisitaTecnicaListSearch(props) {

  const { reload, onReload, visitatecnica, onToastSuccessMod, onToastSuccessDel } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [visitatecnicaSeleccionado, setVisitatecnicaSeleccionado] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (visitatecnica) => {
    setVisitatecnicaSeleccionado(visitatecnica)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setVisitatecnicaSeleccionado(null)
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
          {map(visitatecnica, (visitatecnica) => (
            <div key={visitatecnica.id} className={styles.section} onClick={() => onOpenDetalles(visitatecnica)}>
              <div>
                <div className={styles.column1}>
                  <FaUserCog />
                </div>
                <div className={styles.column2}>
                  <div >
                    <h1>Visita técnica</h1>
                    <h2>{visitatecnica.visitatecnica}</h2>
                  </div>
                  <div >
                    <h1>Fecha</h1>
                    <h2>{formatDate(visitatecnica.date)}</h2>
                  </div>
                  <div>
                    <h1>Estatus</h1>
                    <h2>{visitatecnica.estado}</h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      }

      <BasicModal title='detalles de la visita técnica' show={showDetalles} onClose={onCloseDetalles}>
        {visitatecnicaSeleccionado && (
          <VisitaTecnicaDetalles
            reload={reload}
            onReload={onReload}
            visitatecnica={visitatecnicaSeleccionado}
            onCloseDetalles={onCloseDetalles}
            onToastSuccessMod={onToastSuccessMod}
            onToastSuccessDel={onToastSuccessDel}
          />
        )}
      </BasicModal>

    </>

  )
}
