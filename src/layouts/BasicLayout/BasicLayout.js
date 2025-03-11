import { TopMenu, BottomMenu, QRResidente } from '@/components/Layouts'
import styles from './BasicLayout.module.css'
import classNames from 'classnames'

export function BasicLayout(props) {

  const {
    children, 
    relative=false,
    title,
    categorie,
    reload,
    onReload
  } = props

  return (

    <>
    
    <TopMenu title={title} />

    <div className={classNames({[styles.relative] : relative})}>
      {children}
    </div>

    <QRResidente reload={reload} onReload={onReload} />

    <BottomMenu categorie={categorie}/>

    </>

  )
}
