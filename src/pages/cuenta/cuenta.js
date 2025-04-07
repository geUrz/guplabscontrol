import { BasicLayout, BasicModal } from '@/layouts'
import { FaEdit, FaUser } from 'react-icons/fa'
import { ModUsuarioForm, ModResidenteForm } from '@/components/Cuenta'
import { useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { IconEdit, Loading, ToastSuccess } from '@/components/Layouts'
import { Button } from 'semantic-ui-react'
import styles from './cuenta.module.css'
import { getValueOrDefault } from '@/helpers'

export default function Cuenta() {

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const { user, loading, logout } = useAuth()

  const [toastSuccessMod, setToastSuccessMod] = useState(false)

  const onToastSuccessMod = () => {
    setToastSuccessMod(true)
    setTimeout(() => {
      setToastSuccessMod(false)
    }, 3000)
  }

  const permissions = useMemo(() => {

    if (!user) return {}

    return {
      showDatosAdmin: ['Admin', 'Técnico', 'Caseta'].includes(user?.isadmin),
      showDatosResidente: ['ComitéSU', 'Comité', 'Residente'].includes(user?.isadmin)
    }

  }, [user])

  if (loading || !user) {
    return <Loading size={45} loading={'L'} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout title='cuenta' relative onReload={onReload}>

        {toastSuccessMod && <ToastSuccess contain='Modificado exitosamente' onClose={() => setToastSuccessMod(false)} />}


        <div className={styles.main}>
          <div className={styles.section}>
            <div className={styles.iconUser}>
              <FaUser />
            </div>

            <h1>{user.usuario}</h1>

            {permissions.showDatosAdmin &&
              <>
                <div>
                  <h1>Nombre:</h1>
                  <h2>{getValueOrDefault(user.nombre)}</h2>
                </div>
                <div>
                  <h1>Correo:</h1>
                  <h2>{getValueOrDefault(user.email)}</h2>
                </div>
                <div>
                  <h1>Residencial:</h1>
                  <h2>{getValueOrDefault(user.nombre_residencial)}</h2>
                </div>
                <div>
                  <h1>Nivel:</h1>
                  <h2>{getValueOrDefault(user.isadmin)}</h2>
                </div>
              </>
            }

            {permissions.showDatosResidente &&
              <>
                <div>
                  <h1>Nombre:</h1>
                  <h2>{getValueOrDefault(user.nombre)}</h2>
                </div>
                <div>
                  <h1>Privada:</h1>
                  <h2>{getValueOrDefault(user.privada)}</h2>
                </div>
                <div>
                  <h1>Calle:</h1>
                  <h2>{getValueOrDefault(user.calle)}</h2>
                </div>
                <div>
                  <h1>Casa:</h1>
                  <h2>#{getValueOrDefault(user.casa)}</h2>
                </div>
                <div>
                  <h1>Correo:</h1>
                  <h2>{getValueOrDefault(user.email)}</h2>
                </div>
                <div>
                  <h1>Residencial:</h1>
                  <h2>{getValueOrDefault(user.nombre_residencial)}</h2>
                </div>
                <div>
                  <h1>Nivel:</h1>
                  <h2>{getValueOrDefault(user.isadmin)}</h2>
                </div>
              </>
            }

            <div className={styles.iconEdit}>
              <IconEdit onOpenEdit={onOpenClose} />
            </div>

            <Button negative onClick={logout}>
              Cerrar sesión
            </Button>
          </div>

        </div>

        {permissions.showDatosAdmin &&
          <BasicModal title='Modificar usuario' show={show} onClose={onOpenClose}>
            <ModUsuarioForm user={user} onOpenClose={onOpenClose} onToastSuccessMod={onToastSuccessMod} />
          </BasicModal>
        }

        {permissions.showDatosResidente &&
          <BasicModal title='Modificar residente' show={show} onClose={onOpenClose}>
            <ModResidenteForm user={user} onOpenClose={onOpenClose} onToastSuccessMod={onToastSuccessMod} />
          </BasicModal>
        }

      </BasicLayout>

    </ProtectedRoute >

  )
}
