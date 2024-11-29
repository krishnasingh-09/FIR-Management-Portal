import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Web3Button, useContract, useGrantRole, useIsAddressRole } from '@thirdweb-dev/react'

interface Props {
  walletAddress: string
}

const AddPermission = ({ walletAddress }: Props) => {
  const minterRole = 'minter'

  const { contract: FIRCollection } = useContract<any>(process.env.NEXT_PUBLIC_FIR_CONTRACT as string)
  const { mutateAsync: grantRole, isLoading, error } = useGrantRole(FIRCollection);

  const hasAccessToFIRCollection = useIsAddressRole(FIRCollection, minterRole, walletAddress)


  // const collectionOfFIRs = [
  //   {
  //     label: 'Created FIRs',
  //     contract: process.env.NEXT_PUBLIC_FIR_CREATED_CONTRACT_ADDRESS,
  //     hasAccess: hasAccessToCreateFIR
  //   },
  //   {
  //     label: 'Change Status to pending',
  //     contract: process.env.NEXT_PUBLIC_FIR_PENDING_CONTRACT_ADDRESS,
  //     hasAccess: hasAccessToUpdateFIR
  //   },
  //   {
  //     label: 'Change Status to resolved',
  //     contract: process.env.NEXT_PUBLIC_FIR_RESOLVED_CONTRACT_ADDRESS,
  //     hasAccess: hasAccessToResolveFIR
  //   }
  // ]

  return (
    <>
      <DialogContent>
        <DialogHeader>
          {/* <DialogTitle>Update Status</DialogTitle> */}
        </DialogHeader>
        <DialogDescription>
          {/* Update the status of FIR with id {fir.id} */}
        </DialogDescription>
        <h2 className='font-bold text-xl text-center -mt-4'>Give Access for</h2>
        <div className='mx-auto flex flex-col space-y-3 text-sm'>

          {!hasAccessToFIRCollection ? (
            <Web3Button
              theme={'light'}
              className='permission-btn'
              contractAddress={process.env.NEXT_PUBLIC_FIR_CONTRACT as string}
              action={() => {
                grantRole({
                  address: walletAddress,
                  role: minterRole
                })
              }}
            >
              Grant Role
            </Web3Button>
          ) : (
            <p className='font-bold text-green-500'>User Already has Access</p>
          )}
        </div>
      </DialogContent>
    </>
  )
}

export default AddPermission