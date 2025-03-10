import { IconClose, Loading } from '@/components/Layouts'
import styles from './ModalImg.module.css'
import { Image } from 'semantic-ui-react'
import { FaTrash } from 'react-icons/fa'
import { useAuth } from '@/contexts/AuthContext'

export function ModalImg(props) {
  const { img, imgKey, openImg, onShowConfirmDelImg, delImage = true } = props

  const {user, loading} = useAuth()

  if (loading) {
      return <Loading size={45} loading={0} />
    }

  return (
    <>
      <IconClose onOpenClose={openImg} />

      {!img ? (
        <Loading size={40} loading={1} />
      ) : (
        <div className={styles.img}>
          <Image src={img} />
          {delImage && user && (user.isadmin === 'Admin' || user && user.isadmin === 'Técnico' || user.isadmin === 'Caseta') ? (
            <FaTrash onClick={() => onShowConfirmDelImg(imgKey)} />
          ) : null}
        </div>
      )}
    </>
  );
}
