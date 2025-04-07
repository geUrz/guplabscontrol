import { FaBullhorn, FaCarCrash, FaHome, FaLayerGroup, FaUserCheck, FaUsers } from 'react-icons/fa'
import Link from 'next/link'
import styles from './BottomMenu.module.css'
import { useAuth } from '@/contexts/AuthContext'

export function BottomMenu() {

  const { user } = useAuth()

  return (

    <div className={styles.main}>
      <div className={styles.section}>

        {user && user.isactive === 1 ?
          <>
            <Link href='/' className={styles.tab}>
              <div>
                <FaHome />
                <h1>Panel</h1>
              </div>
            </Link>
            <Link href='/incidencias' className={styles.tab}>
              <div>
                <FaCarCrash />
                <h1>Incidencias</h1>
              </div>
            </Link>
            <Link href='/anuncios' className={styles.tab}>
              <div>
                <FaBullhorn />
                <h1>Anuncios</h1>
              </div>
            </Link>

            {user.isadmin === 'Admin' || user.isadmin === 'ComitéSU' ? (
              <>

                <Link href='/visitas' className={styles.tab}>
                  <div>
                    <FaUsers />
                    <h1>Visitas</h1>
                  </div>
                </Link>

                <Link href='/validarvisitas' className={styles.tab}>
                  <div>
                    <FaUserCheck />
                    <h1>Validar V.</h1>
                  </div>
                </Link>

              </>
            ) : (
              user.isadmin === 'Caseta' || user.isadmin === 'Comité' ? (
                <Link href='/validarvisitas' className={styles.tab}>
                  <div>
                    <FaUserCheck />
                    <h1>Validar V.</h1>
                  </div>
                </Link>
              ) : (
                user.isadmin === 'Residente' ? (
                  <Link href='/visitas' className={styles.tab}>
                    <div>
                      <FaUsers />
                      <h1>Visitas</h1>
                    </div>
                  </Link>
                ) : ('')
              )
            )}

            <Link href='/extras' className={styles.tab}>
              <div>
                <FaLayerGroup />
                <h1>Extras</h1>
              </div>
            </Link>
          </> : null
        }

      </div>
    </div>

  )
}
