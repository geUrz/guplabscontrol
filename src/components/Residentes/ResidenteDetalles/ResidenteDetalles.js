import { IconClose } from '@/components/Layouts';
import { BasicModal } from '@/layouts';
import { FaEdit } from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './ResidenteDetalles.module.css';
import { ResidenteEditForm } from '../ResidenteEditForm';

export function ResidenteDetalles(props) {

  const { reload, onReload, residente, onOpenCloseDetalles, onToastSuccessMod } = props

  const { user } = useAuth()
  
  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  let isActive = ''

  if (residente.isactive === 1) {
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
              <h2>{residente.nombre}</h2>
            </div>
            <div>
              <h1>Usuario</h1>
              <h2>{residente.usuario}</h2>
            </div>
            <div>
              <h1>Privada</h1>
              <h2>{residente.privada}</h2>
            </div>
            <div>
              <h1>Casa</h1>
              <h2>#{residente.casa}</h2>
            </div>
            <div>
              <h1>Nivel</h1>
              <h2>{residente.isadmin}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{residente.folio}</h2>
            </div>
            <div>
              <h1>Residencial</h1>
              <h2>{residente.residencial_nombre}</h2>
            </div>
            <div>
              <h1>Calle</h1>
              <h2>{residente.calle}</h2>
            </div>
            <div>
              <h1>Correo</h1>
              <h2>{residente.email}</h2>
            </div>
            <div>
              <h1>Estatus</h1>
              <h2>{isActive}</h2>
            </div>
          </div>
        </div>

        {user.isadmin === 'Admin' ? (
          <>

            <div className={styles.iconEdit}>
              <FaEdit onClick={onOpenClose} />
            </div>

          </>
        ) : (
          ''
        )}
      </div>

      <BasicModal title='Modificar residente' show={show} onClose={onOpenClose}>
        <ResidenteEditForm reload={reload} onReload={onReload} residente={residente} onOpenClose={onOpenClose} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>


    </>
  )
}
