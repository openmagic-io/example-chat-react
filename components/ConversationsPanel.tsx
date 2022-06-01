import { ChatIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import useXmtp from '../hooks/useXmtp'
import ConversationsList from './ConversationsList'
import Loader from './Loader'
import LitJsSdk from 'lit-js-sdk'

import { useEffect } from 'react'

const ConversationsPanel = (): JSX.Element => {
  const { conversations, loadingConversations, client } = useXmtp()
  const [verified, setVerified] = useState<any>({})
  const [ LitLoading, setLitLoading ] = useState(false);

  useEffect(() => {
    if (conversations.length) { verifyWithLit() }
  }, [conversations])

  const verifyWithLit = async () => {
    console.log("connecting to LIT protocol!");
    setLitLoading(true);
    const LITClient = new LitJsSdk.LitNodeClient({ alertWhenUnauthorized: false })
    await LITClient.connect()
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" })

    const verifyConvo  = async (address: string) => {
      console.log("verifying address", address);
      const chain = "ethereum";
      const accessControlConditions = [
        {
          contractAddress: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85', // the NFT contract addres, ENS right now
          standardContractType: 'ERC721',
          chain,
          method: 'balanceOf',
          parameters: ["0x13c48d3372e458A73E885f274CDf97593327741D"], // a user's addres
          returnValueTest: {
            comparator: '>',
            value: '0'
          }
        }
      ]
   
      const resourceId = {
        baseUrl: "http://localhost:3000",
        path: '/' + Math.random(), // this would normally be your url path, like "/webpage.html" for example
        orgId: "",
        role: "",
        extraData: ""
      }
  
      try {
        await LITClient.saveSigningCondition({ accessControlConditions, chain, authSig, resourceId })
      } catch (err) {
        console.log('error: ', err)
      }

      try {
        const jwt = await LITClient.getSignedToken({ accessControlConditions, chain, authSig, resourceId })
        const { verified } = LitJsSdk.verifyJwt({ jwt })
        return [ address, verified ]
      }
      catch (err) {
        return [ address, false ]
      }
    }

    const verifiedStatusArr = await Promise.all(conversations.map(conversation => verifyConvo(conversation.peerAddress)))
    const verifiedStatus: { [address: string]: boolean } = {}
    for (const [userAddress, addressVerified]  of verifiedStatusArr) {
      verifiedStatus[userAddress] = addressVerified
    }
    setVerified(verifiedStatus)
    setLitLoading(false)

    console.log("verified status", verifiedStatus)
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

  // need to filter! 
  let filteredConvos = conversations.filter(
    convo => !verified[convo.peerAddress]
  )

  return filteredConvos && filteredConvos.length > 0 ? (
    <nav className="flex-1 pb-4 space-y-1">
      <ConversationsList conversations={filteredConvos} />
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
