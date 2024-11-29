// named imports
import { useContract, useContractRead } from '@thirdweb-dev/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
// default imports
import DashboardLayout from '@/components/globals/DashboardLayout'
import Loading from '@/components/globals/Loading';

const ComplaintListing = () => {

  const { contract } = useContract(process.env.NEXT_PUBLIC_COMPLAINT_CONTRACT);
  const { data, isLoading } = useContractRead(contract, 'getAllComplaints')

  const complaints = data?.map((complaint: any, index: number) => {
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

  if (isLoading) return <Loading />

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
            <div className='h-[550px] overflow-x-auto overflow-y-scroll'>
              {complaints?.map((complaint: Complaint, index: number) => (
                <tr className={`w-full border-l border-gray-300 hover:cursor-pointer ${index % 2 === 1 ? 'bg-sky-50' : 'bg-white'} text-sm border-b border-gray-300`} key={complaint?.complaintId}>
                  <Accordion key={index} type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <td className='table-data'>
                          {complaint?.complaintId}
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
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </tr>
              ))}
            </div>
          </tbody>
        </table>

      </div>
    </DashboardLayout>
  )
}

export default ComplaintListing