import { BasicLayout, BasicModal } from '@/layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { Add, Loading, ToastDelete, ToastSuccess } from '@/components/Layouts'
import { useAuth } from '@/contexts/AuthContext'
import styles from './anuncios.module.css'
import { AnunciosList, AnuncioForm, SearchAnuncios, AnunciosListSearch } from '@/components/Anuncios'
import { FaSearch } from 'react-icons/fa'

export default function Anuncios() {

  const {user, loading} = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [search, setSearch] = useState(false)
  
  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)
  
  const [resultados, setResultados] = useState([])

  const [anuncios, setAnuncios] = useState(null)
  
  useEffect(() => {
    if (user && user.residencial_id) {
    (async () => {
      try {
        const res = await axios.get(`/api/anuncios/anuncios?residencial_id=${user.residencial_id}`)
        setAnuncios(res.data)
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

      <BasicLayout title='anuncios' relative onReload={onReload}>

        {toastSuccess && <ToastSuccess contain='Creado exitosamente' onClose={() => setToastSuccess(false)} />}

        {toastSuccessMod && <ToastSuccess contain='Modificado exitosamente' onClose={() => setToastSuccessMod(false)} />}

        {toastSuccessDel && <ToastDelete contain='Eliminado exitosamente' onClose={() => setToastSuccessDel(false)} />}

        {!search ? (
        ''
      ) : (
        <div className={styles.searchMain}>
          <SearchAnuncios onResults={setResultados} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
          {resultados.length > 0 && (
            <AnunciosListSearch visitas={resultados} reload={reload} onReload={onReload} />
          )}
        </div>
      )}

      {!search ? (
        <div className={styles.iconSearchMain}>
          <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
            <h1>Buscar anuncio</h1>
            <FaSearch />
          </div>
        </div>
      ) : (
        ''
      )}

        <AnunciosList reload={reload} onReload={onReload} anuncios={anuncios} onToastSuccessMod={onToastSuccessMod} onToastSuccessDel={onToastSuccessDel} />

        <Add onOpenClose={onOpenCloseForm} />

      </BasicLayout>

      <BasicModal title='crear anuncio' show={openForm} onClose={onOpenCloseForm}>
        <AnuncioForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onToastSuccess={onToastSuccess} />
      </BasicModal>

    </ProtectedRoute>

  )
}
