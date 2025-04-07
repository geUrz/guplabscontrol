import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { Form, Button, Input, Label, FormGroup, FormField, Message, Dropdown } from 'semantic-ui-react'
import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import styles from './ModUsuarioForm.module.css'
import { BasicModal } from '@/layouts'
import { EditPass, IconKey } from '@/components/Layouts'

export function ModUsuarioForm(props) {
  const { onOpenClose, onToastSuccessMod } = props
  const { user, logout } = useAuth()

  const [isLoading, setIsLoading] = useState(false)

  const [showEditPass, setShowEditPass] = useState(false)

  const onOpenCloseEditPass = () => setShowEditPass((prevState) => !prevState)

  const [formData, setFormData] = useState({
    newNombre: user.nombre || '',
    newUsuario: user.usuario || '',
    newEmail: user.email || '',
    newIsAdmin: user.isadmin || '',
    newResidencial: user.residencial_id || ''
  });

  const [residenciales, setResidenciales] = useState([]);
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

    if (!formData.newResidencial) {
      newErrors.newResidencial = 'El campo es requerido';
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

    setIsLoading(true)

    if (!validarFormUser()) {
      return
    }

    setError(null)

    try {
      await axios.put('/api/auth/updateUser', {
        userId: user.id,
        newNombre: formData.newNombre,
        newUsuario: formData.newUsuario,
        newEmail: formData.newEmail,
        newIsAdmin: formData.newIsAdmin,
      })

      logout()

    } catch (error) {
      setIsLoading(false)
      console.error('Error al actualizar el perfil:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Ocurrió un error inesperado');
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
    { key: 2, text: 'ComitéSU', value: 'ComitéSU' },
    { key: 3, text: 'Comité', value: 'Comité' },
    { key: 4, text: 'Residente', value: 'Residente' },
    { key: 5, text: 'Caseta', value: 'Caseta' },
    { key: 6, text: 'Técnico', value: 'Técnico' }
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
            <Label>Nombre</Label>
            <Input
              name='newNombre'
              type='text'
              value={formData.newNombre}
              onChange={handleChange}
            />
            {errors.newNombre && <Message negative>{errors.newNombre}</Message>}
          </FormField>
          <FormField error={!!errors.newUsuario}>
            <Label>Usuario</Label>
            <Input
              name='newUsuario'
              type='text'
              value={formData.newUsuario}
              onChange={handleChange}
            />
            {errors.newUsuario && <Message negative>{errors.newUsuario}</Message>}
          </FormField>
          <FormField error={!!errors.newEmail}>
            <Label>Correo</Label>
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
        </FormGroup>
        {error && <p className={styles.error}>{error}</p>}

        <IconKey onOpenCloseEditPass={onOpenCloseEditPass} />

        <Button primary loading={isLoading} onClick={handleSubmit}>Guardar</Button>
      </Form>

      <BasicModal title='Modificar contraseña' show={showEditPass} onClose={onOpenCloseEditPass}>
        <EditPass usuario={user} onOpenCloseEditPass={onOpenCloseEditPass} onToastSuccessUsuarioMod={onToastSuccessMod} />
      </BasicModal>

    </>
  )
}
