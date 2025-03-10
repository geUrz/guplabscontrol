import styles from './Title.module.css'

export function Title(props) {

  const {title} = props

  return (

    <div className={styles.title}>
      <h1>{title}</h1>
    </div>

  )
}
