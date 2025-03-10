import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message, TextArea } from 'semantic-ui-react'
import { useAuth } from '@/contexts/AuthContext'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './VisitaTecnicaEditForm.module.css'

export function VisitaTecnicaEditForm(props) {

  const { reload, onReload, visitatecnica, onOpenEditVisitatecnica, onToastSuccessMod } = props

  const [formData, setFormData] = useState({
    visitatecnica: visitatecnica.visitatecnica,
    descripcion: visitatecnica.descripcion,
    date: visitatecnica.date ? new Date(visitatecnica.date + 'T00:00:00') : null,
    estado: visitatecnica.estado
  })

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!formData.visitatecnica) {
      newErrors.visitatecnica = 'El campo es requerido'
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

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!validarForm()) {
      return
    }

    try {
      await axios.put(`/api/visitatecnica/visitatecnica?id=${visitatecnica.id}`, {
        ...formData,
        date: formData.date ? formData.date.toISOString().split('T')[0] : null
      })
      onReload()
      onOpenEditVisitatecnica()
      onToastSuccessMod()
    } catch (error) {
      console.error('Error actualizando la visitatecnica:', error)
    }
  }

  const opcionesEstado = [
    { key: 1, text: 'Pendiente', value: 'Pendiente' },
    { key: 2, text: 'En proceso', value: 'En proceso' },
    { key: 3, text: 'Realizada', value: 'Realizada' }
  ]


  return (

    <>

      <IconClose onOpenClose={onOpenEditVisitatecnica} />

      <Form>
        <FormGroup widths='equal'>
        <FormField error={!!errors.visitatecnica}>
            <Label>
              Visita técnica
            </Label>
            <Input
              type="text"
              name="visitatecnica"
              value={formData.visitatecnica}
              onChange={handleChange}
            />
            {errors.visitatecnica && <Message negative>{errors.visitatecnica}</Message>}
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
            {errors.estado && <span className={styles.error}>{errors.estado}</span>}
          </FormField>
        </FormGroup>
        <Button primary onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>

    </>

  )
}
