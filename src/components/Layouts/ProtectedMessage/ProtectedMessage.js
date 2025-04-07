import { FaInfoCircle } from 'react-icons/fa'
import styles from './ProtectedMessage.module.css'
import { IconClose } from '../IconClose'

export function ProtectedMessage(props) {

  const{onCloseError, errorMessage} = props

  return (

    <>

      <IconClose onOpenClose={onCloseError} />
      <div className={styles.error}>
        <FaInfoCircle />
        <h1>{errorMessage}</h1>
      </div>

    </>

  )
}
