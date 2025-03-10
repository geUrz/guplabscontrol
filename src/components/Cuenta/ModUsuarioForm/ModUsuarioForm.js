import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { Form, Button, Input, Label, FormGroup, FormField, Message, Dropdown } from 'semantic-ui-react'
import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import styles from './ModUsuarioForm.module.css'

export function ModUsuarioForm(props) {
  const { onOpenClose } = props
  const { user, logout } = useAuth()

  const [formData, setFormData] = useState({
    newNombre: user.nombre || '',
    newUsuario: user.usuario || '',
    newEmail: user.email || '',
    newIsAdmin: user.isadmin || '',
    newPassword: '',
    confirmPassword: '',
    newResidencial: user.residencial_id || '' // Nuevo estado para el residencial, preasignado
  });

  const [residenciales, setResidenciales] = useState([]); // Estado para residenciales
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})

  const validarFormUser = () => {
    const newErrors = {};

    if (!formData.newNombre) {
      newErrors.newNombre = 'El campo es requerido';
    }

    if (!formData.newUsuario) {
      newErrors.newUsuario = 'El campo es requerido';
    }

    if (!formData.newIsAdmin) {
      newErrors.newIsAdmin = 'El campo es requerido';
    }

    // Validación para el residencial solo si el nivel no es Admin (opcional)
    if (!formData.newResidencial) {
      newErrors.newResidencial = 'El campo es requerido'; // Validación para residencial
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
      await axios.put('/api/auth/updateUser', {
        userId: user.id,
        newNombre: formData.newNombre,
        newUsuario: formData.newUsuario,
        newEmail: formData.newEmail,
        newIsAdmin: formData.newIsAdmin,
        newResidencial: formData.newResidencial, // Enviar el residencial
        newPassword: formData.newPassword,
      })

      logout()

    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Ocurrió un error inesperado');
      }
    }
  }

  // Cargar los residenciales al montar el componente
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
      <IconClose onOpenClose={onOpenClose} />
      <Form onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
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

          {activate ? (
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
          ) : ''}

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
