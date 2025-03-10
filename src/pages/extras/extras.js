import { BasicLayout } from '@/layouts'
import styles from './extras.module.css'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'

export default function Extras() {
  return (

    <ProtectedRoute>

      <BasicLayout title='extras' relative>



      </BasicLayout>

    </ProtectedRoute>

  )
}
