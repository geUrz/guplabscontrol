import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { IconClose } from '@/components/Layouts'
import { genUserId } from '@/helpers'
import styles from './ResidenteForm.module.css'

export function ResidenteForm(props) {
  const { reload, onReload, onOpenCloseForm, onToastSuccessUsuario } = props;

  const [errors, setErrors] = useState({});
  const [credentials, setCredentials] = useState({
    nombre: '',
    usuario: '',
    privada: '',
    calle: '',
    casa: '',
    email: '',
    isadmin: '',
    residencial_id: '',
    password: '',
    confirmarPassword: ''
  });

  const [residenciales, setResidenciales] = useState([]);
  const [error, setError] = useState(null);

  // Función para obtener los residenciales
  useEffect(() => {
    const fetchResidenciales = async () => {
      try {
        const response = await axios.get('/api/residenciales/residenciales');
        const opcionesResidenciales = response.data.map(res => ({
          key: res.id,
          text: res.nombre,
          value: res.id
        }));
        setResidenciales(opcionesResidenciales);
      } catch (error) {
        console.error('Error al cargar residenciales:', error);
      }
    };
    fetchResidenciales();
  }, []);

  const handleChange = (e, { name, value }) => {
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const validarFormSignUp = () => {
    const newErrors = {};

    if (!credentials.nombre) {
      newErrors.nombre = 'El campo es requerido'
    }

    if (!credentials.usuario) {
      newErrors.usuario = 'El campo es requerido'
    }

    if (!credentials.email) {
      newErrors.email = 'El campo es requerido'
    }

    if (!credentials.isadmin) {
      newErrors.isadmin = 'El campo es requerido'
    }

    if (!credentials.residencial_id) {
      newErrors.residencial_id = 'El campo es requerido'
    }

      if (!credentials.calle) {
        newErrors.calle = 'El campo es requerido'
      }
      if (!credentials.casa) {
        newErrors.casa = 'El campo es requerido'
      }

    if (!credentials.password) {
      newErrors.password = 'El campo es requerido'
    }

    if (!credentials.confirmarPassword) {
      newErrors.confirmarPassword = 'El campo es requerido'
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormSignUp()) {
      return;
    }
    setError(null);

    if (credentials.password !== credentials.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const folio = genUserId(4)
    const isactive = 1

    // Enviar datos al backend para crear el usuario
    try {
      await axios.post('/api/usuarios/usuarios', {
        folio,
        nombre: credentials.nombre,
        usuario: credentials.usuario,
        privada: credentials.privada,
        calle: credentials.calle,
        casa: credentials.casa,
        email: credentials.email,
        isadmin: credentials.isadmin,
        isactive,
        residencial_id: credentials.residencial_id,
        password: credentials.password
      });

      setCredentials({
        nombre: '',
        usuario: '',
        privada: '',
        calle: '',
        casa: '',
        email: '',
        isadmin: '',
        residencial_id: '',
        password: '',
        confirmarPassword: ''
      });

      setError(null);
      onReload(); // Puedes llamar a la función de recarga si es necesario
      onOpenCloseForm(); // Cerrar el formulario después de crear el usuario
      onToastSuccessUsuario(); // Mostrar mensaje de éxito
    } catch (error) {
      console.error('Error capturado:', error);

      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('¡ Ocurrió un error inesperado !');
      }
    }
  };

  return (
    <>
      <IconClose onOpenClose={onOpenCloseForm} />

      <div className={styles.main}>
        <div className={styles.container}>
          <Form onSubmit={handleSubmit}>
            <FormGroup widths='equal'>
              <FormField error={!!errors.nombre}>
                <Label>Nombre</Label>
                <Input
                  name='nombre'
                  type='text'
                  value={credentials.nombre}
                  onChange={handleChange}
                />
                {errors.nombre && <Message negative>{errors.nombre}</Message>}
              </FormField>
              <FormField error={!!errors.usuario}>
                <Label>Usuario</Label>
                <Input
                  name='usuario'
                  type='text'
                  value={credentials.usuario}
                  onChange={handleChange}
                />
                {errors.usuario && <Message negative>{errors.usuario}</Message>}
              </FormField>
              <FormField error={!!errors.residencial_id}>
                <Label>Residencial</Label>
                <Dropdown
                  placeholder='Selecciona residencial'
                  fluid
                  selection
                  options={residenciales}
                  name='residencial_id'
                  value={credentials.residencial_id}
                  onChange={handleChange}
                />
                {errors.residencial_id && <Message negative>{errors.residencial_id}</Message>}
              </FormField>
              <FormField error={!!errors.isadmin}>
                <Label>Nivel</Label>
                <Dropdown
                  placeholder='Selecciona nivel'
                  fluid
                  selection
                  options={[
                    { key: 'Admin', text: 'Admin', value: 'Admin' },
                    { key: 'Técnico', text: 'Técnico', value: 'Técnico' },
                  ]}
                  name='isadmin'
                  value={credentials.isadmin}
                  onChange={handleChange}
                />
                {errors.isadmin && <Message negative>{errors.isadmin}</Message>}
              </FormField>
              <FormField>
                <Label>Privada</Label>
                <Input
                  name='privada'
                  type="text"
                  value={credentials.privada}
                  onChange={handleChange}
                />
              </FormField>
              <FormField error={!!errors.calle}>
                <Label>Calle</Label>
                <Input
                  name='calle'
                  type="text"
                  value={credentials.calle}
                  onChange={handleChange}
                />
                {errors.calle && <Message negative>{errors.calle}</Message>}
              </FormField>
              <FormField error={!!errors.casa}>
                <Label>Casa</Label>
                <Input
                  name='casa'
                  type='number'
                  value={credentials.casa}
                  onChange={handleChange}
                />
                {errors.casa && <Message negative>{errors.casa}</Message>}
              </FormField>
              <FormField error={!!errors.email}>
                <Label>Correo</Label>
                <Input
                  name='email'
                  type='email'
                  value={credentials.email}
                  onChange={handleChange}
                />
                {errors.email && <Message negative>{errors.email}</Message>}
              </FormField>
              <FormField error={!!errors.password}>
                <Label>Contraseña</Label>
                <Input
                  name='password'
                  type='password'
                  value={credentials.password}
                  onChange={handleChange}
                />
                {errors.password && <Message negative>{errors.password}</Message>}
              </FormField>
              <FormField error={!!errors.confirmarPassword}>
                <Label>Confirmar contraseña</Label>
                <Input
                  name='confirmarPassword'
                  type='password'
                  value={credentials.confirmarPassword}
                  onChange={handleChange}
                />
                {errors.confirmarPassword && <Message negative>{errors.confirmarPassword}</Message>}
              </FormField>
            </FormGroup>
            {error && <p className={styles.error}>{error}</p>}
            <Button primary type='submit'>
              Crear
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}
