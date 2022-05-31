import XmtpProvider from './XmtpProvider'
import Layout from '../components/Layout'
import { WalletProvider } from './WalletProvider'
import { FiltersProvider } from './FiltersProvider'

type AppProps = {
  children?: React.ReactNode
}

function App({ children }: AppProps) {
  return (
    <WalletProvider>
      <XmtpProvider>
        <FiltersProvider>
          <Layout>{children}</Layout>
        </FiltersProvider>
      </XmtpProvider>
    </WalletProvider>
  )
}

export default App
