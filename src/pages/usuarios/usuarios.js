import { Add, Loading, Title, ToastSuccess } from '@/components/Layouts'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { BasicLayout, BasicModal } from '@/layouts'
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { UsuarioForm, UsuarioList, SearchUsuarios, UsuariosListSearch } from '@/components/Usuarios'
import styles from './usuarios.module.css'

export default function Usuarios() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [search, setSearch] = useState(false)

  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)

  const [resultados, setResultados] = useState([])

  const [usuarios, setUsuarios] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/usuarios/usuarios?isadmin=Admin, Técnico')
        setUsuarios(res.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload])

  const [toastSuccessUsuario, setToastSuccessUsuario] = useState(false)
  const [toastSuccessUsuarioMod, setToastSuccessUsuarioMod] = useState(false)

  const onToastSuccessUsuario = () => {
    setToastSuccessUsuario(true)
    setTimeout(() => {
      setToastSuccessUsuario(false)
    }, 3000)
  }

  const onToastSuccessUsuarioMod = () => {
    setToastSuccessUsuarioMod(true)
    setTimeout(() => {
      setToastSuccessUsuarioMod(false)
    }, 3000)
  }

  const permissions = useMemo(() => {

    if(!user) return {}

    return {

      showDatosAdmin: ['Admin'].includes(user.isadmin)

    }

  }, [user])

  if (loading) {
    return <Loading size={45} loading={'L'} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout relative onReload={onReload}>

        <Title title='usuarios' />

        {toastSuccessUsuario && <ToastSuccess contain='Creado exitosamente' onClose={() => setToastSuccessUsuario(false)} />}

        {toastSuccessUsuarioMod && <ToastSuccess contain='Modificado exitosamente' onClose={() => setToastSuccessUsuarioMod(false)} />}

        {permissions.showDatosAdmin &&
          <Add onOpenClose={onOpenCloseForm} />
        }

        {!search ? (
          ''
        ) : (
          <div className={styles.searchMain}>
            <SearchUsuarios user={user} onResults={setResultados} reload={reload} onReload={onReload} onToastSuccessUsuarioMod={onToastSuccessUsuarioMod} onOpenCloseSearch={onOpenCloseSearch} />
            {resultados.length > 0 && (
              <UsuariosListSearch visitas={resultados} reload={reload} onReload={onReload} />
            )}
          </div>
        )}

        {!search ? (
          <div className={styles.iconSearchMain}>
            <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
              <h1>Buscar usuario</h1>
              <FaSearch />
            </div>
          </div>
        ) : (
          ''
        )}

        <UsuarioList reload={reload} onReload={onReload} usuarios={usuarios} onToastSuccessUsuarioMod={onToastSuccessUsuarioMod} /> 

      </BasicLayout>

      <BasicModal title='crear usuario' show={openForm} onClose={onOpenCloseForm}>
        <UsuarioForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onToastSuccessUsuario={onToastSuccessUsuario} />
      </BasicModal>

    </ProtectedRoute>

  )
}
