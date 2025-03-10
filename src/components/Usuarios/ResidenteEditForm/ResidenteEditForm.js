import { useState, useEffect } from 'react'
import axios from 'axios'
import { Form, Button, Input, Label, FormGroup, FormField, Message, Dropdown } from 'semantic-ui-react'
import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import styles from './ResidenteEditForm.module.css'

export function ResidenteEditForm(props) {
  const { reload, onReload, usuario, onOpenClose, onToastSuccessUsuarioMod } = props

  const [formData, setFormData] = useState({
    newNombre: usuario.nombre || '',
    newUsuario: usuario.usuario || '',
    newPrivada: usuario.privada || '',
    newCalle: usuario.calle || '',
    newCasa: usuario.casa || '',
    newEmail: usuario.email || '',
    newIsAdmin: usuario.isadmin || '',
    newResidencial: usuario.residencial_id || '',
    newPassword: '',
    confirmPassword: ''
  });

  const [residenciales, setResidenciales] = useState([])
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})
  
  const validarFormUser = () => {
    const newErrors = {}
    if (!formData.newNombre) newErrors.newNombre = 'El campo es requerido'
    if (!formData.newUsuario) newErrors.newUsuario = 'El campo es requerido'
    if (!formData.newResidencial) {newErrors.newResidencial = 'El campo es requerido'
    if (!formData.newIsAdmin) {newErrors.newIsAdmin = 'El campo es requerido'}
    if (formData.isadmin === 'Residente') {
      if (!formData.newCalle) {
        newErrors.newCalle = 'El campo es requerido'
      }
      if (!formData.newCasa) {
        newErrors.newCasa = 'El campo es requerido'
      }
    }
    if (!formData.newEmail) newErrors.newEmail = 'El campo es requerido'
    }

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

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      await axios.put(`/api/usuarios/usuarios?id=${usuario.id}`, {
        nombre: formData.newNombre,
        usuario: formData.newUsuario,
        privada: formData.newPrivada,
        calle: formData.newCalle,
        casa: formData.newCasa,
        email: formData.newEmail,
        isadmin: formData.newIsAdmin,
        residencial_id: formData.newResidencial,
        password: formData.newPassword,
      })

      onReload()
      onOpenClose()
      onToastSuccessUsuarioMod()

    } catch (error) {
      console.error('Error al actualizar el perfil:', error)
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error)
      } else {
        setError('Ocurrió un error inesperado')
      }
    }
  }

  useEffect(() => {
    const fetchResidenciales = async () => {
      try {
        const response = await axios.get('/api/residenciales/residenciales')
        const opcionesResidenciales = response.data.map(res => ({
          key: res.id,
          text: res.nombre,
          value: res.id
        }))
        setResidenciales(opcionesResidenciales)
      } catch (error) {
        console.error('Error al cargar residenciales:', error)
      }
    }

    fetchResidenciales()
  }, [])

  const opcionesNivel = [
    { key: 1, text: 'Admin', value: 'Admin' },
    { key: 2, text: 'Comité', value: 'Comité' },
    { key: 3, text: 'Residente', value: 'Residente' },
    { key: 4, text: 'Caseta', value: 'Caseta' },
    { key: 5, text: 'Técnico', value: 'Técnico' }
  ]

  return (
    <>
      <IconClose onOpenClose={onOpenClose} />

      <Form>
        <FormGroup widths='equal'>
          <FormField error={!!errors.newNombre}>
            <Label>Nuevo nombre</Label>
            <Input
              name='newNombre'
              type='text'
              value={formData.newNombre}
              onChange={handleChange}
            />
            {errors.newNombre && <Message negative>{errors.newNombre}</Message>}
          </FormField>
          <FormField error={!!errors.newUsuario}>
            <Label>Nuevo usuario</Label>
            <Input
              name='newUsuario'
              type='text'
              value={formData.newUsuario}
              onChange={handleChange}
            />
            {errors.newUsuario && <Message negative>{errors.newUsuario}</Message>}
          </FormField>
          <FormField error={!!errors.newResidencial}>
            <Label>Residencial</Label>
            <Dropdown
              placeholder='Selecciona residencial'
              fluid
              selection
              options={residenciales}
              name='newResidencial'
              value={formData.newResidencial}
              onChange={(e, { value }) => setFormData({ ...formData, newResidencial: value })}
            />
            {errors.newResidencial && <Message negative>{errors.newResidencial}</Message>}
          </FormField>
          <FormField error={!!errors.newIsAdmin}>
            <Label>Nivel</Label>
            <Dropdown
              placeholder='Selecciona una opción'
              fluid
              selection
              options={opcionesNivel}
              value={formData.newIsAdmin}
              onChange={(e, { value }) => setFormData({ ...formData, newIsAdmin: value })}
            />
            {errors.newIsAdmin && <Message negative>{errors.newIsAdmin}</Message>}
          </FormField>
          
          {formData.newIsAdmin === 'Residente' && (
                <>
                  <FormField>
                    <Label>Privada</Label>
                    <Input
                      name='newPrivada'
                      type="text"
                      value={formData.newPrivada}
                      onChange={handleChange}
                    />
                  </FormField>
                  <FormField error={!!errors.newCalle}>
                    <Label>Calle</Label>
                    <Input
                      name='newCalle'
                      type="text"
                      value={formData.newCalle}
                      onChange={handleChange}
                    />
                    {errors.newCalle && <Message negative>{errors.newCalle}</Message>}
                  </FormField>
                  <FormField error={!!errors.newCasa}>
                    <Label>Casa</Label>
                    <Input
                      name='newCasa'
                      type='number'
                      value={formData.newCasa}
                      onChange={handleChange}
                    />
                    {errors.newCasa && <Message negative>{errors.newCasa}</Message>}
                  </FormField>
                </>
              )}

          <FormField error={!!errors.newEmail}>
            <Label>Nuevo correo</Label>
            <Input
              name='newEmail'
              type='email'
              value={formData.newEmail}
              onChange={handleChange}
            />
            {errors.newEmail && <Message negative>{errors.newEmail}</Message>}
          </FormField>
          <FormField>
            <Label>Nueva contraseña</Label>
            <Input
              name='newPassword'
              type='password'
              value={formData.newPassword}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>Confirmar nueva contraseña</Label>
            <Input
              name='confirmPassword'
              type='password'
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </FormField>
        </FormGroup>
        {error && <p className={styles.error}>{error}</p>}
        <Button primary onClick={handleSubmit}>Guardar</Button>
      </Form>
    </>
  )
}
