import React, { useEffect, useState } from 'react'
import { Add, Loading, ToastDelete, ToastSuccess } from '@/components/Layouts'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { SearchVisitaTecnica, VisitaTecnicaForm, VisitaTecnicaList, VisitaTecnicaListSearch } from '@/components/VisitaTecnica'
import { useAuth } from '@/contexts/AuthContext'
import { BasicLayout, BasicModal } from '@/layouts'
import axios from 'axios'
import styles from './visitatecnica.module.css'
import { FaSearch } from 'react-icons/fa'

export default function Visitatecnica() {

  const { user, loading } = useAuth()
  
  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [search, setSearch] = useState(false)

  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)

  const [resultados, setResultados] = useState([])

  const [visitatecnica, setVisitatecnica] = useState(null)

  useEffect(() => {
    if (user && user.residencial_id) {
      (async () => {
        try {
          const res = await axios.get(`/api/visitatecnica/visitatecnica?residencial_id=${user.residencial_id}`);
          setVisitatecnica(res.data);
        } catch (error) {
          console.error(error);
        }
      })();
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

      <BasicLayout title='visita técnica' relative>

        {toastSuccess && <ToastSuccess contain='Creada exitosamente' onClose={() => setToastSuccess(false)} />}

        {toastSuccessMod && <ToastSuccess contain='Modificada exitosamente' onClose={() => setToastSuccessMod(false)} />}

        {toastSuccessDel && <ToastDelete contain=' Eliminada exitosamente' onClose={() => setToastSuccessDel(false)} />}

        {!search ? (
          ''
        ) : (
          <div className={styles.searchMain}>
            <SearchVisitaTecnica onResults={setResultados} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
            {resultados.length > 0 && (
              <VisitaTecnicaListSearch visitas={resultados} reload={reload} onReload={onReload} />
            )}
          </div>
        )}

        {!search ? (
          <div className={styles.iconSearchMain}>
            <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
              <h1>Buscar visita técnica</h1>
              <FaSearch />
            </div>
          </div>
        ) : (
          ''
        )}

        <VisitaTecnicaList reload={reload} onReload={onReload} visitatecnica={visitatecnica} onToastSuccessMod={onToastSuccessMod} onToastSuccessDel={onToastSuccessDel} />

        {user && user.isadmin === 'Admin' ? (
          <Add onOpenClose={onOpenCloseForm} />
        ) : (
          ''
        )}

      </BasicLayout>

      <BasicModal title='crear visita técnica' show={openForm} onClose={onOpenCloseForm}>
        <VisitaTecnicaForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onToastSuccess={onToastSuccess} />
      </BasicModal>

    </ProtectedRoute>

  )
}
