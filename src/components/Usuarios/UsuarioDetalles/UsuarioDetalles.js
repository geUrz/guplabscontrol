import { IconClose } from '@/components/Layouts';
import { BasicModal } from '@/layouts';
import { FaEdit } from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './UsuarioDetalles.module.css';
import { ResidenteEditForm } from '../ResidenteEditForm';
import { UsuarioEditForm } from '../UsuarioEditForm';

export function UsuarioDetalles(props) {

  const { reload, onReload, usuario, onOpenCloseDetalles, onToastSuccessUsuarioMod } = props

  const { user } = useAuth()

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  let isActive = ''

  if (usuario.isactive === 1) {
      isActive = 'Activo'
  } else {
      isActive = 'Inactivo'
  }

  return (
    <>
      <IconClose onOpenClose={onOpenCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Nombre</h1>
              <h2>{usuario.nombre}</h2>
            </div>
            <div>
              <h1>Usuario</h1>
              <h2>{usuario.usuario}</h2>
            </div>
            {usuario.isadmin === 'Residente' ?
              <>
                <div>
                  <h1>Privada</h1>
                  <h2>{usuario.privada}</h2>
                </div>
                <div>
                  <h1>Casa</h1>
                  <h2>#{usuario.casa}</h2>
                </div>
              </> : ''
            }
            <div>
              <h1>Nivel</h1>
              <h2>{usuario.isadmin}</h2>
            </div>
            <div>
              <h1>Estatus</h1>
              <h2>{isActive}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{usuario.folio}</h2>
            </div>
            <div>
              <h1>Residencial</h1>
              <h2>{usuario.residencial_nombre}</h2>
            </div>
            {usuario.isadmin === 'Residente' ?
              <>

                <div>
                  <h1>Calle</h1>
                  <h2>{usuario.calle}</h2>
                </div>
              </> : ''
            }
            <div>
              <h1>Correo</h1>
              <h2>{usuario.email}</h2>
            </div>

          </div>
        </div>

        {user && user.isadmin === 'Admin' ? (
          <>

            <div className={styles.iconEdit}>
              <FaEdit onClick={onOpenClose} />
            </div>

          </>
        ) : (
          ''
        )}
      </div>

      <BasicModal title='Modificar usuario' show={show} onClose={onOpenClose}>
        <UsuarioEditForm reload={reload} onReload={onReload} usuario={usuario} onOpenClose={onOpenClose} onToastSuccessUsuarioMod={onToastSuccessUsuarioMod} />
      </BasicModal>


    </>
  )
}
