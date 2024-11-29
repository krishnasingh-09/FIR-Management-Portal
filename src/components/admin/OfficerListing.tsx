// named imports
import { NFT } from '@thirdweb-dev/react'
// default imports
import OfficerCard from './OfficerCard'

interface Props {
  policeOfficers: NFT[];
}

const OfficerListing = ({ policeOfficers }: Props) => {
  let policeDetails: any = []

  policeOfficers?.map(async (officer) => {
    const data = officer.metadata
    policeDetails.push(data)
  })

  return (
    <>
      <div className='py-3 mt-5 border border-slate-300 rounded-md shadow-lg text-gray-800 h-[600px]'>
        <div className='grid md:grid-cols-4 ml-3 gap-x-5 grid-cols-1 overflow-x-hidden overflow-y-scroll gap-y-5'>
          {policeDetails.map((officer: OfficerMetadata) => (
            <OfficerCard image={officer.image} officer={officer} key={officer.id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default OfficerListing;