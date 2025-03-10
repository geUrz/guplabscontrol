import { FaInfoCircle, FaTimes } from 'react-icons/fa'
import styles from './ToastWarningPage.module.css'

export function ToastWarningPage(props) {

  const {onClose} = props

  return (

    <div className={styles.section}>
      <div className={styles.iconClose} onClick={onClose}>
        <FaTimes />
      </div>
      <div className={styles.toast}>
        <FaInfoCircle />
        <h1>¡ No puedes salir de la pagina, tienes un código por confirmar !</h1>
      </div>
    </div>

  )
}
