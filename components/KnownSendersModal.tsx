import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Toggle from './Toggle'
import useFilters from '../hooks/useFilters'

type KnownSendersModalProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type nftContractsType = {
  [contract: string]: string
}

export default function KnownSendersModal({
  open,
  setOpen,
}: KnownSendersModalProps) {
  const { nfts } = useFilters()
  const [activeNfts, setActiveNfts] = useState<Array<boolean>>([])
  const [groupedNfts, setGroupedNfts] = useState<
    { name: string; contract: string }[]
  >([])

  // group NFTs by contract
  useEffect(() => {
    const nftContracts: nftContractsType = {}
    nfts?.forEach((nft) => {
      if (!(nft.contract.address in nftContracts)) {
        nftContracts[nft.contract.address] = nft.title
      } else {
        const curTitle = nftContracts[nft.contract.address]
        nftContracts[nft.contract.address] = curTitle + ', ' + nft.title
      }
    })

    const tempGroupedNfts: { name: string; contract: string }[] = []
    Object.keys(nftContracts).forEach((contract) => {
      const groupedNft = {
        contract,
        name: nftContracts[contract],
      }
      tempGroupedNfts.push(groupedNft)
    })
    setGroupedNfts(tempGroupedNfts)
    setActiveNfts(new Array(tempGroupedNfts?.length).fill(true))
  }, [nfts])

  const toggleEnabledAtIdx = (idx: number) => {
    const tempNfts = JSON.parse(JSON.stringify(activeNfts))
    tempNfts[idx] = !tempNfts[idx]
    setActiveNfts(tempNfts)
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:max-w-sm sm:w-full sm:p-6">
                <div>
                  <div className="text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-medium leading-6 text-gray-900"
                    >
                      Set Known Senders
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Only receive messages from wallets that own these tokens
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-4 my-4 overflow-y-scroll max-h-96">
                  {groupedNfts?.map((nft, idx) => (
                    <Toggle
                      key={nft.name}
                      label={nft.name}
                      subtext={nft.contract}
                      enabled={activeNfts[idx]}
                      toggleEnabled={() => toggleEnabledAtIdx(idx)}
                    />
                  ))}
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Done
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
