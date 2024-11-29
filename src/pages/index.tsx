
// named imports
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { userUserStore } from '@/store/useUserStore'
import { useAddress, useContract, useOwnedNFTs } from '@thirdweb-dev/react'

// default imports
import Loading from '@/components/globals/Loading'

enum Role {
  POLICE = 'Police',
  ADMIN = 'Admin',
  NULL = 0 as const
}

export default function Home() {
  const address = useAddress()
  const router = useRouter()

  // user state from zustand store
  const [role, setRole] = userUserStore(state => [state.role, state.setRole])

  // define contracts for police and citizen NFTs
  const { contract: policeCollection } = useContract(process.env.NEXT_PUBLIC_POLICE_CONTRACT)
  const { data: policeAccessNFTs, isLoading: policeAccessDataLoading } = useOwnedNFTs(policeCollection, address)

  // set role based on address
  useEffect(() => {
    if (address === undefined) {
      router.push('/login')
    }

    if (process.env.NEXT_PUBLIC_ADMIN_ADDRESS === address) {
      setRole(Role.ADMIN)
    } else if (policeAccessNFTs && policeAccessNFTs?.length > 0) {
      setRole(Role.POLICE)
    } else {
      setRole(Role.NULL)
    }

  }, [address, policeAccessNFTs])


  if (policeAccessDataLoading) {
    return <Loading />
  }

  if (process.env.NEXT_PUBLIC_ADMIN_ADDRESS === address) {
    router.push('/admin')
  }

  if (role === Role.POLICE) {
    router.push('/police')
  }
}