import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Button, Form, FormField, FormGroup, Input, Label, Message, TextArea } from 'semantic-ui-react'
import { useAuth } from '@/contexts/AuthContext'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './AnuncioEditForm.module.css'

export function AnuncioEditForm(props) {

  const { reload, onReload, anuncioData, actualizarAnuncio, onOpenEditAnuncio, onToastSuccessMod } = props

  const { user } = useAuth()

  const [formData, setFormData] = useState({
    anuncio: anuncioData.anuncio,
    descripcion: anuncioData.descripcion,
    date: anuncioData.date ? new Date(anuncioData.date + 'T00:00:00') : null,
    hora: anuncioData.hora
  })

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!formData.anuncio) {
      newErrors.anuncio = 'El campo es requerido'
    }

    if (!formData.descripcion) {
      newErrors.descripcion = 'El campo es requerido'
    }

    if (!formData.date) {
      newErrors.date = 'El campo es requerido'
    }

    if (!formData.hora) {
      newErrors.hora = 'El campo es requerido'
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

    const formatDate = (date) => date ? date.toISOString().split('T')[0] : null;
  
    const formattedData = {
      ...formData,
      date: formatDate(formData.date),
    }

    try {
      await axios.put(`/api/anuncios/anuncios?id=${anuncioData.id}`, formattedData)
      onReload()
      actualizarAnuncio(formattedData)
      onOpenEditAnuncio()
      onToastSuccessMod()
    } catch (error) {
      console.error('Error actualizando el anuncio:', error)
    }
  }

  const [activate, setActivate] = useState(false)

  const timer = useRef(null)

  const handleTouchStart = () => {
    timer.current = setTimeout(() => {
      setActivate(prev => !prev)
    }, 3000)
  }

  const handleTouchEnd = () => {
    clearTimeout(timer.current)
  }

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === '0') {
      e.preventDefault()
      setActivate((prevState) => !prevState)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (

    <>

      <IconClose onOpenClose={onOpenEditAnuncio} />

      <Form onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <FormGroup>
          <FormField error={!!errors.anuncio}>
            <Label>
              Anuncio
            </Label>
            <Input
              type="text"
              name="anuncio"
              value={formData.anuncio}
              onChange={handleChange}
            />
            {errors.anuncio && <Message negative>{errors.anuncio}</Message>}
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
          <FormField error={!!errors.hora}>
            <Label>
              Hora
            </Label>
            <Input
              name='hora'
              type="time"
              value={formData.hora}
              onChange={handleChange}
            />
            {errors.hora && <Message negative>{errors.hora}</Message>}
          </FormField>
        </FormGroup>
        <Button primary onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>

    </>

  )
}
