// Generated by Wrangler by running `wrangler types --include-runtime=false` (hash: 2905fd8e181cd2f4083a615fa51f1913)
// After adding bindings to `wrangler.jsonc`, regenerate this interface via `npm run cf-typegen`
declare namespace Cloudflare {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface,@typescript-eslint/no-empty-object-type
	interface Env {
		DB: D1Database;
		API_KEY: string;
		JWT_SECRET: string;
	}
}
interface Env extends Cloudflare.Env {}
