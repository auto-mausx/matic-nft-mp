import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from 'web3modal';

import { nftaddress, nftmarketaddress } from "../config";

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded')
  
  // This is to load the NFTs on page startup
  useEffect(() => {
    loadNFTs();
  }, [])

  // This actually gets the NFTs from the contract to use on the front end
  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider();
    // This imports the NFT contract to interact with it on front end
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    // This import NFTMarketplace contract
    const marketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, provider);
    // This is actually using a function from the NFTMarket contract
    const data = await marketContract.fetchMarketItems();

    // This is gathering all the NFTMarkerplace NFT data to use on front end
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId);

      // This gets metadata from IPFS endpoint
      const meta = await axios.get(tokenUri) // This will be IPFS endpoint

      // this formats the token price to something human readable
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
      // This is to format the data to something we can use on the front end
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description
      }
      return item;
    }))
    // This sets state with the array of NFTs
    setNfts(items);
    // This updates state to inform the site the data has been loaded
    setLoadingState('loaded');
  }

  async function buyNFT(nft) {
    // Etherium injected into the web browser
    const web3Modal = new Web3Modal();
    // handles the connection
    const connection = await web3Modal.connect();
    // Create a provider using web3 provider
    const provider = new ethers.providers.Web3Provider(connection);

    // create a signer
    const signer = provider.getSigner();
    // get reference to contract with the users address from above step
    const contract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer);

    // Get reference to the price from loadNFTs function mapping
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');

    // Create the market sale using contract function createMarketSale
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
      value: price
    })
    // This allows app to wait until transaciton is completed
    await transaction.wait();
    // This step will reload NFTs now that one is sold
    loadNFTs();
  }


  // This is what determines what is displayed on the screen depending on if there are actually NFTs in the marketplace
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)

  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols2 lg:grid-cols-4 gap-4 pt-4">
          {console.log(nfts)}
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image}/>
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl mb-4 font-bold text-white">{nft.price} Matic</p>
                  <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNFT(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
