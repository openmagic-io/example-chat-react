import { useContext } from 'react'
import { FiltersContext, FiltersType } from '../contexts/filters'

const useFilters = (): FiltersType => {
  const context = useContext(FiltersContext)
  if (context === undefined) {
    throw new Error('useFilters must be used within a FiltersProvider')
  }
  return context
}

export default useFilters
