import { Button, Form, FormField, FormGroup, Input, Label, Message, TextArea } from 'semantic-ui-react'
import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { genRepId } from '@/helpers'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
import styles from './ReporteForm.module.css'

registerLocale('es', es)

export function ReporteForm(props) {

  const { user } = useAuth()

  const [reporte, setReporte] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [date, setDate] = useState(null)

  const { reload, onReload, onOpenCloseForm, onToastSuccess } = props

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!reporte) {
      newErrors.reporte = 'El campo es requerido'
    }

    if (!descripcion) {
      newErrors.descripcion = 'El campo es requerido'
    }

    if (!date) {
      newErrors.date = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const handleReporteChange = (e) => {
    const value = e.target.value
    setReporte(value)
  }

  const crearReporte = async (e) => {

    e.preventDefault()

    if (!validarForm()) {
      return
    }

    const folio = genRepId(4)
    const formattedDate = date ? date.toISOString().split('T')[0] : null
    const estado = 'Pendiente'

    try {
      await axios.post('/api/reportes/reportes', {
        usuario_id: user.id,
        folio,
        reporte,
        descripcion,
        date: formattedDate,
        estado,
        residencial_id: user.residencial_id
      })

      setReporte('')
      setDescripcion('')
      setDate(null)

      onReload()
      onOpenCloseForm()
      onToastSuccess()

    } catch (error) {
      console.error('Error al crear la reporte:', error)
    }

  }

  return (

    <>

      <IconClose onOpenClose={onOpenCloseForm} />

      <div className={styles.main}>

        <div className={styles.container}>

          <Form>
            <FormGroup widths='equal'>
              <FormField error={!!errors.reporte}>
                <Label>
                  Reporte
                </Label>
                <Input
                  name='reporte'
                  type="text"
                  value={reporte}
                  onChange={handleReporteChange}
                />
                {errors.reporte && <Message negative>{errors.reporte}</Message>}
              </FormField>
              <FormField error={!!errors.descripcion}>
                <Label>
                  Descripción
                </Label>
                <TextArea
                  name='descripcion'
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
                {errors.descripcion && <Message negative>{errors.descripcion}</Message>}
              </FormField>
              <FormField error={!!errors.date}>
                <Label>
                  Fecha
                </Label>
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="dd/mm/aaaa"
                  locale="es"
                  isClearable
                  showPopperArrow={false}
                  popperPlacement="top"
                />
                {errors.date && <Message negative>{errors.date}</Message>}
              </FormField>
            </FormGroup>
            <Button
              primary
              onClick={crearReporte}
            >
              Crear
            </Button>

          </Form>

        </div>

      </div>

    </>

  )
}
