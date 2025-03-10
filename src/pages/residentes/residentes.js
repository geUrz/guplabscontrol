import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import styles from './residentes.module.css'
import { BasicLayout, BasicModal } from '@/layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { Add, Loading, ToastSuccess } from '@/components/Layouts'
import { ResidenteForm, ResidentesLista, ResidentesListSearch, SearchResidentes } from '@/components/Residentes'
import { FaSearch } from 'react-icons/fa'

export default function Residentes() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [search, setSearch] = useState(false)

  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)

  const [resultados, setResultados] = useState([])

  const [toastSuccess, setToastSuccess] = useState(false)
  const [toastSuccessMod, setToastSuccessMod] = useState(false)

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
    }, 3000)
  }

  const onToastSuccessMod = () => {
    setToastSuccessMod(true)
    setTimeout(() => {
      setToastSuccessMod(false)
    }, 3000)
  }

  const [residentes, setResidentes] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/usuarios/usuarios?isadmin=Residente, Caseta, Comité')
        setResidentes(res.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload])

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout title='residentes' relative onReload={onReload}>

        {toastSuccess && <ToastSuccess contain='Creado exitosamente' onClose={() => setToastSuccess(false)} />}

        {toastSuccessMod && <ToastSuccess contain='Modificado exitosamente' onClose={() => setToastSuccessMod(false)} />}

        {!search ? (
          ''
        ) : (
          <div className={styles.searchMain}>
            <SearchResidentes onResults={setResultados} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
            {resultados.length > 0 && (
              <ResidentesListSearch visitas={resultados} reload={reload} onReload={onReload} />
            )}
          </div>
        )}

        {!search ? (
          <div className={styles.iconSearchMain}>
            <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
              <h1>Buscar residente</h1>
              <FaSearch />
            </div>
          </div>
        ) : (
          ''
        )}

        {user.isadmin === 'Admin' ? (
          <Add onOpenClose={onOpenCloseForm} />
        ) : null
        }

        <ResidentesLista reload={reload} onReload={onReload} residentes={residentes} onToastSuccessMod={onToastSuccessMod} />

      </BasicLayout>

      <BasicModal title='crear residente' show={openForm} onClose={onOpenCloseForm}>
        <ResidenteForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onToastSuccess={onToastSuccess} />
      </BasicModal>

    </ProtectedRoute>

  )
}
