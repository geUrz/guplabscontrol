import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaUserFriends } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { VisitaDetalles } from '../VisitaDetalles'
import { useEffect, useState } from 'react'
import { getStatusClassVisita } from '@/helpers/getStatusClass/getStatusClass'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './VisitasList.module.css'

export function VisitasList(props) {

  const { user, loading, reload, onReload, visitas, onToastSuccessVisita, onToastSuccessMod, onToastSuccessDel } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [visitaSeleccionada, setVisitaSeleccionada] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (visita) => {
    setVisitaSeleccionada(visita)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setVisitaSeleccionada(null)
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
        size(visitas) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(visitas, (visita) => {
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
                        <h1>Tipo de acceso</h1>
                        <h2>{visita.tipoacceso}</h2>
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
        {visitaSeleccionada && (
          <VisitaDetalles
            reload={reload}
            onReload={onReload}
            user={user}
            loading={loading}
            visita={visitaSeleccionada}
            onCloseDetalles={onCloseDetalles}
            onToastSuccessVisita={onToastSuccessVisita}
            onToastSuccessMod={onToastSuccessMod}
            onToastSuccessDel={onToastSuccessDel}
          />
        )}
      </BasicModal>

    </>

  )
}
