import { Button } from 'semantic-ui-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import styles from './ResidenteQR.module.css'
import { formatDateInc } from '@/helpers'

export function ResidenteQR(props) {
  const { user, onReload, onReloadQR, onToastSuccess } = props
  
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)

  const diasDeLaSemana = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ]

  useEffect(() => {

    const today = new Date()
    const sixMonthsLater = new Date(today)
    sixMonthsLater.setMonth(today.getMonth() + 1) 

    setFromDate(today)
    setToDate(sixMonthsLater)
  }, [])

  const verificarYActualizarQR = async (e) => {
    e.preventDefault();

    try {
        const fromDateFormatted = formatDateInc(fromDate);
        const toDateFormatted = formatDateInc(toDate);

        const res = await axios.post('/api/visitas/visitas', {
            usuario_id: user.id,
            visita: 'Residente',
            tipovisita: 'Residente',
            tipoacceso: 'frecuente',
            fromDate: fromDateFormatted,
            toDate: toDateFormatted,
            estado: 'Sin ingresar',
            residencial_id: user.residencial_id,
            dias: diasDeLaSemana.join(', ')
        });

        onReload();
        if (onReloadQR) onReloadQR();
    } catch (error) {
        console.error('Error al generar o actualizar el QR del residente:', error);
    }
}

  return (
    <div className={styles.main}>
      <Button primary onClick={verificarYActualizarQR}>
        Generar código QR
      </Button>
    </div>
  )
}
