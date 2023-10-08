
export interface Get<
    PathParams = { [key: string]: unknown },
    QueryParams = { [key: string]: unknown },
    Output = { [key: string]: unknown }
> {
    parameters: {
        path?: PathParams;
        query: QueryParams;
    };
    responses: {
        200: Output;
    };
}

export interface Post<
    PathParams = { [key: string]: unknown },
    RequestBody = { [key: string]: unknown },
    QueryParams = { [key: string]: unknown },
    Output = { [key: string]: unknown }
> {
    parameters: {
        path?: PathParams;
        body: RequestBody;
        query?: QueryParams;
    };
    responses: {
        200: Output;
    };
}

export interface Put<
    PathParams = { [key: string]: unknown },
    RequestBody = { [key: string]: unknown },
    QueryParams = { [key: string]: unknown },
    Output = { [key: string]: unknown }
> {
    parameters: {
        path?: PathParams;
        body: RequestBody;
        query?: QueryParams;
    };
    responses: {
        200: Output;
    };
}

export interface Delete<
    PathParams = { [key: string]: unknown },
    QueryParams = { [key: string]: unknown },
    Output = { [key: string]: unknown }
> {
    parameters: {
        path?: PathParams;
        query: QueryParams;
    };
    responses: {
        200: Output;
    };
}

export interface Patch<
    PathParams = { [key: string]: unknown },
    RequestBody = { [key: string]: unknown },
    QueryParams = { [key: string]: unknown },
    Output = { [key: string]: unknown }
> {
    parameters: {
        path?: PathParams;
        body: RequestBody;
        query?: QueryParams;
    };
    responses: {
        200: Output;
    };
}

export type RecursiveJSONSchema = {
    description?: string
    type: string
    const?: string
    format?: string
    properties?: {
        [key: string]: RecursiveJSONSchema
    }
    items?: RecursiveJSONSchema
    required?: string[]
}
export interface APIPaths {
  'app/orgs': {
    GET: {
      parameters: {
        path?: never,
        query: { id: any; },
      },
      responses: {
        200: null | {
  id: string;
  name: string;
  owner_id: string;
  callback_urls: string[];
  created_at: Date;
  updated_at: Date;
  modified_by_user_id: null | string;
  branding_id: null | number;
},
      }
      errors: {
        400: {
          message: 'Missing id',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
    POST: {
      parameters: {
        path?: never,
        body: {
  id?: string;
  name: string;
  callback_urls?: string[] | {
    
  };
  created_at?: string | Date;
  updated_at?: string | Date;
  modified_by_user_id?: null | string;
  members?: {
    
  };
  applications?: {
    
  };
  subscription?: {
    
  };
  branding?: {
    
  };
},
        query?: never,
      },
      responses: {
        200: {
  id: string;
  name: string;
  owner_id: string;
  callback_urls: string[];
  created_at: Date;
  updated_at: Date;
  modified_by_user_id: null | string;
  branding_id: null | number;
},
      }
      errors: {
        400: {
          message: 'Missing user id',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
    DELETE: {
      parameters: {
        path?: never,
        query: { id: any; },
      },
      responses: {
        200: {
          id: string,
        },
      }
      errors: {
        400: {
          message: 'Missing id',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
    PATCH: {
      parameters: {
        path?: never,
        body: {
  id?: string | {
    
  };
  name?: string | {
    
  };
  callback_urls?: string[] | {
    push?: string | string[];
  };
  created_at?: string | Date | {
    
  };
  updated_at?: string | Date | {
    
  };
  modified_by_user_id?: null | string | {
    
  };
  owner?: {
    
  };
  members?: {
    
  };
  applications?: {
    
  };
  subscription?: {
    
  };
  branding?: {
    
  };
},
        query: { id: any; },
      },
      responses: {
        200: {
          id: string,
        },
      }
      errors: {
        400: {
          message: 'Missing id',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
  },
  'api/auth/auth_requests': {
    GET: {
      parameters: {
        path?: never,
        query: { id?: string | undefined; state?: string | undefined; },
      },
      responses: {
        200: {
  id: number;
  uuid: string;
  state: string;
  nonce: string;
  uri: string;
  signature: null | string;
  provider_access_token: null | string;
  provider_refresh_token: null | string;
  provider_account_id: string;
  access_token: null | string;
  refresh_token: null | string;
  access_token_expires_in: null | number;
  user_id: null | string;
  created_at: Date;
  updated_at: Date;
  application_id: string;
  ip_address: null | string;
  provider: 'ip_address' | 'discord' | 'twitter' | 'github' | 'solana';
},
      }
      errors: {
        400: {
          message: 'Missing query params',
        },
        404: {
          message: 'Auth request not found',
        },
      }
    },
  },
  'api/auth/authorize': {
    GET: {
      parameters: {
        path?: never,
        query?: never,
      },
      responses: {
      }
    },
  },
  'api/auth/session': {
    GET: {
      parameters: {
        path?: never,
        query: { session_id?: string | null; session?: string | null; signature?: string | null; proof?: string | null; },
      },
      responses: {
        200: string,
      }
      errors: {
        400: {
          message: 'Missing session id',
        },
        401: {
          message: 'No access token',
        } | {
          message: 'Session expired',
        },
        404: {
          message: 'Session not found',
        } | {
          message: 'Auth request not found',
        } | {
          message: 'User not found',
        } | {
          message: 'Session not found',
        },
      }
    },
  },
  'api/login/discord': {
    GET: {
      parameters: {
        path?: never,
        query?: never,
      },
      responses: {
        200: string,
      }
      errors: {
        400: {
          message: "Missing app_id",
        },
      }
    },
  },
  'api/login/solana': {
    GET: {
      parameters: {
        path?: never,
        query?: never,
      },
      responses: {
        200: string,
      }
    },
  },
  'api/nfts/:public_key': {
    GET: {
      parameters: {
        path: { public_key: string;  },
        query: { after?: string | undefined; before?: string | undefined; limit?: string | null; page?: string | undefined; sortBy?: { sortBy: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/types/enums").AssetSortBy; sortDirection: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/types/enums").AssetSortDirection; } | undefined; },
      },
      responses: {
        200: {
  grand_total?: false | true;
  total: number;
  limit: number;
  page: number;
  items: Array<
    {
      interface: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").Interface.V1NFT | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").Interface.CUSTOM | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").Interface.V1PRINT | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").Interface.LEGACYNFT | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").Interface.V2NFT | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").Interface.FUNGIBLE_ASSET | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").Interface.IDENTITY | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").Interface.EXECUTABLE | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").Interface.PROGRAMMABLENFT;
      id: string;
      content?: {
        $schema: string;
        json_uri: string;
        files?: Array<
          {
            uri?: string;
            mime?: string;
            cdn_uri?: string;
            quality?: {
              schema: string;
            };
            contexts?: Array<
              import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").Context.WalletDefault | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").Context.WebDesktop | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").Context.WebMobile | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").Context.AppMobile | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").Context.AppDesktop | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").Context.App | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").Context.Vr
            >;
          }
        >;
        metadata: {
          attributes?: Array<
            {
              value: string;
              trait_type: string;
            }
          >;
          description: string;
          name: string;
          symbol: string;
        };
        links?: {
          external_url?: string;
          image?: string;
          animation_url?: string;
        };
      };
      authorities?: Array<
        {
          address: string;
          scopes: Array<
            import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").Scope.FULL | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").Scope.ROYALTY | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").Scope.METADATA | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").Scope.EXTENSION
          >;
        }
      >;
      compression?: {
        eligible: boolean;
        compressed: boolean;
        data_hash: string;
        creator_hash: string;
        asset_hash: string;
        tree: string;
        seq: number;
        leaf_id: number;
      };
      grouping?: Array<
        {
          group_key: string;
          group_value: string;
          verified?: false | true;
          collection_metadata?: {
            name?: string;
            symbol?: string;
            image?: string;
            description?: string;
            external_url?: string;
          };
        }
      >;
      royalty?: {
        royalty_model: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").RoyaltyModel.CREATORS | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").RoyaltyModel.FANOUT | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").RoyaltyModel.SINGLE;
        target?: string;
        percent: number;
        basis_points: number;
        primary_sale_happened: boolean;
      };
      ownership: {
        frozen: boolean;
        delegated: boolean;
        delegate?: string;
        ownership_model: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").OwnershipModel.SINGLE | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").OwnershipModel.TOKEN;
        owner: string;
      };
      creators?: Array<
        {
          address: string;
          share: number;
          verified: boolean;
        }
      >;
      uses?: {
        use_method: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").UseMethods.BURN | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").UseMethods.SINGLE | import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/index").UseMethods.MULTIPLE;
        remaining: number;
        total: number;
      };
      supply?: {
        print_max_supply: number;
        print_current_supply: number;
        edition_nonce?: number;
      };
      mutable: boolean;
      burnt: boolean;
    }
  >;
},
      }
      errors: {
        401: {
          message: 'Unauthorized',
        },
      }
    },
  },
  'api/sessions/:session_id': {
    GET: {
      parameters: {
        path: { session_id: string;  },
        query?: never,
      },
      responses: {
        200: {
  id: string;
  created_at: Date;
  active_expires: bigint;
  idle_expires: bigint;
  auth_request_id: null | number;
  application_id: string;
  user_id: string;
  provider_id: string;
  access_token: string;
  refresh_token: string;
  access_token_expires_in: number;
  impersonating_user_id: null | string;
},
      }
      errors: {
        404: {
          message: 'Session not found',
        },
      }
    },
    DELETE: {
      parameters: {
        path: { session_id: string;  },
        query?: never,
      },
      responses: {
        200: {
          id: string,
        },
      }
      errors: {
        401: {
          message: 'Unauthorized',
        },
      }
    },
  },
  'api/user/:user_id': {
    GET: {
      parameters: {
        path: { user_id: string;  },
        query: { by: "account_id" | "userId"; },
      },
      responses: {
        200: null | { 
key: Array<
  {
    id: string;
    hashed_password: null | string;
    user_id: string;
    provider: null | 'ip_address' | 'discord' | 'twitter' | 'github' | 'solana';
    account_id: null | string;
    additional_data: {[key: string]: any};
  }
>;
id: string;
name: null | string;
username: null | string;
avatar_url: null | string;
email: null | string;
created_at: Date;
updated_at: Date;
 },
      }
      errors: {
        401: {
          message: 'Unauthorized',
        },
      }
    },
    PATCH: {
      parameters: {
        path: { user_id: string;  },
        body: {
  id?: string;
  name?: null | string;
  username?: null | string;
  avatar_url?: null | string;
  email?: null | string;
  created_at?: Date;
  updated_at?: Date;
},
        query?: never,
      },
      responses: {
        200: {
  id: string;
  name: null | string;
  username: null | string;
  avatar_url: null | string;
  email: null | string;
  created_at: Date;
  updated_at: Date;
},
      }
      errors: {
        401: {
          message: 'Unauthorized',
        },
      }
    },
  },
  'api/auth/callback/:provider': {
    GET: {
      parameters: {
        path: { provider: string;  },
        query: { state?: string | null; },
      },
      responses: {
        302: null,
      }
      errors: {
        400: {
          message: 'Invalid provider',
        } | {
          message: 'Missing state',
        },
        401: {
          message: 'No User Id',
        } | {
          message: 'You have been denied access to this application, Contact the application owner if you believe this is an error.',
        },
        404: {
          message: 'Session not found',
        },
      }
    },
  },
  'api/siws/message/verify': {
    POST: {
      parameters: {
        path?: never,
        body: {
  input: {
    domain?: string;
    address?: string;
    statement?: string;
    uri?: string;
    version?: string;
    chainId?: string;
    nonce?: string;
    issuedAt?: string;
    expirationTime?: string;
    notBefore?: string;
    requestId?: string;
    resources?: string[];
  };
  output: {
    signedMessage: string;
    signature: string;
    account: {
      publicKey: string;
      address: string;
      chains: string[];
      features: string[];
      label?: string;
      icon?: string;
    };
    signatureType: 'ed25519' | 'legacy';
  };
},
        query: { state?: string | null; },
      },
      responses: {
        200: null | { 
user: { 
userId: string;
id: string;
avatar_url: null | string;
public_keys?: string[];
impersonated_by_id?: string;
 };
sessionId: string;
activePeriodExpiresAt: Date;
idlePeriodExpiresAt: Date;
state: 'idle' | 'active';
fresh: boolean;
public_key: string;
 },
      }
      errors: {
        400: {
          message: 'Missing state',
        },
        404: {
          message: 'Application not found, Or Solana OAuth not enabled for this application',
        },
        500: {
          message: 'User not found nor created',
        },
      }
    },
  },
  'app/orgs/:org_id/apps': {
    GET: {
      parameters: {
        path: { org_id: string;  },
        query: { id: any; org_id: any; },
      },
      responses: {
        200: null | {
  id: string;
  name: string;
  description: null | string;
  organization_id: string;
  access_token_secret: string;
  refresh_token_secret: string;
  access_token_expiry: number;
  refresh_token_expiry: number;
  updated_at: Date;
  modified_by_user_id: null | string;
  created_at: Date;
  branding_id: null | number;
},
      }
      errors: {
        400: {
          message: 'Missing id',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
    POST: {
      parameters: {
        path: { org_id: string;  },
        body: {
  name: Prisma.applicationCreateInput;
},
        query?: never,
      },
      responses: {
        200: { 
app_role: Array<
  {
    id: number;
    name: string;
    role: 'OWNER' | 'ADMIN' | 'DEVELOPER' | 'MEMBER' | 'MODERATOR';
    application_id: string;
    created_at: Date;
    updated_at: Date;
    modified_by_user_id: null | string;
  }
>;
id: string;
name: string;
description: null | string;
organization_id: string;
access_token_secret: string;
refresh_token_secret: string;
access_token_expiry: number;
refresh_token_expiry: number;
updated_at: Date;
modified_by_user_id: null | string;
created_at: Date;
branding_id: null | number;
 },
      }
      errors: {
        401: {
          message: 'Unauthorized',
        },
      }
    },
    DELETE: {
      parameters: {
        path: { org_id: string;  },
        query: { id: any; org_id: any; },
      },
      responses: {
        200: {
          id: string,
        },
      }
      errors: {
        400: {
          message: 'Missing id',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
    PATCH: {
      parameters: {
        path: { org_id: string;  },
        body: Prisma.applicationUpdateInput,
        query: { id: any; org_id: any; },
      },
      responses: {
        200: {
          id: string,
        },
      }
      errors: {
        400: {
          message: 'Missing id',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
  },
  'app/orgs/:org_id/branding': {
    GET: {
      parameters: {
        path: { org_id: string;  },
        query: { id: any; },
      },
      responses: {
        200: null | {
  id: number;
  created_at: Date;
  logo: null | string;
  primary_color: null | string;
  secondary_color: null | string;
  font: null | string;
  updated_at: Date;
  modified_by_user_id: null | string;
},
      }
      errors: {
        400: {
          message: 'Missing id',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
    PUT: {
      parameters: {
        path: { org_id: string;  },
        body: {
  url: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  modified_by_user_id?: null | string;
},
        query: { app_id: any; },
      },
      responses: {
        200: {
  id: number;
  created_at: Date;
  logo: null | string;
  primary_color: null | string;
  secondary_color: null | string;
  font: null | string;
  updated_at: Date;
  modified_by_user_id: null | string;
},
      }
      errors: {
        401: {
          message: 'Unauthorized',
        },
      }
    },
    DELETE: {
      parameters: {
        path: { org_id: string;  },
        query: { id: any; app_id: any; },
      },
      responses: {
        200: {
          id: number,
        },
      }
      errors: {
        400: {
          message: 'Missing id',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
    PATCH: {
      parameters: {
        path: { org_id: string;  },
        body?: never,
        query: { id: any; app_id: any; },
      },
      responses: {
        200: {
          id: number,
        },
      }
      errors: {
        400: {
          message: 'Missing id',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
  },
  'api/user/:user_id/roles/:role_id': {
    GET: {
      parameters: {
        path: { user_id: string; role_id: string;  },
        query?: never,
      },
      responses: {
        200: null | {
  id: number;
  app_role_id: number;
  member_id: string;
  created_at: Date;
  updated_at: Date;
  modified_by_user_id: null | string;
},
      }
      errors: {
        401: {
          message: 'Unauthorized',
        },
      }
    },
  },
  'api/siws/message/:app_id/:public_key/generate': {
    GET: {
      parameters: {
        path: { app_id: string; public_key: string;  },
        query?: never,
      },
      responses: {
        200: {
          siws: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/@solana/wallet-standard-util/lib/types/signIn").SolanaSignInInputWithRequiredFields,
          legacy: string,
        },
      }
    },
  },
  'app/orgs/:org_id/apps/:app_id/access_control': {
    GET: {
      parameters: {
        path: { org_id: string; app_id: string;  },
        query?: never,
      },
      responses: {
        200: Array<
  {
    id: number;
    created_at: Date;
    application_id: string;
    provider: 'ip_address' | 'discord' | 'twitter' | 'github' | 'solana';
    account_id: string;
    access_type: 'WHITELIST' | 'BLACKLIST';
    modified_by_user_id: null | string;
  }
>,
      }
      errors: {
        401: {
          message: 'Unauthorized',
        },
      }
    },
    PUT: {
      parameters: {
        path: { org_id: string; app_id: string;  },
        body: {
  created_at?: string | Date;
  provider: 'ip_address' | 'discord' | 'twitter' | 'github' | 'solana';
  account_id: string;
  access_type: 'WHITELIST' | 'BLACKLIST';
  modified_by_user_id?: null | string;
},
        query?: never,
      },
      responses: {
        200: {
  id: number;
  created_at: Date;
  application_id: string;
  provider: 'ip_address' | 'discord' | 'twitter' | 'github' | 'solana';
  account_id: string;
  access_type: 'WHITELIST' | 'BLACKLIST';
  modified_by_user_id: null | string;
},
      }
      errors: {
        401: {
          message: 'Unauthorized',
        },
      }
    },
    DELETE: {
      parameters: {
        path: { org_id: string; app_id: string;  },
        query: { id: any; },
      },
      responses: {
        200: {
          id: number,
        },
      }
      errors: {
        400: {
          message: 'Missing id',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
    PATCH: {
      parameters: {
        path: { org_id: string; app_id: string;  },
        body: {
  id: number;
  created_at: Date;
  application_id: string;
  provider: 'ip_address' | 'discord' | 'twitter' | 'github' | 'solana';
  account_id: string;
  access_type: 'WHITELIST' | 'BLACKLIST';
  modified_by_user_id: null | string;
},
        query: { id: any; },
      },
      responses: {
        200: {
  id: number;
  created_at: Date;
  application_id: string;
  provider: 'ip_address' | 'discord' | 'twitter' | 'github' | 'solana';
  account_id: string;
  access_type: 'WHITELIST' | 'BLACKLIST';
  modified_by_user_id: null | string;
},
      }
      errors: {
        400: {
          message: 'Missing id',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
  },
  'app/orgs/:org_id/apps/:app_id/app_roles': {
    GET: {
      parameters: {
        path: { org_id: string; app_id: string;  },
        query?: never,
      },
      responses: {
        200: Array<
  {
    id: number;
    name: string;
    role: 'OWNER' | 'ADMIN' | 'DEVELOPER' | 'MEMBER' | 'MODERATOR';
    application_id: string;
    created_at: Date;
    updated_at: Date;
    modified_by_user_id: null | string;
  }
>,
      }
      errors: {
        401: {
          message: 'Unauthorized',
        },
      }
    },
    PUT: {
      parameters: {
        path: { org_id: string; app_id: string;  },
        body: {
  name?: string;
  role?: 'OWNER' | 'ADMIN' | 'DEVELOPER' | 'MEMBER' | 'MODERATOR';
  created_at?: string | Date;
  updated_at?: string | Date;
  modified_by_user_id?: null | string;
  app_role_assignment?: {
    
  };
  FeatureFlagSetting?: {
    
  };
},
        query?: never,
      },
      responses: {
        200: {
  id: number;
  name: string;
  role: 'OWNER' | 'ADMIN' | 'DEVELOPER' | 'MEMBER' | 'MODERATOR';
  application_id: string;
  created_at: Date;
  updated_at: Date;
  modified_by_user_id: null | string;
},
      }
      errors: {
        401: {
          message: 'Unauthorized',
        },
      }
    },
    DELETE: {
      parameters: {
        path: { org_id: string; app_id: string;  },
        query: { id: any; },
      },
      responses: {
        200: {
          id: number,
        },
      }
      errors: {
        400: {
          message: 'Missing id',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
    PATCH: {
      parameters: {
        path: { org_id: string; app_id: string;  },
        body: {
  id: number;
  name: string;
},
        query: { id: any; },
      },
      responses: {
        200: {
          id: number,
        },
      }
      errors: {
        400: {
          message: 'Missing id',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
  },
  'app/orgs/:org_id/apps/:app_id/auth_rules': {
    GET: {
      parameters: {
        path: { org_id: string; app_id: string;  },
        query?: never,
      },
      responses: {
        200: Array<
  {
    id: number;
    created_at: Date;
    application_id: string;
    provider: 'ip_address' | 'discord' | 'twitter' | 'github' | 'solana';
    is_required: boolean;
    updated_at: Date;
    modified_by_user_id: null | string;
  }
>,
      }
      errors: {
        401: {
          message: 'Unauthorized',
        },
      }
    },
    PUT: {
      parameters: {
        path: { org_id: string; app_id: string;  },
        body: {
  created_at?: string | Date;
  provider: 'ip_address' | 'discord' | 'twitter' | 'github' | 'solana';
  is_required: boolean;
  updated_at?: string | Date;
  modified_by_user_id?: null | string;
},
        query?: never,
      },
      responses: {
        200: {
  id: number;
  created_at: Date;
  application_id: string;
  provider: 'ip_address' | 'discord' | 'twitter' | 'github' | 'solana';
  is_required: boolean;
  updated_at: Date;
  modified_by_user_id: null | string;
},
      }
      errors: {
        401: {
          message: 'Unauthorized',
        },
      }
    },
    DELETE: {
      parameters: {
        path: { org_id: string; app_id: string;  },
        query: { id: any; },
      },
      responses: {
        200: {
          id: number,
        },
      }
      errors: {
        400: {
          message: 'Missing id',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
    PATCH: {
      parameters: {
        path: { org_id: string; app_id: string;  },
        body: {
  id?: number;
  created_at?: Date;
  application_id?: string;
  provider?: 'ip_address' | 'discord' | 'twitter' | 'github' | 'solana';
  is_required?: false | true;
  updated_at?: Date;
  modified_by_user_id?: null | string;
},
        query: { id: any; },
      },
      responses: {
        200: {
  id: number;
  created_at: Date;
  application_id: string;
  provider: 'ip_address' | 'discord' | 'twitter' | 'github' | 'solana';
  is_required: boolean;
  updated_at: Date;
  modified_by_user_id: null | string;
},
      }
      errors: {
        400: {
          message: 'Missing id',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
  },
  'app/orgs/:org_id/apps/:app_id/members': {
    GET: {
      parameters: {
        path: { org_id: string; app_id: string;  },
        query: { limit: any; skip: any; sortBy?: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").Prisma.SessionOrderByWithRelationInput | undefined; },
      },
      responses: {
        200: Array<
  { 
  user: {
    id: string;
    name: null | string;
    username: null | string;
    avatar_url: null | string;
    email: null | string;
    created_at: Date;
    updated_at: Date;
  };
  role_assignments: Array<
    {
      id: number;
      app_role_id: number;
      member_id: string;
      created_at: Date;
      updated_at: Date;
      modified_by_user_id: null | string;
    }
  >;
  id: string;
  user_id: string;
  application_id: string;
  created_at: Date;
  updated_at: Date;
  modified_by_user_id: null | string;
   }
>,
      }
      errors: {
        400: {
          message: 'Limit cannot be greater than 100',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
  },
  'app/orgs/:org_id/apps/:app_id/redirects': {
    GET: {
      parameters: {
        path: { org_id: string; app_id: string;  },
        query?: never,
      },
      responses: {
        200: Array<
  {
    id: number;
    url: string;
    application_id: string;
    created_at: Date;
    updated_at: Date;
    modified_by_user_id: null | string;
  }
>,
      }
      errors: {
        401: {
          message: 'Unauthorized',
        },
      }
    },
    PUT: {
      parameters: {
        path: { org_id: string; app_id: string;  },
        body: {
  url: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  modified_by_user_id?: null | string;
},
        query?: never,
      },
      responses: {
        200: {
  id: number;
  url: string;
  application_id: string;
  created_at: Date;
  updated_at: Date;
  modified_by_user_id: null | string;
},
      }
      errors: {
        401: {
          message: 'Unauthorized',
        },
      }
    },
    DELETE: {
      parameters: {
        path: { org_id: string; app_id: string;  },
        query: { id: any; },
      },
      responses: {
        200: {
          id: number,
        },
      }
      errors: {
        400: {
          message: 'Missing id',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
    PATCH: {
      parameters: {
        path: { org_id: string; app_id: string;  },
        body: {
  id: number;
  url: string;
},
        query: { id: any; },
      },
      responses: {
        200: {
          id: number,
        },
      }
      errors: {
        400: {
          message: 'Missing id',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
  },
  'app/orgs/:org_id/apps/:app_id/secrets': {
    GET: {
      parameters: {
        path: { org_id: string; app_id: string;  },
        query?: never,
      },
      responses: {
        200: null | {
  access_token_secret: string;
  refresh_token_secret: string;
},
      }
      errors: {
        401: {
          message: 'Unauthorized',
        },
      }
    },
    PATCH: {
      parameters: {
        path: { org_id: string; app_id: string;  },
        body: {
  refresh_token_secret?: false | true;
  access_token_secret?: false | true;
},
        query?: never,
      },
      responses: {
        200: {
          access_token_secret: string | undefined,
          refresh_token_secret: string | undefined,
        },
      }
      errors: {
        400: {
          message: 'Missing user id',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
  },
  'app/orgs/:org_id/apps/:app_id/sessions': {
    GET: {
      parameters: {
        path: { org_id: string; app_id: string;  },
        query: { limit?: string | null; skip?: string | undefined; sortBy?: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").Prisma.SessionOrderByWithRelationInput | undefined; },
      },
      responses: {
      }
      errors: {
        400: {
          message: 'Limit cannot be greater than 100',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
  },
  'app/orgs/:org_id/apps/:app_id/members/:member_id': {
    GET: {
      parameters: {
        path: { org_id: string; app_id: string; member_id: string;  },
        query?: never,
      },
      responses: {
        200: { 
user: { 
key: Array<
  {
    id: string;
    hashed_password: null | string;
    user_id: string;
    provider: null | 'ip_address' | 'discord' | 'twitter' | 'github' | 'solana';
    account_id: null | string;
    additional_data: {[key: string]: any};
  }
>;
avatar_url: null | string;
id: string;
name: null | string;
username: null | string;
avatar_url: null | string;
email: null | string;
created_at: Date;
updated_at: Date;
 };
role_assignments: Array<
  {
    id: number;
    app_role_id: number;
    member_id: string;
    created_at: Date;
    updated_at: Date;
    modified_by_user_id: null | string;
  }
>;
id: string;
user_id: string;
application_id: string;
created_at: Date;
updated_at: Date;
modified_by_user_id: null | string;
 },
      }
      errors: {
        401: {
          message: 'Unauthorized',
        },
        404: {
          message: 'Member not found',
        },
      }
    },
  },
  'app/orgs/:org_id/apps/:app_id/members/:member_id/impersonate': {
    GET: {
      parameters: {
        path: { org_id: string; app_id: string; member_id: string;  },
        query?: never,
      },
      responses: {
        302: null,
      }
      errors: {
        400: {
          message: 'User has no accounts registered',
        },
        401: {
          message: 'Unauthorized',
        },
      }
    },
  },
  'app/orgs/:org_id/apps/:app_id/members/:member_id/roles/:role_id': {
    GET: {
      parameters: {
        path: { org_id: string; app_id: string; member_id: string; role_id: string;  },
        query?: never,
      },
      responses: {
        200: {
  id: number;
  name: string;
  role: 'OWNER' | 'ADMIN' | 'DEVELOPER' | 'MEMBER' | 'MODERATOR';
  application_id: string;
  created_at: Date;
  updated_at: Date;
  modified_by_user_id: null | string;
},
      }
      errors: {
        401: {
          message: 'Unauthorized',
        },
        404: {
          message: 'User not found',
        },
      }
    },
    DELETE: {
      parameters: {
        path: { org_id: string; app_id: string; member_id: string; role_id: string;  },
        query?: never,
      },
      responses: {
        200: {
  id: number;
  app_role_id: number;
  member_id: string;
  created_at: Date;
  updated_at: Date;
  modified_by_user_id: null | string;
},
      }
      errors: {
        401: {
          message: 'Unauthorized',
        },
        404: {
          message: 'User not found',
        },
      }
    },
  },
};
export interface ActionPaths {
};
