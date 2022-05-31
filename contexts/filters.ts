import { createContext } from 'react'
import { GetNftsResponse } from '@alch/alchemy-web3'

export type FiltersType = {
  nfts: GetNftsResponse['ownedNfts'] | undefined
}

export const FiltersContext = createContext<FiltersType>({
  nfts: [],
})
