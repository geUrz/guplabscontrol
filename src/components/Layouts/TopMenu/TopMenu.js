import { FaBuilding, FaUser } from 'react-icons/fa'
import styles from './TopMenu.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext'
import { Image } from 'semantic-ui-react';

export function TopMenu(props) {

  const { title } = props

  const { user } = useAuth()

  /* const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user && user.id) { 
        try {
          const response = await axios.get('/api/notificaciones/unread-count', {
            params: { usuario_id: user.id } // Pasa el ID del usuario a la API
          });
          setUnreadCount(response.data.count);
        } catch (error) {
          console.error('Error fetching unread notifications count:', error);
        }
      }
    }

    fetchUnreadCount();
  }, [user]) */

  return (

    <div className={styles.main}>
      <div className={styles.section}>
        <div className={styles.residencial}>
          <FaBuilding />
          {!user ?
          '' : <h2>{user.nombre_residencial}</h2>  
        }
        </div>
        {/* <Link href='/notificaciones' className={styles.mainNoti}>
          <FaBell />
          {unreadCount > 0 && <span className={styles.notiCount}>{unreadCount}</span>}
        </Link> */}
        <div className={styles.h1Logo}>
          <Image src='/img/logomenu.png' />
          <h1>{title}</h1>
        </div>
        <div className={styles.user}>
          <Link href='/cuenta'>
            <FaUser />
            {!user ?
          '' : <h2>{user.nombre}</h2>  
        }
          </Link>
        </div>
      </div>
    </div>

  )
}
