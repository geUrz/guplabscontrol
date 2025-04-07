import { Confirm, IconDel, Loading, Title, ToastDelete, ToastSuccess } from '@/components/Layouts'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { BasicLayout } from '@/layouts'
import { useEffect, useMemo, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { ReportevisitasList, ReportevisitasListSearch, SearchReportevisitas } from '@/components/Reportevisitas'
import axios from 'axios'
import { Dropdown } from 'semantic-ui-react'
import styles from './reportevisitas.module.css'

export default function Reportevisitas() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [search, setSearch] = useState(false)

  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)

  const [resultados, setResultados] = useState([])

  const [reporteVisitas, setReportevisitas] = useState(null)

  const [fechaFiltro, setFechaFiltro] = useState('hoy')

  const [showConfirmDel, setShowConfirmDel] = useState(false)

  const confirmDel = () => setShowConfirmDel((prevState) => !prevState)

  useEffect(() => {
    if (!user || !user.id || !user.residencial_id) return;

    (async () => {
      try {
        const fechaLimite = obtenerFechaLimite(fechaFiltro);
        let url = `/api/reportevisitas/reportevisitas?residencial_id=${user.residencial_id}`;

        if (fechaLimite) {
          url += `&fecha_limite=${fechaLimite.toISOString()}`;
        }

        const res = await axios.get(url);
        setReportevisitas(res.data);
      } catch (error) {
        console.error('Error al obtener datos:', error.response || error.message);
      }
    })();
  }, [user, reload, fechaFiltro])

  const handleDeleteVisita = async () => {

    const hoy = new Date();
    const fechaLimite = new Date(hoy);
    fechaLimite.setDate(hoy.getDate() - 15);

    // Formatea la fecha a YYYY-MM-DD
    const fechaFormateada = fechaLimite.toISOString().split('T')[0];

    try {
      const response = await fetch(`/api/delete-visitas?fecha_limite=${fechaFormateada}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      confirmDel()
      if (response.ok) {
        console.log('✅ Éxito:', data.message);
      } else {
        console.warn('⚠️ Error:', data.error);
      }
    } catch (err) {
      console.error('❌ Error de red o servidor:', err.message);
    }
  }

  const [toastSuccessDel, setToastSuccessDel] = useState(false)

  const onToastSuccessDel = () => {
    setToastSuccessDel(true)
    setTimeout(() => {
      setToastSuccessDel(false)
    }, 3000)
  }

  const obtenerFechaLimite = (filtro) => {
    const hoy = new Date()
    let fechaLimite = new Date(hoy)

    switch (filtro) {
      case 'hoy':
        fechaLimite.setHours(0, 0, 0, 0)
        break;
      case 'semana':
        fechaLimite.setDate(hoy.getDate() - 7)
        break;
      case '15dias':
        fechaLimite.setDate(hoy.getDate() - 15)
        break;
      case 'mes':
        fechaLimite.setMonth(hoy.getMonth() - 1)
        break;
      case 'todo':
      default:
        return null;
    }

    return fechaLimite;
  }

  const permissions = useMemo(() => {

    if(!user) return {}

    return{
      showAdmin: ['Admin', 'ComitéSU'].includes(user?.isadmin)
    }

  }, [user])


  if (loading) {
    return <Loading size={45} loading={'L'} />
  }

  return (

    <ProtectedRoute>
      <BasicLayout relative onReload={onReload}>

        <Title title='reporte visitas' />

        {toastSuccessDel && <ToastDelete contain='Eliminada exitosamente' onClose={() => setToastSuccessDel(false)} />}

        {!search ? (
          ''
        ) : (
          <div className={styles.searchMain}>
            <SearchReportevisitas user={user} onResults={setResultados} reload={reload} onReload={onReload} onOpenCloseSearch={onOpenCloseSearch} />
            {resultados.length > 0 && (
              <ReportevisitasListSearch reporteVisitas={resultados} reload={reload} onReload={onReload} />
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

        <div className={styles.filtrosFechas}>
          <h1>Filtrar por fecha</h1>
          <Dropdown
            fluid
            selection
            options={[
              { key: 'todo', text: 'Todo', value: 'todo' },
              { key: 'hoy', text: 'Hoy', value: 'hoy' },
              { key: 'semana', text: 'Última Semana', value: 'semana' },
              { key: '15dias', text: 'Últimos 15 días', value: '15dias' },
              { key: 'mes', text: 'Último Mes', value: 'mes' },
            ]}
            value={fechaFiltro}
            onChange={(e, { value }) => setFechaFiltro(value)} 
          />
        </div>

        <ReportevisitasList reload={reload} onReload={onReload} user={user} reporteVisitas={reporteVisitas} onToastSuccessDel={onToastSuccessDel} />

        {permissions.showAdmin &&

          <IconDel setShowConfirmDel={setShowConfirmDel} />

        }

      </BasicLayout>

      <Confirm
        open={showConfirmDel}
        onConfirm={handleDeleteVisita}
        onCancel={confirmDel}
        content='¡ Se eliminarán las visitas que tengan mas de 15 días !'
      />

    </ProtectedRoute>

  )
}
