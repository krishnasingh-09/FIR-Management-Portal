// named imports
import { useAddress, useContract, useMintNFT, useNFT, useOwnedNFTs, useSDK } from '@thirdweb-dev/react'
import { useForm } from 'react-hook-form'
import { DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// default imports
import toast from 'react-hot-toast'

interface Props {
  fir: FIR
  selectedStatus: string
}

type FormValues = {
  description: string
  remark: string
  documents: FileList
  status: string
}

const FIR_THUMBNAIL = 'https://e-gmat.com/blogs/wp-content/uploads/2021/04/f1-visa-documents.jpg'

const UpdateFIRForm = ({ fir, selectedStatus }: Props) => {
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()

  const address = useAddress()
  const tokenId = fir.id

  const sdk = useSDK()

  const { contract: FIRCollection } = useContract(process.env.NEXT_PUBLIC_FIR_CONTRACT)

  const { data: nft, isLoading: isNFTLoading } = useNFT(
    FIRCollection,
    tokenId?.toString()
  )

  const handleMailing = async (data: any, status: string, fir: FIR) => {
    try {
      const res = await fetch('/api/mailing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          email: fir.properties.email,
          firId: fir.properties.firId,
          status: status
        })
      })
      if (res.status === 200) {
        router.refresh()
        toast.success('Status Updated Successfully')
      }
    } catch (err) {
      alert('Something went wrong, please try again later')
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.status === 'Pending') {
        toast.loading('Changing FIR status to pending')

        const pendingFirMetadata = {
          name: `Filing for ${fir.properties.name}`,
          description: 'FILING FIR',
          image: FIR_THUMBNAIL,
          properties: {
            // @ts-ignore
            ...nft?.metadata?.properties,
            status: data.status,
            description: {
              //@ts-ignore
              new: nft?.metadata?.properties?.description,
              pending: data.description,
            },
            remark: {
              //@ts-ignore
              new: nft?.metadata?.properties?.remark,
              pending: data.remark,
            },
            documents: {
              //@ts-ignore
              new: nft?.metadata?.properties?.documents,
              pending: data.documents,
            }
          }
        }

        const newPendingURI = await sdk!.storage.upload(pendingFirMetadata)

        const updateNFT = await FIRCollection!.call("setTokenURI", [
          tokenId,
          newPendingURI,
        ])

        toast.success('FIR status changed to pending')
        handleMailing(data, 'Pending', fir)
        toast.dismiss()
      } else if (data.status === 'Resolved') {
        toast.loading('Changing FIR status to resolved')

        const resolvedFirMetadata = {
          name: `Filing for ${fir.properties.name}`,
          description: 'FILING FIR',
          image: FIR_THUMBNAIL,
          properties: {
            // @ts-ignore
            ...nft?.metadata?.properties,
            status: data.status,
            description: {
              //@ts-ignore
              new: nft?.metadata?.properties?.description.new,
              // @ts-ignore
              pending: nft?.metadata?.properties?.description.pending,
              resolved: data.description,
            },
            remark: {
              //@ts-ignore
              new: nft?.metadata?.properties?.remark.new,
              // @ts-ignore
              pending: nft?.metadata?.properties?.remark.pending,
              resolved: data.remark,
            },
            documents: {
              //@ts-ignore
              new: nft?.metadata?.properties?.documents.new,
              // @ts-ignore
              pending: nft?.metadata?.properties?.documents.pending,
              resolved: data.documents,
            }
          }
        }

        const newResolvedURI = await sdk!.storage.upload(resolvedFirMetadata)
        const updateNFT = await FIRCollection!.call("setTokenURI", [
          tokenId,
          newResolvedURI,
        ])

        toast.success('FIR status changed to resolved')
        handleMailing(data, 'Resolved', fir)
        toast.dismiss()
      }
    } catch (error) {
      toast.dismiss()
      console.log(error)
      toast.error('Error changing FIR status')
    }

    // try {
    //   if (data.status === 'Pending') {
    //     // if (alreadyExistsInPending) {
    //     //   toast.error('FIR already exists in pending')
    //     //   return
    //     // }
    //     toast.loading('Changing FIR status to pending')
    //     await mintPendingNft({
    //       to: address || '',
    //       metadata: firMetadata,
    //     })
    //     handleMailing(data, 'Pending', fir)
    //     toast.dismiss()
    //     toast.success('FIR status changed to pending')
    //   } else {
    //     if (alreadyExistsInResolved) {
    //       toast.error('FIR is already resolved')
    //       return
    //     }
    //     toast.loading('Changing FIR status to resolved')
    //     await mintResolvedNft({
    //       to: address || '',
    //       metadata: firMetadata,
    //     })
    //     handleMailing(data, 'Resolved', fir)
    //     toast.dismiss()
    //     toast.success('FIR status changed to resolved')
    //   }
    // } catch (isError) {
    //   toast.dismiss()
    //   toast.error('Error changing FIR status')
    // }

  })

  return (
    <form onSubmit={onSubmit}>
      <div className='grid gap-4 py-4 text-sm'>
        <div className='grid grid-cols-4 items-center gap-4'>
          <label htmlFor='remark'>
            Remark
          </label>
          <input
            {...register('remark', { required: true })}
            id='remark'
            className='form-input'
          />
        </div>
        {errors.remark && <p className='text-red-500 -my-3'>Remark is required</p>}
        <div className='grid grid-cols-4 items-center gap-4'>
          <label htmlFor='documents'>
            Documents
          </label>
          <input
            {...register('documents', { required: true })}
            id='documents'
            type='file'
            className='form-input'
          />
          {errors.documents && <p className='text-red-500 -my-3'>Documents are required</p>}
        </div>
        <div className='grid grid-cols-4 items-center gap-4'>
          <label htmlFor=''>Update Status:</label>
          <select
            className='form-input'
            {...register('status', { required: true })}
          >
            {selectedStatus === 'New' && <option value='Pending'>Pending</option>}
            <option value='Resolved'>Resolved</option>
          </select>
          {errors.status && <p className='text-red-500 -my-3'>Status is required</p>}
        </div>
        <div className='grid grid-cols-4 items-center gap-4'>
          <label htmlFor='description'>
            Description
          </label>
          <textarea
            {...register('description', { required: true })}
            rows={3}
            id='description'
            className='form-input'
          ></textarea>
          {errors.description && <p className='text-red-500 -my-3'>Description is required</p>}
        </div>
      </div>
      <DialogFooter>
        <Button type='submit'>Update FIR</Button>
      </DialogFooter>
    </form>
  )
}

export default UpdateFIRForm