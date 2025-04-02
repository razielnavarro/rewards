export type Env = {
    Bindings: Cloudflare.Env
    Variables: Variables;
};

export type Variables =  {
    customerId?: string;
};