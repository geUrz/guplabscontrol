import { BasicLayout } from '@/layouts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/Home';
import { FaBuilding, FaBullhorn, FaCarCrash, FaClipboard, FaUserMd, FaUsers } from 'react-icons/fa';
import { BiQrScan } from 'react-icons/bi';
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute';
import axios from 'axios';
import { size } from 'lodash';
import { Loading, Title } from '@/components/Layouts';
import { useAuth } from '@/contexts/AuthContext'
import styles from './home.module.css';

export default function Home() {
  const { user, loading } = useAuth() 
  const [reload, setReload] = useState(false)

  const onReload = useCallback(() => setReload((prevState) => !prevState), [])

  const [data, setData] = useState({
    visitas: null,
    incidencias: null,
    anuncios: null,
    visitaprovedores: null,
    residenciales: null,
    usuarios: null,
    residentes: null,
    reportevisitas: null,
  })

  const fetchData = useCallback(async (endpoint, key) => {
    try {
      const res = await axios.get(endpoint)
      setData((prevData) => ({
        ...prevData,
        [key]: res.data,
      }))
    } catch (error) {
      console.error(`Error fetching ${key}:`, error)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchData(`/api/visitas/visitas?residencial_id=${user.residencial_id}&usuario_id=${user.id}`, 'visitas')
      fetchData(`/api/incidencias/incidencias?residencial_id=${user.residencial_id}`, 'incidencias')
      fetchData(`/api/anuncios/anuncios?residencial_id=${user.residencial_id}`, 'anuncios')
      fetchData(`/api/visitaprovedores/visitaprovedores?residencial_id=${user.residencial_id}`, 'visitaprovedores')
      fetchData('/api/residenciales/residenciales', 'residenciales')
      fetchData('/api/usuarios/usuarios?isadmin=Admin, Técnico', 'usuarios')
      fetchData(`/api/usuarios/usuarios?isadmin=Residente, Caseta, ComitéSU, Comité`, 'residentes')
      fetchData(`/api/reportevisitas/reportevisitas?residencial_id=${user.residencial_id}`, 'reportevisitas')
    }
  }, [reload, user, fetchData])

  const countData = {
    visitas: size(data.visitas),
    incidencias: size(data.incidencias),
    anuncios: size(data.anuncios),
    visitaprovedores: size(data.visitaprovedores),
    residenciales: size(data.residenciales),
    usuarios: size(data.usuarios),
    residentes: size(data.residentes),
    reportevisitas: size(data.reportevisitas),
  }

  const isResidente = useMemo(() => user?.isadmin === 'Residente', [user])

  const permissions = useMemo(() => {
    if (!user) return {}

    return {
      visitas: user?.isadmin !== 'Caseta',
      validarvisitas: ['Admin', 'ComitéSU', 'Caseta'].includes(user?.isadmin),
      incidencias: true,
      anuncios: true,
      visitaprovedores: true,
      reportevisitas: ['Admin', 'ComitéSU'].includes(user?.isadmin),
      usuarios: user?.isadmin === 'Admin', 
      residentes: user?.isadmin === 'Admin',  
      residenciales: user?.isadmin === 'Admin',  
    }
  }, [user])

  if (loading) {
    return <Loading size={45} loading={'L'} />
  }

  return (
    <ProtectedRoute>
      <BasicLayout relative onReload={onReload}>
        <Title title="panel" />
        <div className={styles.main}>
          <div className={styles.section}>
            {permissions?.visitas && (
              <Card link="/visitas" title="Mis visitas" countVisitas={countData?.visitas}>
                <FaUsers />
              </Card>
            )}

            {permissions?.validarvisitas && !isResidente && (
              <Card link="/validarvisitas" title="Validar Visitas" count={false}>
                <BiQrScan />
              </Card>
            )}

            {permissions?.incidencias && (
              <Card link="/incidencias" title="Incidencias" countIncidencias={countData?.incidencias}>
                <FaCarCrash />
              </Card>
            )}

            {permissions?.anuncios && (
              <Card link="/anuncios" title="Anuncios" countAnuncios={countData?.anuncios}>
                <FaBullhorn />
              </Card>
            )}

            {permissions?.visitaprovedores && (
              <Card link="/visitaprovedores" title="Visita Proveedores" countVisitaprovedores={countData?.visitaprovedores}>
                <FaUserMd />
              </Card>
            )}

            {permissions?.usuarios && (
              <Card link="/usuarios" title="Usuarios" countUsuarios={countData?.usuarios}>
                <FaUsers />
              </Card>
            )}

            {permissions?.residentes && (
              <Card link="/residentes" title="Residentes" countResidentes={countData?.residentes}>
                <FaUsers />
              </Card>
            )}

            {permissions?.residenciales && (
              <Card link="/residenciales" title="Residenciales" countResidenciales={countData?.residenciales}>
                <FaBuilding />
              </Card>
            )}

            {permissions?.reportevisitas && !isResidente && (
              <Card link="/reportevisitas" title="Reporte Visitas" countReportevisitas={countData?.reportevisitas}>
                <FaClipboard />
              </Card>
            )}

          </div>
        </div>
      </BasicLayout>
    </ProtectedRoute>
  )
}
