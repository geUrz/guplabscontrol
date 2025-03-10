import { map, size } from 'lodash'
import { ListEmpty, Loading } from '@/components/Layouts'
import { FaUsers } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { useState } from 'react'
import { UsuarioDetalles } from '../UsuarioDetalles'
import { getStatusClass } from '@/helpers/getStatusClass/getStatusClass'
import styles from './UsuariosListSearch.module.css'

export function UsuariosListSearch(props) {

  const { reload, onReload, usuarios, onToastSuccessUsuarioMod } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [usuarioSeleccionada, setUsuarioSeleccionada] = useState(null)

  const onOpenDetalles = (usuario) => {
    setUsuarioSeleccionada(usuario)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setUsuarioSeleccionada(null)
    setShowDetalles(false)
  }

  return (

    <>

      {!usuarios ? (
        <Loading size={45} loading={1} />
      ) : (
        size(usuarios) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(usuarios, (usuario) => {
              const statusClass = getStatusClass(usuario.estado)

              return (
                <div key={usuario.id} className={styles.section} onClick={() => onOpenDetalles(usuario)}>
                  <div className={`${styles[statusClass]}`}>
                    <div className={styles.column1}>
                      <FaUsers />
                    </div>
                    <div className={styles.column2}>
                      <div >
                        <h1>Nombre</h1>
                        <h2>{usuario.nombre}</h2>
                      </div>
                      <div >
                        <h1>Usuario</h1>
                        <h2>{usuario.usuario}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      <BasicModal title='detalles del usuario' show={showDetalles} onClose={onCloseDetalles}>
        {usuarioSeleccionada && (
          <UsuarioDetalles
            reload={reload}
            onReload={onReload}
            usuario={usuarioSeleccionada}
            onOpenCloseDetalles={onCloseDetalles}
            onToastSuccessUsuarioMod={onToastSuccessUsuarioMod}
          />
        )}
      </BasicModal>

    </>

  )
}
