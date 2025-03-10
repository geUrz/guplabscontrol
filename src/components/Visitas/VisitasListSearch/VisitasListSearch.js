import { map, size } from 'lodash'
import { ListEmpty } from '../../Layouts/ListEmpty'
import { Loading } from '../../Layouts/Loading'
import { FaUserFriends } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { useState } from 'react'
import styles from './VisitasListSearch.module.css'
import { VisitaDetalles } from '@/components/Visitas'

export function VisitasListSearch(props) {

  const { user, reload, onReload, visitas, onToastSuccessMod, onToastSuccessDel } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [visitaSeleccionada, setVisitaSeleccionada] = useState(null)

  const onOpenDetalles = (visita) => {
    setVisitaSeleccionada(visita)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setVisitaSeleccionada(null)
    setShowDetalles(false)
  }

  return (

    <>

      {!visitas ? (
        <Loading size={45} loading={1} />
      ) : (
        size(visitas) === 0 ? (
          <ListEmpty />
        ) : (

          <div className={styles.main}>
            {map(visitas, (visita) => (
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
                      <h1>Tipo de acceso</h1>
                      <h2>{visita.tipoacceso}</h2>
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
        {visitaSeleccionada && (
          <VisitaDetalles
            user={user}
            reload={reload}
            onReload={onReload}
            visita={visitaSeleccionada}
            onCloseDetalles={onCloseDetalles}
            onToastSuccessMod={onToastSuccessMod}
            onToastSuccessDel={onToastSuccessDel}
          />
        )}
      </BasicModal>

    </>

  )
}
