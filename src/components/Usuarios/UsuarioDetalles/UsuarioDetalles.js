import { IconClose, IconEdit, IconKey } from '@/components/Layouts';
import { BasicModal } from '@/layouts';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './UsuarioDetalles.module.css';
import { UsuarioEditForm } from '../UsuarioEditForm';
import { EditPass } from '../../Layouts/EditPass';
import { getValueOrDefault } from '@/helpers';

export function UsuarioDetalles(props) {

  const { reload, onReload, usuario, onOpenCloseDetalles, onToastSuccessUsuarioMod } = props

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const [showEditPass, setShowEditPass] = useState(false)

  const onOpenCloseEditPass = () => setShowEditPass((prevState) => !prevState)

  const [usuarioData, setUsuarioData] = useState(usuario)

  useEffect(() => {
    setUsuarioData(usuario)
  }, [usuario])

  const actualizarUsuario = (nuevaData) => {
    setUsuarioData((prevState) => ({
      ...prevState,
      ...nuevaData,
    }));
  }

  let isActive = ''

  if (usuarioData.isactive === 1) {
    isActive = 'Activo'
  } else {
    isActive = 'Inactivo'
  }

  const permissions = useMemo(() => {

    if (!usuario) return {}

    return {

      showAdmin: ['Admin'].includes(usuario.isadmin),
      showDatosAdmin: ['Admin', 'Técnico'].includes(usuario.isadmin),
      showDatosResidente: ['ComitéSU', 'Comité', 'Caseta'].includes(usuario.isadmin)

    }

  }, [usuario])

  return (
    <>
      <IconClose onOpenClose={onOpenCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Nombre</h1>
              <h2>{usuarioData?.nombre}</h2>
            </div>
            <div>
              <h1>Usuario</h1>
              <h2>{usuarioData?.usuario}</h2>
            </div>
            {permissions.showDatosResidente &&
              <>
                <div>
                  <h1>Privada</h1>
                  <h2>{getValueOrDefault(usuarioData?.privada)}</h2>
                </div>
                <div>
                  <h1>Calle</h1>
                  <h2>{getValueOrDefault(usuarioData?.calle)}</h2>
                </div>
              </>
            }
            <div>
              <h1>Nivel</h1>
              <h2>{usuarioData?.isadmin}</h2>
            </div>
            <div>
              <h1>Estatus</h1>
              <h2>{isActive}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{usuarioData?.folio}</h2>
            </div>
            <div>
              <h1>Residencial</h1>
              <h2>{usuarioData?.residencial_nombre}</h2>
            </div>
            {permissions.showDatosResidente &&
              <>

                <div>
                  <h1>Casa</h1>
                  <h2>#{getValueOrDefault(usuarioData?.casa)}</h2>
                </div>

              </>
            }
            <div>
              <h1>Correo</h1>
              <h2>{usuarioData?.email}</h2>
            </div>

          </div>
        </div>

        {permissions.showAdmin &&
          <>

            <IconKey usuario={usuario} onOpenCloseEditPass={onOpenCloseEditPass} />

            <IconEdit onOpenEdit={onOpenClose} />

          </>
        }
      </div>

      <BasicModal title='Modificar usuario' show={show} onClose={onOpenClose}>
        <UsuarioEditForm reload={reload} onReload={onReload} usuarioData={usuarioData} actualizarUsuario={actualizarUsuario} onOpenClose={onOpenClose} onToastSuccessUsuarioMod={onToastSuccessUsuarioMod} />
      </BasicModal>

      <BasicModal title='Modificar contraseña' show={showEditPass} onClose={onOpenCloseEditPass}>
        <EditPass usuario={usuario} onOpenCloseEditPass={onOpenCloseEditPass} onToastSuccessUsuarioMod={onToastSuccessUsuarioMod} />
      </BasicModal>


    </>
  )
}
