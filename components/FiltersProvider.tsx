import { useEffect, useState } from 'react'
import { FiltersContext } from '../contexts/filters'
import useWallet from '../hooks/useWallet'
import { createAlchemyWeb3, GetNftsResponse } from '@alch/alchemy-web3'

export const FiltersProvider: React.FC = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [nfts, setNfts] = useState<GetNftsResponse['ownedNfts']>()
  const web3 = createAlchemyWeb3(
    'https://eth-mainnet.alchemyapi.io/v2/itHQx4v0Wasz1dQUmFGkud9XUgAcKVgs'
  )

  const { address } = useWallet()

  useEffect(() => {
    if (address == undefined) return

    const getNfts = async () => {
      const resp = await web3.alchemy.getNfts({ owner: address })
      if (resp) {
        const nftsFilter = resp.ownedNfts.map((option) => {
          const enabledProp = {
            enabled: true,
          }
          return Object.assign(option, enabledProp)
        })
        setNfts(nftsFilter)
      }
    }

    getNfts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])

  return (
    <FiltersContext.Provider
      value={{
        nfts,
      }}
    >
      {children}
    </FiltersContext.Provider>
  )
}

export default FiltersProvider
