import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaUsers } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { UsuarioDetalles } from '../UsuarioDetalles'
import { useState } from 'react'
import styles from './UsuarioList.module.css'

export function UsuarioList(props) {

  const { reload, onReload, usuarios, onToastSuccessUsuarioMod } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (usuario) => {
    setUsuarioSeleccionado(usuario)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setUsuarioSeleccionado(null)
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
            {map(usuarios, (usuario) => (
                <div key={usuario.id} className={styles.section} onClick={() => onOpenDetalles(usuario)}>
                  <div>
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
            )}
          </div>
        )
      )}

      <BasicModal title='detalles del usuario' show={showDetalles} onClose={onCloseDetalles}>
        {usuarioSeleccionado && (
          <UsuarioDetalles
            reload={reload}
            onReload={onReload}
            usuario={usuarioSeleccionado}
            onOpenCloseDetalles={onCloseDetalles}
            onToastSuccessUsuarioMod={onToastSuccessUsuarioMod}
          />
        )}
      </BasicModal>

    </>

  )
}
