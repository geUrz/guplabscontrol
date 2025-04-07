import { useEffect, useState } from 'react'
import { BasicLayout, BasicModal } from '@/layouts'
import axios from 'axios'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { Add, Loading, Title, ToastDelete, ToastSuccess } from '@/components/Layouts'
import { useAuth } from '@/contexts/AuthContext'
import { VisitasList, VisitaForm, SearchVisitas, VisitasListSearch } from '@/components/Visitas'
import styles from './visitas.module.css'
import { FaSearch } from 'react-icons/fa'

export default function Visitas() {

  const {user, loading} = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [search, setSearch] = useState(false)
  
  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)
  
  const [resultados, setResultados] = useState([])

  const [visitas, setVisitas] = useState(null)

  useEffect(() => {
    
    if (!user || !user.id || !user.residencial_id) return
  
    (async () => {
      try {
        const res = await axios.get(`/api/visitas/visitas?usuario_id=${user.id}`)
        const filteredVisitas = res.data.filter(visita => visita.residencial_id === user.residencial_id)
        setVisitas(filteredVisitas)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [user, reload])

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
    return <Loading size={45} loading={'L'} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout relative reload={reload} onReload={onReload}>

        <Title title='mis visitas' />

        {toastSuccess && <ToastSuccess contain='Creada exitosamente' onClose={() => setToastSuccess(false)} />}

        {toastSuccessMod && <ToastSuccess contain='Modificada exitosamente' onClose={() => setToastSuccessMod(false)} />}

        {toastSuccessDel && <ToastDelete contain='Eliminada exitosamente' onClose={() => setToastSuccessDel(false)} />}

        {!search ? (
        ''
      ) : (
        <div className={styles.searchMain}>
          <SearchVisitas user={user} onResults={setResultados} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
          {resultados.length > 0 && (
            <VisitasListSearch visitas={resultados} reload={reload} onReload={onReload} />
          )}
        </div>
      )}

      {!search ? (
        <div className={styles.iconSearchMain}>
          <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
            <h1>Buscar visita</h1>
            <FaSearch />
          </div>
        </div>
      ) : (
        ''
      )}

        <VisitasList reload={reload} onReload={onReload} user={user} loading={loading} visitas={visitas} onToastSuccessMod={onToastSuccessMod} onToastSuccessDel={onToastSuccessDel} />


        <Add onOpenClose={onOpenCloseForm} />

      </BasicLayout>

      <BasicModal title='crear visita' show={openForm} onClose={onOpenCloseForm}>
        <VisitaForm reload={reload} onReload={onReload} user={user} onOpenCloseForm={onOpenCloseForm} onToastSuccess={onToastSuccess} />
      </BasicModal>

    </ProtectedRoute>
  )
}
