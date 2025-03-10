import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import styles from './recibos.module.css'
import { BasicLayout, BasicModal } from '@/layouts'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Add, Loading, ToastDelete, ToastSuccess } from '@/components/Layouts'
import axios from 'axios'
import { ReciboLista } from '@/components/Recibos/ReciboLista'
import { ReciboForm } from '@/components/Recibos/ReciboForm'
import { FaSearch } from 'react-icons/fa'
import { SearchRecibos } from '@/components/Recibos/SearchRecibos'
import { RecibosListSearch } from '@/components/Recibos/RecibosListSearch'

export default function Recibos() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [search, setSearch] = useState(false)

  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)

  const [resultados, setResultados] = useState([])

  const [recibos, setRecibos] = useState(null)

  useEffect(() => {
    if (user && user.residencial_id) {
      (async () => {
        try {
          const res = await axios.get(`/api/recibos/recibos?residencial_id=${user.residencial_id}`)
          setRecibos(res.data)
        } catch (error) {
          console.error(error)
        }
      })()
    }
  }, [reload, user])

  const [toastSuccess, setToastSuccessReportes] = useState(false)
    const [toastSuccessMod, setToastSuccessReportesMod] = useState(false)
    const [toastSuccessDel, setToastSuccessReportesDel] = useState(false)
  
    const onToastSuccess = () => {
      setToastSuccessReportes(true)
      setTimeout(() => {
        setToastSuccessReportes(false)
      }, 3000)
    }
  
    const onToastSuccessMod = () => {
      setToastSuccessReportesMod(true)
      setTimeout(() => {
        setToastSuccessReportesMod(false)
      }, 3000)
    }
  
    const onToastSuccessDel = () => {
      setToastSuccessReportesDel(true)
      setTimeout(() => {
        setToastSuccessReportesDel(false)
      }, 3000)
    }

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout title='Recibos' relative onReload={onReload}>

        {toastSuccess && <ToastSuccess contain='Creado exitosamente' onClose={() => setToastSuccessReportes(false)} />}

        {toastSuccessMod && <ToastSuccess contain='Modificado exitosamente' onClose={() => setToastSuccessReportesMod(false)} />}

        {toastSuccessDel && <ToastDelete contain='Eliminado exitosamente' onClose={() => setToastSuccessReportesDel(false)} />}

        {!search ? (
          ''
        ) : (
          <div className={styles.searchMain}>
            <SearchRecibos onResults={setResultados} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
            {resultados.length > 0 && (
              <RecibosListSearch visitas={resultados} reload={reload} onReload={onReload} />
            )}
          </div>
        )}

        {!search ? (
          <div className={styles.iconSearchMain}>
            <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
              <h1>Buscar recibo</h1>
              <FaSearch />
            </div>
          </div>
        ) : (
          ''
        )}

        <ReciboLista reload={reload} onReload={onReload} recibos={recibos} setRecibos={setRecibos} onToastSuccessMod={onToastSuccessMod} onToastSuccess={onToastSuccess} onToastSuccessDel={onToastSuccessDel} />

        <Add onOpenClose={onOpenCloseForm} />

      </BasicLayout>

      <BasicModal title='crear recibo' show={openForm} onClose={onOpenCloseForm}>
        <ReciboForm reload={reload} onReload={onReload} onToastSuccess={onToastSuccess} onOpenCloseForm={onOpenCloseForm} />
      </BasicModal>

    </ProtectedRoute>

  )
}
