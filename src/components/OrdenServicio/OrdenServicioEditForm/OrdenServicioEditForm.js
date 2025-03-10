import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Form, FormField, FormGroup, Input, Label, Message, TextArea } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './OrdenServicioEditForm.module.css'

export function OrdenServicioEditForm(props) {

  const { reload, onReload, ordenservicio, onOpenEditOrdenservicio, onToastSuccessMod } = props

  const [formData, setFormData] = useState({
    nombre: ordenservicio.nombre,
    descripcion: ordenservicio.descripcion,
    date: ordenservicio.date ? new Date(ordenservicio.date + 'T00:00:00') : null,
  })

  const maxCharacters = 1950

  const handleDescripcionChange = (e) => {
    const { value } = e.target;
    if (value.length <= maxCharacters) {
      setFormData({ ...formData, descripcion: value })
    }
  }
  
  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!formData.nombre) {
      newErrors.nombre = 'El campo es requerido'
    }

    if (!formData.descripcion) {
      newErrors.descripcion = 'El campo es requerido'
    }

    if (!formData.date) {
      newErrors.date = 'El campo es requerido'
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
      await axios.put(`/api/ordenservicio/ordenservicio?id=${ordenservicio.id}`, {
        ...formData,
        date: formData.date ? formData.date.toISOString().split('T')[0] : null
      })
      onReload()
      onOpenEditOrdenservicio()
      onToastSuccessMod()
    } catch (error) {
      console.error('Error actualizando la órden de servicio:', error)
    }
  }

  return (

    <>

      <IconClose onOpenClose={onOpenEditOrdenservicio} />

      <Form>
        <FormGroup widths='equal'>
        <FormField error={!!errors.nombre}>
            <Label>
              Órden de servicio
            </Label>
            <Input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
            {errors.nombre && <Message negative>{errors.nombre}</Message>}
          </FormField>
          <FormField error={!!errors.descripcion}>
            <Label>
              Descripción
            </Label>
            <TextArea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleDescripcionChange}
            />
            {errors.descripcion && <Message negative>{errors.descripcion}</Message>}
            <div className={styles.charCount}>
              {formData.descripcion.length}/{maxCharacters}
            </div>
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
        </FormGroup>
        <Button primary onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>

    </>

  )
}
