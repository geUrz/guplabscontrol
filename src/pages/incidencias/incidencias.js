import { BasicLayout, BasicModal } from '@/layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { IncidenciasList, IncidenciaForm, SearchIncidencia } from '@/components/Incidencias'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { Add, Loading, ToastDelete, ToastSuccess } from '@/components/Layouts'
import { useAuth } from '@/contexts/AuthContext'
import styles from './incidencias.module.css'
import { FaSearch } from 'react-icons/fa'

export default function Incidencias() {

  const {user, loading} = useAuth()
  
  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [search, setSearch] = useState(false)
  
  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)
  
  const [resultados, setResultados] = useState([])

  const [incidencias, setIncidencias] = useState(null)
  
  useEffect(() => {
    if (user && user.residencial_id) {
      (async () => {
        try {
          const res = await axios.get(`/api/incidencias/incidencias?residencial_id=${user.residencial_id}`)
          setIncidencias(res.data)
        } catch (error) {
          console.error(error)
        }
      })()
    }
  }, [reload, user])

  const [toastSuccess, setToastSuccess] = useState(false)
  const [toastSuccessMod, setToastSuccessMod] = useState(false)
  const [toastSuccessDel, setToastSuccessDel] = useState(false)

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

  const onToastSuccessDel = () => {
    setToastSuccessDel(true)
    setTimeout(() => {
      setToastSuccessDel(false)
    }, 3000)
  }

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout title='incidencias' relative onReload={onReload}>

        {toastSuccess && <ToastSuccess contain='Creada exitosamente' onClose={() => setToastSuccess(false)} />}

        {toastSuccessMod && <ToastSuccess contain='Modificada exitosamente' onClose={() => setToastSuccessMod(false)} />}

        {toastSuccessDel && <ToastDelete contain='Eliminada exitosamente' onClose={() => setToastSuccessDel(false)} />}

        {!search ? (
        ''
      ) : (
        <div className={styles.searchMain}>
          <SearchIncidencia onResults={setResultados} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
          {resultados.length > 0 && (
            <ReportesListSearch visitas={resultados} reload={reload} onReload={onReload} />
          )}
        </div>
      )}

      {!search ? (
        <div className={styles.iconSearchMain}>
          <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
            <h1>Buscar incidencia</h1>
            <FaSearch />
          </div>
        </div>
      ) : (
        ''
      )}

        <IncidenciasList reload={reload} onReload={onReload} incidencias={incidencias} onToastSuccessMod={onToastSuccessMod} onToastSuccessDel={onToastSuccessDel} />

        <Add onOpenClose={onOpenCloseForm} />

      </BasicLayout>

      <BasicModal title='crear incidencia' show={openForm} onClose={onOpenCloseForm}>
        <IncidenciaForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onToastSuccess={onToastSuccess} />
      </BasicModal>

    </ProtectedRoute>

  )
}
