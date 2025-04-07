import { EditPass, IconClose, IconEdit, IconKey } from '@/components/Layouts';
import { BasicModal } from '@/layouts';
import { FaEdit } from 'react-icons/fa';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './ResidenteDetalles.module.css';
import { ResidenteEditForm } from '../ResidenteEditForm';
import { getValueOrDefault } from '@/helpers';

export function ResidenteDetalles(props) {

  const { reload, onReload, residente, onOpenCloseDetalles, onToastSuccessMod } = props

  const { user } = useAuth()

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const [showEditPass, setShowEditPass] = useState(false)

  const onOpenCloseEditPass = () => setShowEditPass((prevState) => !prevState)

  const [residenteData, setResidenteData] = useState(residente)

  useEffect(() => {
    setResidenteData(residente)
  }, [residente])

  const actualizarResidente = (nuevaData) => {
    setResidenteData((prevState) => ({
      ...prevState,
      ...nuevaData,
    }))
  }

  let isActive = ''

  if (residenteData.isactive === 1) {
    isActive = 'Activo'
  } else {
    isActive = 'Inactivo'
  }

  const permissions = useMemo(() => {

    if (!user) return {}

    return{
      showDatosAdmin: ['Admin'].includes(user?.isadmin)
    }

  }, [user])

  return (
    <>
      <IconClose onOpenClose={onOpenCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Nombre</h1>
              <h2>{residenteData?.nombre}</h2>
            </div>
            <div>
              <h1>Usuario</h1>
              <h2>{residenteData?.usuario}</h2>
            </div>
            <div>
              <h1>Privada</h1>
              <h2>{getValueOrDefault(residenteData?.privada)}</h2>
            </div>
            <div>
              <h1>Casa</h1>
              <h2>#{getValueOrDefault(residenteData?.casa)}</h2>
            </div>
            <div>
              <h1>Nivel</h1>
              <h2>{residenteData?.isadmin}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{residenteData?.folio}</h2>
            </div>
            <div>
              <h1>Residencial</h1>
              <h2>{residenteData?.residencial_nombre}</h2>
            </div>
            <div>
              <h1>Calle</h1>
              <h2>{getValueOrDefault(residenteData?.calle)}</h2>
            </div>
            <div>
              <h1>Correo</h1>
              <h2>{getValueOrDefault(residenteData?.email)}</h2>
            </div>
            <div>
              <h1>Estatus</h1>
              <h2>{isActive}</h2>
            </div>
          </div>
        </div>

        {permissions.showDatosAdmin &&

          <>

            <IconKey residente={residente} onOpenCloseEditPass={onOpenCloseEditPass} />

            <IconEdit onOpenEdit={onOpenClose} />

          </>

        }

      </div>

      <BasicModal title='Modificar residente' show={show} onClose={onOpenClose}>
        <ResidenteEditForm reload={reload} onReload={onReload} residenteData={residenteData} actualizarResidente={actualizarResidente} onOpenClose={onOpenClose} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>

      <BasicModal title='Modificar contraseña' show={showEditPass} onClose={onOpenCloseEditPass}>
        <EditPass usuario={residente} onOpenCloseEditPass={onOpenCloseEditPass} onToastSuccessUsuarioMod={onToastSuccessMod} />
      </BasicModal>


    </>
  )
}
