import { FaPlus } from 'react-icons/fa'
import styles from './Add.module.css'

export function Add(props) {

  const { onOpenClose } = props

  return (

    <div className={styles.main}>
      <div className={styles.section}>
        <div onClick={onOpenClose}>
          <FaPlus />
        </div>
      </div>
    </div>

  )
}
