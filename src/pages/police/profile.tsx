import { useAuth } from '@/hooks/useAuth'
import { userUserStore } from '@/store/useUserStore'
import { useRouter } from 'next/router'
import { useAddress } from '@thirdweb-dev/react'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import DashboardLayout from '@/components/globals/DashboardLayout'
import NotAuthorized from '@/components/globals/NotAuthorized'

const ProfilePage = () => {
  const router = useRouter()
  const address = useAddress()
  const [role, userAddress, setRole] = userUserStore(state => [state.role, state.userAddress, state.setRole])

  // if (!isAuthenicated) return <NotAuthorized />

  if (address === undefined) {
    router.push('/login')
  }

  const features = [
    'Analyse criminal data',
    'View victim complaints',
    'View FIR Listing',
    'View FIR Details',
    'Update FIR Status'
  ]

  return (
    <DashboardLayout>
      <div className='p-4'>
        <h2 className='dashboard-heading'>Police Profile</h2>
      </div>

      <div className='border m-5 flex flex-col space-y-4 border-gray-200 rounded-md p-5'>

        <div>
          <h3 className=''>Wallet Address:</h3>
          <p className='font-bold text-gray-500'>{userAddress}</p>
        </div>

        <div>
          <h3 className=''>Role:</h3>
          <p className='font-bold text-gray-500'>{role}</p>
        </div>

        <div>
          <h3 className='my-2'>Features:</h3>
          <div className='flex flex-col space-y-3'>
            {features.map((feature, index) => (
              <div key={index} className='flex space-x-5'>
                <CheckBadgeIcon className='h-6 w-6 text-sky-500' />
                <p className='font-semibold text-gray-500'>{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ProfilePage
