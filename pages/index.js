import { useEffect, useState, useCallback } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import cn from 'classnames'
import { ethers } from 'ethers'
import myEpicNft from '../utils/MyEpicNFT.json'

// Constants
const OPENSEA_LINK = 'https://testnets.opensea.io'
const OPENSEA_ASSETS_LINK = `${OPENSEA_LINK}/assets`
const OPENSEA_COLLECTION_LINK = `${OPENSEA_LINK}/collection/buildspacename-v3`
const CONTRACT_ADDRESS = '0xdD008C6f21088b53Ae5412C9C35492F96fAE301b'

const shortContractAddress = [
  CONTRACT_ADDRESS.substring(0, 3),
  '...',
  CONTRACT_ADDRESS.substring(
    CONTRACT_ADDRESS.length - 3,
    CONTRACT_ADDRESS.length
  ),
].join('')

const buttonClassNames =
  'button px-6 py-2 text-white w-auto rounded cursor-pointer font-semibold text-base border-2 outline-none'

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState(null)
  const [isMining, setIsMining] = useState(false)
  const [mintedTokenId, setMintedTokenId] = useState(null)

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window

    if (!ethereum) {
      console.error('Make sure you have metamask!')
      return
    } else {
      console.debug('We have the ethereum object', ethereum)
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (accounts.length !== 0) {
      const account = accounts[0]
      console.debug('Found an authorized account:', account)

      setupEventListener()
      setCurrentAccount(account)
    } else {
      console.error('No authorized account found')
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        alert('Get MetaMask!')
        return
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.debug('Connected', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.error(error)
    }
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        )

        connectedContract.on('NewEpicNFTMinted', (from, tokenId) => {
          console.debug(from, tokenId.toNumber())
          setMintedTokenId(tokenId.toNumber())
        })
      } else {
        console.error("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.debug(error)
    }
  }

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        )

        let nftTxn = await connectedContract.makeAnEpicNFT()

        setIsMining(true)
        setMintedTokenId(null)

        await nftTxn.wait()

        setIsMining(false)

        console.debug(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        )
      } else {
        console.debug("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.debug(error)
      setIsMining(false)
    }
  }

  const renderWalletButton = () => (
    <button
      className={cn(buttonClassNames, 'border-transparent button-gradient')}
      onClick={connectWallet}
    >
      ????&nbsp;&nbsp;Connect Wallet
    </button>
  )

  const renderMintButton = useCallback(() => {
    let buttonText = 'Mining...'

    if (!isMining) {
      buttonText = mintedTokenId ? 'Mint another NFT' : 'Mint NFT'
    }

    return (
      <button
        className={cn(buttonClassNames, 'border-transparent button-gradient')}
        onClick={askContractToMintNft}
        disabled={isMining}
      >
        ????&nbsp;&nbsp;
        {buttonText}
      </button>
    )
  }, [isMining, mintedTokenId])

  useEffect(() => {
    checkIfWalletIsConnected()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="main h-screen bg-gray-900 text-center overflow-hidden">
        <div className="h-full flex flex-col justify-between">
          <header>
            <h1 className="text-4xl font-bold gradient-text mb-3">
              NFT name for your next project
            </h1>
            <h2 className="text-lg text-gray-50 font-semibold mb-12">
              Each unique. Each beautiful. Mint your next project name NFT
              today.
            </h2>

            {currentAccount && mintedTokenId && (
              <div className="text-gray-400 max-w-2xl mx-auto box p-4 overflow-hidden leading-7 mb-8">
                ???? We&apos;ve minted your awesome project name NFT and sent it
                to your wallet. It can take a max of 10 min to show up on
                OpenSea. Here&apos;s the link:{' '}
                <a
                  href={`${OPENSEA_ASSETS_LINK}/${CONTRACT_ADDRESS}/${mintedTokenId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white underline font-semibold"
                >
                  {`${OPENSEA_ASSETS_LINK}/${shortContractAddress}/${mintedTokenId}`}
                </a>
              </div>
            )}

            <div className="flex justify-center">
              {currentAccount ? renderMintButton() : renderWalletButton()}
              <a
                href={OPENSEA_COLLECTION_LINK}
                target="_blank"
                rel="noreferrer"
                className={`${buttonClassNames} ml-4`}
              >
                View Collection
              </a>
            </div>
          </header>

          <footer className="flex justify-center align-middle mb-4">
            <Image
              src="/twitter-logo.svg"
              alt="Twitter Logo"
              width={26}
              height={26}
            />
            <span className="mx-1 text-gray-400">Built by</span>
            <a
              className="text-gray-200 underline font-semibold"
              href="https://twitter.com/tair"
              target="_blank"
              rel="noreferrer"
            >
              @tair
            </a>
            <span className="mx-1 text-gray-400">on</span>
            <a
              className="text-gray-200 underline font-semibold"
              href="https://twitter.com/_buildspace"
              target="_blank"
              rel="noreferrer"
            >
              @_buildspace
            </a>
          </footer>
        </div>
      </div>
    </>
  )
}
