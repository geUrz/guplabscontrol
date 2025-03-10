import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message, TextArea } from 'semantic-ui-react'
import styles from './IncidenciaEditForm.module.css'
import { useAuth } from '@/contexts/AuthContext'

export function IncidenciaEditForm(props) {

  const { reload, onReload, incidencia, onOpenEditIncidencia, onToastSuccessMod } = props

  const { user } = useAuth()

  const [formData, setFormData] = useState({
    incidencia: incidencia.incidencia,
    descripcion: incidencia.descripcion,
    zona: incidencia.zona,
    estado: incidencia.estado
  })

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!formData.incidencia) {
      newErrors.incidencia = 'El campo es requerido'
    }

    if (!formData.descripcion) {
      newErrors.descripcion = 'El campo es requerido'
    }

    if (!formData.zona) {
      newErrors.zona = 'El campo es requerido'
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
      await axios.put(`/api/incidencias/incidencias?id=${incidencia.id}`, formData)
      onReload()
      onOpenEditIncidencia()
      onToastSuccessMod()
    } catch (error) {
      console.error('Error actualizando la incidencia:', error)
    }
  }

  const opcionesEstado = [
    { key: 1, text: 'Pendiente', value: 'Pendiente' },
    { key: 2, text: 'En proceso', value: 'En proceso' },
    { key: 3, text: 'Realizada', value: 'Realizada' }
  ]

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

      <IconClose onOpenClose={onOpenEditIncidencia} />

      <Form onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <FormGroup widths='equal'>
          <FormField error={!!errors.incidencia}>
            <Label>
              Incidencia
            </Label>
            <Input
              type="text"
              name="incidencia"
              value={formData.incidencia}
              onChange={handleChange}
            />
            {errors.incidencia && <Message negative>{errors.incidencia}</Message>}
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
          <FormField error={!!errors.zona}>
            <Label>
              Zona
            </Label>
            <TextArea
              name='zona'
              type="text"
              value={formData.zona}
              onChange={handleChange}
            />
            {errors.zona && <Message negative>{errors.zona}</Message>}
          </FormField>
        {user.isadmin === 'Admin' && activate ? (
          <>
            <FormField>
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
          </>
        ) : (
          ''
        )}
      </FormGroup>
      <Button primary onClick={handleSubmit}>
        Guardar
      </Button>
    </Form >

    </>

  )
}
