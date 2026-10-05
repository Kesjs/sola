const DEVNET_RPC = 'https://api.devnet.solana.com'

type RpcResponse<T> = { result?: T; error?: { message?: string } }

async function rpc<T>(method: string, params: unknown[]) {
  const response = await fetch(DEVNET_RPC, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method, params }) })
  if (!response.ok) throw new Error('RPC_UNAVAILABLE')
  const payload = await response.json() as RpcResponse<T>
  if (payload.error || payload.result === undefined) throw new Error(payload.error?.message ?? 'RPC_UNAVAILABLE')
  return payload.result
}

export async function getDevnetBalance(address: string) {
  const result = await rpc<{ value: number }>('getBalance', [address, { commitment: 'confirmed' }])
  return { sol: result.value / 1_000_000_000, synchronizedAt: new Date().toISOString() }
}
