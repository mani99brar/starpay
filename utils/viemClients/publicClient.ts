import { createPublicClient, http } from 'viem'
import { astar } from 'viem/chains'
 
const publicClient = createPublicClient({ 
  chain: astar, 
  transport: http("https://astar.public.blastapi.io"), 
}) 

export default publicClient;