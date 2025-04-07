import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { Form, Button, Input, Label, FormGroup, FormField, Message } from 'semantic-ui-react'
import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import styles from './ModResidenteForm.module.css'
import { EditPass, IconKey } from '@/components/Layouts'
import { BasicModal } from '@/layouts'

export function ModResidenteForm(props) {
  const { onOpenClose, onToastSuccessMod } = props
  const { user, logout } = useAuth()

  const [showEditPass, setShowEditPass] = useState(false)

  const onOpenCloseEditPass = () => setShowEditPass((prevState) => !prevState)

  const [formData, setFormData] = useState({
    newNombre: user.nombre || '',
    newUsuario: user.usuario || '',
    newPrivada: user.privada || '',
    newCalle: user.calle || '',
    newCasa: user.casa || '',
    newEmail: user.email || '',
    newIsAdmin: user.isadmin || ''
  });

  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})

  const validarFormUser = () => {
    const newErrors = {}
    if (!formData.newNombre) newErrors.newNombre = 'El campo es requerido'
    if (!formData.newUsuario) newErrors.newUsuario = 'El campo es requerido'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validarFormUser()) {
      return
    }

    setError(null)

    try {
      await axios.put('/api/auth/updateUser', {
        userId: user.id,
        newNombre: formData.newNombre,
        newUsuario: formData.newUsuario,
        newPrivada: formData.newPrivada,
        newCalle: formData.newCalle,
        newCasa: formData.newCasa,
        newEmail: formData.newEmail
      })

      logout()

    } catch (error) {
      console.error('Error al actualizar el perfil:', error)
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error)
      } else {
        setError('Ocurrió un error inesperado')
      }
    }
  }

  return (
    <>
      <IconClose onOpenClose={onOpenClose} />

      <Form>
        <FormGroup widths='equal'>
          <FormField error={!!errors.newNombre}>
            <Label>Nombre</Label>
            <Input
              name='newNombre'
              type='text'
              value={formData.newNombre}
              onChange={handleChange}
            />
            {errors.newNombre && <Message>{errors.newNombre}</Message>}
          </FormField>
          <FormField error={!!errors.newUsuario}>
            <Label>Usuario</Label>
            <Input
              name='newUsuario'
              type='text'
              value={formData.newUsuario}
              onChange={handleChange}
            />
            {errors.newUsuario && <Message>{errors.newUsuario}</Message>}
          </FormField>
          <FormField>
            <Label>Privada</Label>
            <Input
              name='newPrivada'
              type='text'
              value={formData.newPrivada}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>Calle</Label>
            <Input
              name='newCalle'
              type='text'
              value={formData.newCalle}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>Casa</Label>
            <Input
              name='newCasa'
              type='text'
              value={formData.newCasa}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>Correo</Label>
            <Input
              name='newEmail'
              type='email'
              value={formData.newEmail}
              onChange={handleChange}
            />
          </FormField>
        </FormGroup>
        {error && <Message>{error}</Message>}

        <IconKey onOpenCloseEditPass={onOpenCloseEditPass} />
        
        <Button primary onClick={handleSubmit}>Guardar</Button>
      </Form>


      <BasicModal title='Modificar contraseña' show={showEditPass} onClose={onOpenCloseEditPass}>
        <EditPass usuario={user} onOpenCloseEditPass={onOpenCloseEditPass} onToastSuccessUsuarioMod={onToastSuccessMod} />
      </BasicModal>

    </>
  )
}
