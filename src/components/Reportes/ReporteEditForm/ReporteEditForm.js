import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { useState } from 'react'
import axios from 'axios'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message, TextArea } from 'semantic-ui-react'
import { useAuth } from '@/contexts/AuthContext'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
import styles from './ReporteEditForm.module.css'

registerLocale('es', es)

export function ReporteEditForm(props) {

  const { reload, onReload, reporte, onOpenEditReporte, onToastSuccessMod } = props

  const { user } = useAuth()

  const [formData, setFormData] = useState({
    reporte: reporte.reporte,
    descripcion: reporte.descripcion,
    date: reporte.date ? new Date(reporte.date + 'T00:00:00') : null,
    estado: reporte.estado
  })

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!formData.reporte) {
      newErrors.reporte = 'El campo es requerido'
    }

    if (!formData.descripcion) {
      newErrors.descripcion = 'El campo es requerido'
    }

    if (!formData.date) {
      newErrors.date = 'El campo es requerido'
    }

    if (!formData.estado) {
      newErrors.estado = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Enviar los datos actualizados
  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!validarForm()) {
      return
    }

    try {
      await axios.put(`/api/reportes/reportes?id=${reporte.id}`, {
        ...formData,
        date: formData.date ? formData.date.toISOString().split('T')[0] : null
      })
      onReload()
      onOpenEditReporte()
      onToastSuccessMod()
    } catch (error) {
      console.error('Error actualizando el reporte:', error)
    }
  }

  const opcionesEstado = [
    { key: 1, text: 'Pendiente', value: 'Pendiente' },
    { key: 2, text: 'En proceso', value: 'En proceso' },
    { key: 3, text: 'Realizada', value: 'Realizada' }
  ]


  return (

    <>

      <IconClose onOpenClose={onOpenEditReporte} />

      <Form>
        <FormGroup widths='equal'>
        <FormField error={!!errors.reporte}>
            <Label>
              Reporte
            </Label>
            <Input
              type="text"
              name="reporte"
              value={formData.reporte}
              onChange={handleChange}
            />
            {errors.reporte && <Message negative>{errors.reporte}</Message>}
          </FormField>
          <FormField error={!!errors.descripcion}>
            <Label>
              Descripción
            </Label>
            <TextArea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
            {errors.descripcion && <Message negative>{errors.descripcion}</Message>}
          </FormField>
          <FormField error={!!errors.date}>
            <Label>
              Fecha
            </Label>
            <DatePicker
              selected={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/aaaa"
              locale="es"
              isClearable
              showPopperArrow={false}
              popperPlacement="top"
            />
            {errors.date && <Message negative>{errors.date}</Message>}
          </FormField>
          <FormField error={!!errors.estado}>
            <Label>
              Estatus
            </Label>
            <Dropdown
                placeholder='Selecciona una opción'
                fluid
                selection
                options={opcionesEstado}
                value={formData.estado}
                onChange={(e, { value }) => setFormData({ ...formData, estado: value })}
              />
            {errors.estado && <Message negative>{errors.estado}</Message>}
          </FormField>
        </FormGroup>
        <Button primary onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>

    </>

  )
}
