import { MoonLoader } from 'react-spinners'
import styles from './Loading.module.css'
import classNames from 'classnames'
import { Image } from 'semantic-ui-react'

export function Loading(props) {

  const {size, loading} = props

  const loadingClass = classNames({
    [styles.loadingIcon]: loading === 'L',
    [styles.loadingMain]: loading === 0,
    [styles.loadingLarge]: loading === 1, 
    [styles.loadingMiddle]: loading === 2, 
    [styles.loadingMini]: loading === 3,  
    [styles.loadingFirma]: loading === 4  
  })

  return (
    
    <div className={loadingClass}>
      <MoonLoader
        color='black'
        size={size}
        speedMultiplier={.8}
      />
      {loading === 'L' &&
        <Image src='/icons/clicknetcontrol-192x192.png' />
      }
    </div>

  )
}
