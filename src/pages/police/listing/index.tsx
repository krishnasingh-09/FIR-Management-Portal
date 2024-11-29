// named imports
import { useAddress } from '@thirdweb-dev/react'
import { useRouter } from 'next/router'

// default imports
import DashboardLayout from '@/components/globals/DashboardLayout'
import FIRTable from '@/components/police/FIRTable'

const FIRListing = () => {
  const address = useAddress()
  const router = useRouter()

  if (typeof window === 'undefined') return null

  if (address && address === undefined) {
    router.push('/login')
  }

  return (
    <DashboardLayout>
      <div className='p-4'>
        <h2 className='dashboard-heading'>FIR Listing</h2>

        <FIRTable />
      </div>
    </DashboardLayout>
  )
}

export default FIRListing
