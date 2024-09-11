import * as Core from "@blaze-cardano/core"
import {TxBuilder, Value} from "@blaze-cardano/tx"
import { Maestro } from "@blaze-cardano/query"

declare global {
    namespace globalThis {
      var __env: Env;
      var __ctx: ExecutionContext;
    }
  }

export default {
    async fetch(req, env, ctx) {
        const url = new URL(req.url);
        const fromParam = url.searchParams.get('from');
        if (!fromParam) {
            return new Response('from parameter (address bech32) is missing', { status: 400 });
        }
        const toParam = url.searchParams.get('to');
        if (!toParam) {
            return new Response('to parameter (address bech32) is missing', { status: 400 });
        }
        const adaParam = url.searchParams.get('amount');
        if (!adaParam) {
            return new Response('amount parameter (lovelace) is missing', { status: 400 });
        }
        if (isNaN(Number(adaParam))) {
            return new Response('amount parameter must be a valid number', { status: 400 });
        }
        const adaAmount = BigInt(adaParam);
        const maestro = new Maestro({network: "mainnet", apiKey: env.MAESTRO_KEY})
        const address = Core.Address.fromBech32(fromParam);
          const utxos = await maestro.getUnspentOutputs(address)
          const tx = await new TxBuilder(Core.hardCodedProtocolParams)
            .addUnspentOutputs(utxos)
            .setNetworkId(Core.NetworkId.Mainnet)
            .setChangeAddress(address)
            .payAssets(Core.Address.fromBech32(toParam), Value.makeValue(adaAmount))
            .complete();
      
        return new Response(JSON.stringify({cbor: tx.toCbor()}))
    }
} satisfies ExportedHandler<Env>;

// https://blaze-cloudflare.stitch-wheat-0l8354.workers.dev/?from=addr1q8r7hpmzh9cck6t4u0sxwmf70as7jf393a9c4qc80h022pq6mg9srfedm2c3ca3p8l6d52gc9zg45lwthaq5dwphfrcqeug9mf&to=addr1qx52agrsxxgrdz5z775hp9wmudwgt07gk82nralytj32j5um3ht6rlv0a32zeuejtf2sth8dnamyetye75a6qgfuxtasp4rkqeamount=5000000