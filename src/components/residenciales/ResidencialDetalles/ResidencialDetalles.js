import { IconClose, IconEdit } from '@/components/Layouts';
import { formatDateIncDet } from '@/helpers';
import { BasicModal } from '@/layouts';
import { FaEdit } from 'react-icons/fa';
import { useMemo, useState } from 'react';
import { ResidencialEditForm } from '../ResidencialEditForm/ResidencialEditForm';
import { useAuth } from '@/contexts/AuthContext';
import styles from './ResidencialDetalles.module.css';

export function ResidencialDetalles(props) {

  const { user, reload, onReload, residencial, onCloseDetalles, onToastSuccessMod } = props

  const [showEditResidencial, setShowEditResidencial] = useState(null)
  const onOpenEditResidencial = () => setShowEditResidencial(prevState => !prevState)

  const permissions = useMemo(() => {

    if(!user) return {}

    return{
      showAdmin: ['Admin'].includes(user?.isadmin)
    }

  }, [user])

  return (
    <>
      <IconClose onOpenClose={onCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Residencial</h1>
              <h2>{residencial.nombre}</h2>
            </div>
            <div>
              <h1>Dirección</h1>
              <h2>{residencial.direccion}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{residencial.folio}</h2>
            </div>
            <div>
              <h1>Fecha</h1>
              <h2>{formatDateIncDet(residencial.createdAt)}</h2>
            </div>
          </div>
        </div>

        {permissions.showAdmin &&

          <IconEdit onOpenEdit={onOpenEditResidencial} />

        }

      </div>

      <BasicModal title='modificar el residencial' show={showEditResidencial} onClose={onOpenEditResidencial}>
        <ResidencialEditForm reload={reload} onReload={onReload} residencial={residencial} onOpenEditResidencial={onOpenEditResidencial} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>

    </>
  )
}
