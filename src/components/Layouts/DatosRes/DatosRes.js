import { IconClose } from '../IconClose/IconClose'
import styles from './DatosRes.module.css'

export function DatosRes(props) {

  const {usuario, priv, calle, casa, onOpenCloseRes} = props

  return (
    
    <>
    
      <IconClose onOpenClose={onOpenCloseRes} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Nombre</h1>
              <h2>{usuario}</h2>
            </div>
            <div>
              <h1>Calle</h1>
              <h2>{calle}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Privada</h1>
              <h2>{priv}</h2>
            </div>
            <div>
              <h1>Casa</h1>
              <h2>#{casa}</h2>
            </div>
          </div>
        </div>
      </div>
    
    </>

  )
}
