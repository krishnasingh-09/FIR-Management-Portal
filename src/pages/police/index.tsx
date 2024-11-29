import { useAuth } from '@/hooks/useAuth'
import { useAddress } from '@thirdweb-dev/react'
import NotAuthorized from '@/components/globals/NotAuthorized'
import PoliceDashboard from '@/components/police/PoliceDashboard'
import { useRouter } from 'next/router'

const PoliceView = () => {
  const address = useAddress()
  const isAuthenicated = useAuth(process.env.NEXT_PUBLIC_POLICE_CONTRACT!, address!)
  const router = useRouter()

  if (typeof window === 'undefined') return null

  if (address === undefined) {
    router.push('/login')
  }

  if (!isAuthenicated) return <NotAuthorized />

  return (
    <>
      <PoliceDashboard />
    </>
  )
}

export default PoliceView