// named imports
import { useContract, useContractRead, useNFTs } from '@thirdweb-dev/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useRouter } from 'next/navigation';
import { useHandleComplaintStore } from '@/store/useUserStore';
// default imports
import DashboardLayout from '@/components/globals/DashboardLayout'
import Loading from '@/components/globals/Loading';

const ComplaintListing = () => {

  const { contract } = useContract(process.env.NEXT_PUBLIC_COMPLAINT_CONTRACT as string);
  const { data: complaintsCollection, isLoading } = useContractRead(contract, 'getAllComplaints')
  const router = useRouter()

  const { contract: FIRCollection } = useContract(process.env.NEXT_PUBLIC_FIR_CONTRACT)
  const { data: FIRsData, isLoading: FIRsDataLoading } = useNFTs(FIRCollection)

  const firIds = FIRsData?.map((fir: any) => fir?.metadata?.properties?.firId)

  const complaints = complaintsCollection?.map((complaint: any, index: number) => {
    return {
      complaintId: complaint[3],
      walletAddress: complaint[1],
      name: complaint[2],
      contact: complaint[4],
      email: complaint[5],
      address: complaint[6],
      title: complaint[7],
      description: complaint[8],
    }
  })

  const [complaint, setComplaint] = useHandleComplaintStore((state) => [state.complaint, state.setComplaint])
  if (isLoading) return <Loading />

  console.log(complaint)

  return (
    <DashboardLayout>
      <div className='p-4 pr-10'>
        <h2 className='dashboard-heading'>Complaints Listing</h2>

        <table className='w-full mt-7'>
          <thead className='border-b border-gray-300'>
            <tr className='bg-slate-800 grid grid-cols-5'>
              <th className='table-header rounded-tl-lg'>Complaint ID.</th>
              <th className='table-header'>Name</th>
              <th className='table-header'>Contact</th>
              <th className='table-header'>Title</th>
              <th className='table-header rounded-tr-lg'>Wallet Address</th>
            </tr>
          </thead>

          <tbody className=''>
            {complaints?.map((complaint: Complaint, index: number) => (
              <tr className={`w-full border-l border-gray-300 hover:cursor-pointer ${index % 2 === 1 ? 'bg-sky-50' : 'bg-white'} text-sm border-b border-gray-300`} key={complaint?.complaintId}>
                <Accordion key={index} type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <td className='table-data'>
                        {complaint?.complaintId.slice(0, 6)}...{complaint?.complaintId.slice(-6)}
                      </td>
                      <td className='table-data text-sm'>
                        <p>{complaint?.name}</p>
                        <p className='text-xs'>{complaint?.email}</p>
                      </td>
                      <td className='table-data '>{complaint?.contact}</td>
                      <td className='table-data '>{complaint?.title}</td>
                      <td className='table-data '>
                        {complaint?.walletAddress.slice(0, 6)}...{complaint?.walletAddress.slice(-6)}
                      </td>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className='px-5 pt-2 space-y-2'>
                        <p className='text-xs px-10 text-center'><span className='font-semibold'>Description</span>: {complaint?.description}</p>
                        {firIds?.map(fir => fir).includes(complaint?.complaintId) ? (
                          <p className='text-center text-green-600 font-semibold'>FIR Already filed.</p>
                        ) : (
                          <button
                            onClick={
                              () => {
                                setComplaint(complaint)
                                router.push('/police/listing')
                              }}
                            className='add-officer-btn ml-[420px] rounded-none text-xs'
                          >
                            File FIR
                          </button>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </DashboardLayout>
  )
}

export default ComplaintListing