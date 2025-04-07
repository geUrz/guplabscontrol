import { TopMenu, BottomMenu, QRResidente } from '@/components/Layouts'
import styles from './BasicLayout.module.css'
import classNames from 'classnames'
import { useAuth } from '@/contexts/AuthContext'
import { useMemo } from 'react'

export function BasicLayout(props) {

  const {
    children,
    relative = false,
    title,
    categorie,
    reload,
    onReload
  } = props

  const { user } = useAuth()

  const isUserActive = useMemo(() => user?.isactive === 1, [user]);
  const isResidente = useMemo(() => user?.isadmin === 'Residente', [user]);

  const permissions = useMemo(() => {
    if (!user) return {}

    return {
      showQRCode: user.isadmin !== 'Caseta',
    }
  }, [user])

  return (

    <>

      <TopMenu title={title} />

      <div className={classNames({ [styles.relative]: relative })}>
        {children}
      </div>

      {permissions.showQRCode && isUserActive && (
        <QRResidente reload={reload} onReload={onReload} />
      )}

      <BottomMenu categorie={categorie} />

    </>

  )
}
