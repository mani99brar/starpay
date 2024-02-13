import { createPublicClient, http } from 'viem'
import { astar } from 'viem/chains'
import { webSocket } from 'viem'
 
const publicClient = createPublicClient({ 
  chain: astar, 
  transport: webSocket("wss://astar.public.blastapi.io"), 
}) 

export default publicClient;