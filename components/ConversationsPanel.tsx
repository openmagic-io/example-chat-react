import { ChatIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import useXmtp from '../hooks/useXmtp'
import ConversationsList from './ConversationsList'
import Loader from './Loader'

const ConversationsPanel = (): JSX.Element => {
  const { conversations, loadingConversations, client } = useXmtp()
  const [verifiedConvos, setVerifiedConvos] = useState<any[][]>([])

  const [ LitLoading, setLitLoading ] = useState(false);

  const connectLit = async () => {
    const accessControlConditions = [
      {
        contractAddress: '0xbad6186e92002e312078b5a1dafd5ddf63d3f731', // the NFT contract addres, mice right now
        standardContractType: 'ERC721',
        chain: "ethereum",
        method: 'balanceOf',
        parameters: ["0x13c48d3372e458A73E885f274CDf97593327741D"], // a user's addres
        returnValueTest: {
          comparator: '>',
          value: '0'
        }
      }
    ]
  }

  if (!client) {
    return (
      <Loader
        headingText="Awaiting signatures..."
        subHeadingText="Use your wallet to sign"
        isLoading
      />
    )
  }

  if (loadingConversations || LitLoading) {
    return (
      <Loader
        headingText="Loading conversations..."
        subHeadingText="Please wait a moment"
        isLoading
      />
    )
  }



  return conversations && conversations.length > 0 ? (
    <nav className="flex-1 pb-4 space-y-1">
      <ConversationsList conversations={conversations} />
    </nav>
  ) : (
    <NoConversationsMessage />
  )
}

const NoConversationsMessage = (): JSX.Element => {
  return (
    <div className="flex flex-col flex-grow justify-center">
      <div className="flex flex-col items-center px-4 text-center">
        <ChatIcon
          className="h-8 w-8 mb-1 stroke-n-200 md:stroke-n-300"
          aria-hidden="true"
        />
        <p className="text-xl md:text-lg text-n-200 md:text-n-300 font-bold">
          Your message list is empty
        </p>
        <p className="text-lx md:text-md text-n-200 font-normal">
          There are no messages in this wallet
        </p>
      </div>
    </div>
  )
}

export default ConversationsPanel;
