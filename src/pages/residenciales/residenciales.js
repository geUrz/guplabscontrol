import { Add, Loading, Title, ToastSuccess } from '@/components/Layouts'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { BasicLayout, BasicModal } from '@/layouts'
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { ResidencialesListSearch, ResidencialForm, ResidencialList, SearchResidencial } from '@/components/residenciales'
import { FaSearch } from 'react-icons/fa'
import styles from './residenciales.module.css'


export default function Residenciales() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [search, setSearch] = useState(false)
  
  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)
  
  const [resultados, setResultados] = useState([])

  const [residenciales, setResidenciales] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/residenciales/residenciales')
        setResidenciales(res.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload])

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

  const permissions = useMemo(() => {

    if(!user) return {}

    return{
      showAdmin: ['Admin'].includes(user?.isadmin)
    }

  }, [user])

  if (loading) {
    return <Loading size={45} loading={'L'} />
  }

  return (
    
    <ProtectedRoute>

      <BasicLayout relative onReload={onReload}>

        <Title title='residenciales' />

        {toastSuccess && <ToastSuccess contain='Creado exitosamente' onClose={() => setToastSuccess(false)} />}

        {toastSuccessMod && <ToastSuccess contain='Modificado exitosamente' onClose={() => setToastSuccessMod(false)} />}

        {permissions.showAdmin &&

          <Add onOpenClose={onOpenCloseForm} />

        }

        {!search ? (
        ''
      ) : (
        <div className={styles.searchMain}>
          <SearchResidencial onResults={setResultados} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
          {resultados.length > 0 && (
            <ResidencialesListSearch user={user} visitas={resultados} reload={reload} onReload={onReload} />
          )}
        </div>
      )}

      {!search ? (
        <div className={styles.iconSearchMain}>
          <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
            <h1>Buscar residencial</h1>
            <FaSearch />
          </div>
        </div>
      ) : (
        ''
      )}

        <ResidencialList user={user} reload={reload} onReload={onReload} residenciales={residenciales} onToastSuccessMod={onToastSuccessMod} />

      </BasicLayout>

      <BasicModal title='crear residencial' show={openForm} onClose={onOpenCloseForm}>
        <ResidencialForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onToastSuccess={onToastSuccess} />
      </BasicModal>

    </ProtectedRoute>

  )
}
