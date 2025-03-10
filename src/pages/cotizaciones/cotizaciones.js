import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { BasicLayout, BasicModal } from '@/layouts'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { Add, Loading, ToastDelete, ToastSuccess } from '@/components/Layouts'
import { FaSearch } from 'react-icons/fa'
import { CotizacionForm, CotizacionLista, CotizacionListSearch, SearchCotizacion } from '@/components/Cotizaciones'
import axios from 'axios'
import styles from './cotizaciones.module.css'

export default function Cotizaciones() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [search, setSearch] = useState(false)

  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)

  const [resultados, setResultados] = useState([])

  const [cotizaciones, setCotizaciones] = useState(null)

  useEffect(() => {
    if (user && user.residencial_id) {
      (async () => {
        try {
          const res = await axios.get(`/api/cotizaciones/cotizaciones?residencial_id=${user.residencial_id}`)
          setCotizaciones(res.data)
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

    <BasicLayout title='Cotizaciones' relative onReload={onReload}>

      {toastSuccess && <ToastSuccess contain='Creada exitosamente' onClose={() => setToastSuccess(false)} />}

      {toastSuccessMod && <ToastSuccess contain='Modificada exitosamente' onClose={() => setToastSuccessMod(false)} />}

      {toastSuccessDel && <ToastDelete contain='Eliminada exitosamente' onClose={() => setToastSuccessDel(false)} />}

      {!search ? (
        ''
      ) : (
        <div className={styles.searchMain}>
          <SearchCotizacion onResults={setResultados} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
          {resultados.length > 0 && (
            <CotizacionListSearch visitas={resultados} reload={reload} onReload={onReload} />
          )}
        </div>
      )}

      {!search ? (
        <div className={styles.iconSearchMain}>
          <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
            <h1>Buscar cotización</h1>
            <FaSearch />
          </div>
        </div>
      ) : (
        ''
      )}

      <CotizacionLista reload={reload} onReload={onReload} cotizaciones={cotizaciones} setCotizaciones={setCotizaciones} onToastSuccessMod={onToastSuccessMod} onToastSuccess={onToastSuccess} onToastSuccessDel={onToastSuccessDel} />

      <Add onOpenClose={onOpenCloseForm} />

    </BasicLayout>

    <BasicModal title='crear cotización' show={openForm} onClose={onOpenCloseForm}>
      <CotizacionForm reload={reload} onReload={onReload} onToastSuccess={onToastSuccess} onOpenCloseForm={onOpenCloseForm} />
    </BasicModal>

  </ProtectedRoute>

  )
}
