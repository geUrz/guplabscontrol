import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message, TextArea } from 'semantic-ui-react'
import { BasicModal } from '@/layouts'
import { FaPlus } from 'react-icons/fa'
import { ToastSuccess } from '@/components/Layouts'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './CotizacionEditForm.module.css'

export function CotizacionEditForm(props) {

  const { reload, onReload, cotizacion, onOpenEditCotizacion, onToastSuccessMod } = props

  const [formData, setFormData] = useState({
    cotizacion: cotizacion.cotizacion
  })
  
  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!formData.cotizacion) {
      newErrors.cotizacion = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleDropdownChange = (e, { value }) => {
    setFormData({ ...formData, cliente_id: value })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!validarForm()) {
      return
    }

    try {
      await axios.put(`/api/cotizaciones/cotizaciones?id=${cotizacion.id}`, {
        ...formData,
      })
      onReload()
      onOpenEditCotizacion()
      onToastSuccessMod()
    } catch (error) {
      console.error('Error actualizando la cotizacion:', error)
    }
  }

  return (

    <>

      <IconClose onOpenClose={onOpenEditCotizacion} />

      <Form>
        <FormGroup widths='equal'>
          <FormField error={!!errors.cotizacion}>
            <Label>
              Cotización
            </Label>
            <Input
              type="text"
              name="cotizacion"
              value={formData.cotizacion}
              onChange={handleChange}
            />
            {errors.cotizacion && <Message negative>{errors.cotizacion}</Message>}
          </FormField>
        </FormGroup>
        <Button primary onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>

    </>

  )
}
