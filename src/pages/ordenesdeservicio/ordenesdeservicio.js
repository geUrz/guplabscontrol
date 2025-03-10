import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { BasicLayout, BasicModal } from '@/layouts'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { Add, Loading, ToastDelete, ToastSuccess } from '@/components/Layouts'
import axios from 'axios'
import { OrdenServicioForm, OrdenServicioList, OrdenServicioListSearch, SearchOrdenServicio } from '@/components/OrdenServicio'
import styles from './ordenesdeservicio.module.css'
import { FaSearch } from 'react-icons/fa'
import { ResidencialesListSearch } from '@/components/residenciales'

export default function Ordenesdeservicio() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [search, setSearch] = useState(false)
  
  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)
  
  const [resultados, setResultados] = useState([])

  const [ordenservicio, setOrdenservicio] = useState(null)
  
  useEffect(() => {
    if (user && user.residencial_id) {
      (async () => {
        try {
          const res = await axios.get(`/api/ordenservicio/ordenservicio?residencial_id=${user.residencial_id}`)
          setOrdenservicio(res.data)
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

      <BasicLayout title='Órdenes de servicio' relative onReload={onReload}>

        {toastSuccess && <ToastSuccess contain='Creada exitosamente' onClose={() => setToastSuccess(false)} />}

        {toastSuccessMod && <ToastSuccess contain='Modificada exitosamente' onClose={() => setToastSuccessMod(false)} />}

        {toastSuccessDel && <ToastDelete contain='Eliminada exitosamente' onClose={() => setToastSuccessDel(false)} />}

        {!search ? (
        ''
      ) : (
        <div className={styles.searchMain}>
          <SearchOrdenServicio onResults={setResultados} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
          {resultados.length > 0 && (
            <OrdenServicioListSearch visitas={resultados} reload={reload} onReload={onReload} />
          )}
        </div>
      )}

      {!search ? (
        <div className={styles.iconSearchMain}>
          <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
            <h1>Buscar orden de servicio</h1>
            <FaSearch />
          </div>
        </div>
      ) : (
        ''
      )}

        <OrdenServicioList reload={reload} onReload={onReload} ordenservicio={ordenservicio} onToastSuccessMod={onToastSuccessMod} onToastSuccessDel={onToastSuccessDel} />

        <Add onOpenClose={onOpenCloseForm} />

      </BasicLayout>

      <BasicModal title='crear órden de servicio' show={openForm} onClose={onOpenCloseForm}>
        <OrdenServicioForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onToastSuccess={onToastSuccess} />
      </BasicModal>

    </ProtectedRoute>

  )
}
