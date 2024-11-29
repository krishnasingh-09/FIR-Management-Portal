import { useContract, useNFTs } from '@thirdweb-dev/react'
import { useState } from 'react'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import DashboardLayout from '@/components/globals/DashboardLayout'
import Loading from '@/components/globals/Loading'
import FIRDetail from '@/components/globals/FIRDetail'

const FIRListing = () => {
  const [selectedStatus, setSelectedStatus] = useState('New')

  const { contract: FIRCollection } = useContract(process.env.NEXT_PUBLIC_FIR_CONTRACT)

  const { data: FIRsData, isLoading: FIRsDataLoading } = useNFTs(FIRCollection)

  if (FIRsDataLoading) return <Loading />

  let FIRsMetadata: FIR[] = []

  FIRsData?.map(async (fir: any) => {
    if (fir.owner !== '0x0000000000000000000000000000000000000000') {
      const data = fir.metadata
      FIRsMetadata.push(data)
    } else {
      console.log('no data')
    }
  })

  return (
    <DashboardLayout>
      <div className='mt-5'>
        <h2 className='dashboard-heading mx-4'>FIR Listing</h2>

        <div className='py-3 px-5 mt-5 rounded-md text-gray-800'>

          <div className='border border-gray-200 rounded-md p-2'>
            <button
              onClick={() => setSelectedStatus('New')}
              className={`badge-btn ${selectedStatus === 'New' ? 'bg-sky-100' : 'bg-white'}`}
            >
              New
            </button>
            <button onClick={() => setSelectedStatus('Pending')} className={`badge-btn ${selectedStatus === 'Pending' ? 'bg-sky-100' : 'bg-white'}`}>Pending</button>
            <button onClick={() => setSelectedStatus('Resolved')} className={`badge-btn ${selectedStatus === 'Resolved' ? 'bg-sky-100' : 'bg-white'}`}>Resolved</button>
          </div>

          <table className='w-full mt-7'>
            <thead className='w-full border-b border-gray-300'>
              <tr className='bg-slate-800'>
                <th className='table-header rounded-tl-lg'>FIR ID.</th>
                <th className='table-header'>Victim Name</th>
                <th className='table-header'>Victim Contact</th>
                <th className='table-header'>Wallet Address</th>
                <th className='table-header'>Status</th>
                <th className='table-header rounded-tr-lg'>Actions</th>
              </tr>
            </thead>

            <tbody className='h-[10px] overflow-x-auto overflow-y-scroll'>
              {FIRsMetadata.length > 0 ? (
                FIRsMetadata?.map((fir: FIR, index) => {
                  console.log(fir)
                  if (fir.properties.status === selectedStatus) {
                    return (
                      <tr
                        key={fir?.id}
                        className={`w-full border-l border-gray-300 hover:cursor-pointer ${index % 2 === 1 ? 'bg-sky-50' : 'bg-white'} text-sm border-b border-gray-300`}
                      >
                        <td className='table-data'>
                          {fir?.properties?.firId.slice(0, 6)}...{fir.properties.firId.slice(-6)}
                        </td>
                        <td className='table-data text-sm'>
                          <p>{fir?.properties?.name}</p>
                          <p className='text-xs'>{fir?.properties?.email}</p>
                        </td>
                        <td className='table-data'>{fir?.properties?.contact}</td>
                        <td className='table-data'>
                          {fir?.properties?.walletAddress.slice(0, 6)}...{fir?.properties?.walletAddress.slice(-6)}
                        </td>
                        <td className='table-data'>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${selectedStatus === 'Pending'
                              ? 'bg-rose-100 text-rose-600'
                              : selectedStatus === 'In-progress' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                              }`}
                          >
                            {selectedStatus}
                          </span>
                        </td>
                        <td
                          onClick={(e) => e.stopPropagation()}
                          className='table-data border-r border-gray-300'>
                          <Popover>
                            <PopoverTrigger>
                              <EllipsisHorizontalIcon className='h-6 w-6' />
                            </PopoverTrigger>
                            <PopoverContent className='w-36 -p-2'>

                              <Dialog>
                                <DialogTrigger
                                  className='w-full p-2 hover:bg-gray-100 text-left  text-sm rounded-sm'>
                                  <p className='text-center'>View FIR</p>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader className='-mb-10 p-1 m-1'>
                                    <DialogTitle className='text-center font-semibold text-xl'>FIR Details</DialogTitle>
                                    <DialogDescription>
                                      <p className='font-bold text-black text-center -mb-8'>FIR ID: {fir?.properties?.firId}</p>
                                    </DialogDescription>
                                  </DialogHeader>
                                  <FIRDetail
                                    fir={fir}
                                    selectedStatus={selectedStatus}
                                  />
                                </DialogContent>
                              </Dialog>
                            </PopoverContent>
                          </Popover>
                        </td>
                      </tr>
                    )
                  }
                })) : (
                <tr>
                  <td className='text-center' colSpan={6}>No FIRs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default FIRListing