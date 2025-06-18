> ℹ️ This project uses [bun](https://bun.sh)

## Local development
> ⚠️ Before starting create `.dev.vars` file with `HF_API_KEY="<key>"` api key.

- Run `bun run dev` in your terminal to start a development server
- Open a browser tab at http://localhost:8787/ to see this worker in action
- Run `bun run deploy` to publish the worker


Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
`Env` object can be regenerated with `bun run cf-typegen`.


Learn more at https://developers.cloudflare.com/workers/
