import { BasicLayout } from '@/layouts'
import { useCallback, useEffect, useState } from 'react'
import { Card } from '@/components/Home'
import { FaBuilding, FaBullhorn, FaCarCrash, FaClipboard, FaFileAlt, FaFileContract, FaFileInvoice, FaInfoCircle, FaUserCheck, FaUserCog, FaUserMd, FaUsers } from 'react-icons/fa'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import axios from 'axios'
import { size } from 'lodash'
import { Loading } from '@/components/Layouts'
import { useAuth } from '@/contexts/AuthContext'
import styles from './home.module.css'

export default function Home() {

  const { user, loading } = useAuth()
  
  const [reload, setReload] = useState(false)

  const onReload = useCallback(() => setReload((prevState) => !prevState), [])

  const [data, setData] = useState({
    incidencias: null,
    anuncios: null,
    visitatecnica: null,
    reportes: null,
    visitaprovedores: null,
    residenciales: null,
    usuarios: null,
    residentes: null,
    ordenservicio: null,
    recibos: null,
    cotizaciones: null
  });

  const fetchData = useCallback(async (endpoint, key) => {
    try {
      const res = await axios.get(endpoint);
      setData((prevData) => ({
        ...prevData,
        [key]: res.data,
      }));
    } catch (error) {
      console.error(`Error fetching ${key}:`, error)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchData(`/api/incidencias/incidencias?residencial_id=${user.residencial_id}`, 'incidencias')
      fetchData(`/api/anuncios/anuncios?residencial_id=${user.residencial_id}`, 'anuncios')
      fetchData(`/api/visitatecnica/visitatecnica?residencial_id=${user.residencial_id}`, 'visitatecnica')
      fetchData(`/api/reportes/reportes?residencial_id=${user.residencial_id}`, 'reportes')
      fetchData(`/api/visitaprovedores/visitaprovedores?residencial_id=${user.residencial_id}`, 'visitaprovedores')
      fetchData('/api/residenciales/residenciales', 'residenciales'),
      fetchData('/api/usuarios/usuarios?isadmin=Admin, Técnico', 'usuarios')
      fetchData(`/api/usuarios/usuarios?isadmin=Residente, Caseta, Comité`, 'residentes')
      fetchData(`/api/ordenservicio/ordenservicio?residencial_id=${user.residencial_id}`, 'ordenservicio')
      fetchData(`/api/recibos/recibos?residencial_id=${user.residencial_id}`, 'recibos')
      fetchData(`/api/cotizaciones/cotizaciones?residencial_id=${user.residencial_id}`, 'cotizaciones')
    }
  }, [reload, user, fetchData])

  const countData = {
    incidencias: size(data.incidencias),
    anuncios: size(data.anuncios),
    visitatecnica: size(data.visitatecnica),
    reportes: size(data.reportes),
    visitaprovedores: size(data.visitaprovedores),
    residenciales: size(data.residenciales),
    usuarios: size(data.usuarios),
    residentes: size(data.residentes),
    ordenservicio: size(data.ordenservicio),
    recibos: size(data.recibos),
    cotizaciones: size(data.cotizaciones)

  }

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (
    <ProtectedRoute>
      <BasicLayout title='Panel' onReload={onReload}>
        <div className={styles.main}>

          {user && user.isactive === 1 ?
            <>

              <div className={styles.section}>
                <Card link='/visitas' title='Mis visitas'
                  count={false}>
                  <FaUsers />
                </Card>
                {user && (user.isadmin === 'Admin' || user.isadmin === 'Caseta') ?
                  <Card link='/validarvisitas' title='Validar Visitas' count={false}>
                    <FaUserCheck />
                  </Card>
                  : null
                }
                <Card link='/incidencias' title='Incidencias'
                  countIncidencias={countData.incidencias}>
                  <FaCarCrash />
                </Card>
                <Card link='/anuncios' title='Anuncios'
                  countAnuncios={countData.anuncios}>
                  <FaBullhorn />
                </Card>
                <Card link='/visitatecnica' title='Visita Técnica'
                  countVisitatecnica={countData.visitatecnica}>
                  <FaUserCog />
                </Card>
                <Card link='/visitaprovedores' title='Visita Proveedores'
                  countVisitaprovedores={countData.visitaprovedores}>
                  <FaUserMd />
                </Card>

                {user && (user.isadmin === 'Admin') ?
                  <>

                    <Card link='/usuarios' title='Usuarios'
                      countUsuarios={countData.usuarios}>
                      <FaUsers />
                    </Card>

                    <Card link='/residentes' title='Residentes'
                      countResidentes={countData.residentes}>
                      <FaUsers />
                    </Card>

                    <Card link='/residenciales' title='Residenciales'
                      countResidenciales={countData.residenciales}>
                      <FaBuilding />
                    </Card>

                  </>
                  : null
                }

                {user && (user.isadmin === 'Admin') || user && user.isadmin === 'Técnico' ?
                  <>

                    <Card link='/ordenesdeservicio' title='Órdenes Servicio'
                      countOrdenesdeservicio={countData.ordenservicio}>
                      <FaFileAlt />
                    </Card>

                    <Card link='/reportes' title='Reportes'
                      countReportes={countData.reportes}>
                      <FaClipboard />
                    </Card>

                    <Card link='/recibos' title='Recibos'
                      countRecibos={countData.recibos}>
                      <FaFileInvoice />
                    </Card>

                    <Card link='/cotizaciones' title='Cotizaciones'
                      countCotizaciones={countData.cotizaciones}>
                      <FaFileContract />
                    </Card>

                  </>
                  : null
                }

              </div>

            </> :
            
            <div className={styles.bannerNoActive}>
              <FaInfoCircle />
              <h1>¡ Usuario desactivado !</h1>
              <h2>Su cuenta presenta un atraso en el pago. Por favor, póngase en contacto con el comité para resolverlo.</h2>
            </div>

          }

        </div>
      </BasicLayout>
    </ProtectedRoute>
  )
}
