type MirrorTx = {
  transactions?: Array<{
    name?: string
    memo_base64?: string
    memo?: string
    valid_start_timestamp?: string
    consensus_timestamp?: string
    result?: string
    transaction_id?: string
  }>
}

async function tryFetch(url: string) {
  const res = await fetch(url, { cache: "no-store" }).catch(() => null)
  if (!res || !("ok" in res) || !res.ok) return null
  return (await res.json()) as any
}

export async function mirrorSearchTxByMemo(mirrorBaseUrl: string, memo: string) {
  // Try both memo and transactionmemo, Mirror Node varies by version
  const urls = [
    `${mirrorBaseUrl.replace(/\/$/, "")}/api/v1/transactions?memo=${encodeURIComponent(memo)}&limit=1&order=desc`,
    `${mirrorBaseUrl.replace(/\/$/, "")}/api/v1/transactions?transactionmemo=${encodeURIComponent(memo)}&limit=1&order=desc`,
  ]
  for (const url of urls) {
    const data = (await tryFetch(url)) as MirrorTx | null
    if (data?.transactions?.length) return data.transactions[0]
  }
  return null
}

export async function verifyPaymentCodeViaMirror(code: string) {
  const mirror = process.env.HEDERA_MIRROR_BASE_URL
  if (!mirror) return null

  const tx = await mirrorSearchTxByMemo(mirror, code)
  if (!tx) return { status: "invalid" as const }

  // Heuristics: if a tx with this memo exists, treat as valid; refine by business logic later.
  const status = tx.result === "SUCCESS" ? ("valid" as const) : ("invalid" as const)
  return {
    status,
    meta: {
      transaction_id: tx.transaction_id ?? "",
      memo: tx.memo ?? "",
      consensus_timestamp: tx.consensus_timestamp ?? "",
      valid_start_timestamp: tx.valid_start_timestamp ?? "",
      result: tx.result ?? "",
    },
  }
}

export type TokenizeInput = {
  title: string
  description?: string
  category?: string
  location?: string
  quantity?: number
  unit?: string
  unitPriceUSD?: number
  images?: string[]
}

export async function tokenizeAssetPlaceholder(_draft: TokenizeInput) {
  // Placeholder: wire to Hedera SDK createToken + HFS/Blob upload in a secured server action/route.
  return {
    tokenId: "0.0." + Math.floor(10000 + Math.random() * 90000),
    messageId: `0.0.${Math.floor(2000 + Math.random() * 9000)}@${Date.now()}`,
  }
}

export async function publishDecisionToHCS(message: unknown): Promise<{ messageId?: string }> {
  const topicId = process.env.HEDERA_TOPIC_ID
  const operatorId = process.env.HEDERA_OPERATOR_ID
  const operatorKey = process.env.HEDERA_OPERATOR_KEY
  const network = (process.env.HEDERA_NETWORK || "testnet").toLowerCase()

  if (!topicId || !operatorId || !operatorKey) {
    // Fallback: simulate a message id
    return { messageId: `sim-${Date.now()}` }
  }

  // Dynamically import SDK only when needed
  const sdk = await import("@hashgraph/sdk")
  const { Client, TopicMessageSubmitTransaction, PrivateKey, AccountId } = sdk

  const client =
    network === "mainnet"
      ? Client.forMainnet()
      : network === "previewnet"
        ? Client.forPreviewnet()
        : Client.forTestnet()

  client.setOperator(AccountId.fromString(operatorId), PrivateKey.fromString(operatorKey))

  const tx = await new TopicMessageSubmitTransaction()
    .setTopicId(topicId)
    .setMessage(Buffer.from(JSON.stringify(message), "utf-8"))
    .execute(client)

  const receipt = await tx.getReceipt(client)
  // Note: messageId in SDK is available on receipt.topicSequenceNumber + consensus timestamp via record; return tx id as reference.
  const txId = tx.transactionId.toString()
  return { messageId: `${topicId}:${receipt.topicSequenceNumber ?? ""}:${txId}` }
}
