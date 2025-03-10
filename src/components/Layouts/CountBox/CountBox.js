import { MoonLoader } from 'react-spinners'
import { size } from 'lodash'
import styles from './CountBox.module.css'
import { useEffect, useState } from 'react'
import { Loading } from '../Loading'

export function CountBox(props) {

  const { icon, count: { countAll }, title } = props

  return (

    <div className={styles.section}>
      <div>
        <div className={styles.icon}>
          {icon}
        </div>
        <div className={styles.count}>
          {countAll === undefined ? (
            <Loading size={20} loading={3} />
          ) : (
            countAll === 0 ? (
              <h1>0</h1>
            ) : (
              <h1>{countAll}</h1>
            ))}
          <h2>{title}</h2>
        </div>
      </div>
    </div>

  )
}
