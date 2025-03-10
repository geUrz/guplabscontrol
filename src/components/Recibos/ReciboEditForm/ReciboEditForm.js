import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './ReciboEditForm.module.css'

export function ReciboEditForm(props) {

  const { reload, onReload, recibo, onOpenEditRecibo, onToastSuccessMod } = props

  const [formData, setFormData] = useState({
    recibo: recibo.recibo
  })
  
  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!formData.recibo) {
      newErrors.recibo = 'El campo es requerido'
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
      await axios.put(`/api/recibos/recibos?id=${recibo.id}`, {
        ...formData,
      })
      onReload()
      onOpenEditRecibo()
      onToastSuccessMod()
    } catch (error) {
      console.error('Error actualizando el recibo:', error)
    }
  }

  return (

    <>

      <IconClose onOpenClose={onOpenEditRecibo} />

      <Form>
        <FormGroup widths='equal'>
          <FormField error={!!errors.recibo}>
            <Label>
              Recibo
            </Label>
            <Input
              type="text"
              name="recibo"
              value={formData.recibo}
              onChange={handleChange}
            />
            {errors.recibo && <Message negative>{errors.recibo}</Message>}
          </FormField>
        </FormGroup>
        <Button primary onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>

    </>

  )
}
