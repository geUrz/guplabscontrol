import { Button } from 'semantic-ui-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import styles from './ResidenteQR.module.css'

export function ResidenteQR(props) {
  const { user, onReload, onReloadQR, onToastSuccess } = props
  
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)

  useEffect(() => {

    const today = new Date()
    const sixMonthsLater = new Date(today)
    sixMonthsLater.setMonth(today.getMonth() + 6) 

    setFromDate(today)
    setToDate(sixMonthsLater)
  }, [])

  const verificarYActualizarQR = async (e) => {
    e.preventDefault()

    try {
 
      const res = await axios.get(`/api/visitas/visitas?residente=${user.id}`)

      const filteredResidenteQR = res.data.filter(visita => visita.tipovisita === 'Residente')

      if (filteredResidenteQR.length > 0) {
        const visita = filteredResidenteQR[0] 

        await actualizarQR(visita.id)
      } else {
        await crearQR()
      }

    } catch (error) {
      console.error('Error al verificar o actualizar el QR:', error)
    }
  }

  const crearQR = async () => {
    try {

      await axios.post('/api/visitas/visitas', {
        usuario_id: user.id,
        visita: 'Residente',
        tipovisita: 'Residente',
        tipoacceso: 'frecuente',
        fromDate: fromDate.toISOString().split('T')[0], 
        toDate: toDate.toISOString().split('T')[0],     
        estado: 'Sin ingresar',
        residencial_id: user.residencial_id,
      })

      onReload()
      if (onReloadQR) onReloadQR()
      //onToastSuccess()
    } catch (error) {
      console.error('Error al crear el QR del residente:', error)
    }
  }

  const actualizarQR = async (visitaId) => {

    try {

      await axios.put(`/api/visitas/visitas?id=${visitaId}`, {
        visita: 'Residente',
        tipovisita: 'Residente',
        tipoacceso: 'frecuente',
        fromDate: fromDate.toISOString().split('T')[0], 
        toDate: toDate.toISOString().split('T')[0],     
        estado: 'Sin ingresar'
      })

      onReload()
      if (onReloadQR) onReloadQR()
      //onToastSuccess()
    } catch (error) {
      console.error('Error al actualizar el QR del residente:', error)
    }
  }

  return (
    <div className={styles.main}>
      <Button primary onClick={verificarYActualizarQR}>
        Generar o actualizar el código QR
      </Button>
    </div>
  )
}
