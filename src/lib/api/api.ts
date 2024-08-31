

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
import type { Prisma } from "/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index.js"
import type { ValidatedSignatureData } from "/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/src/lib/auth/solAuth.js"
import type { DAS } from "/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/helius-sdk/dist/src/types/das-types.js"
import type { SolanaSignInInput } from "/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/@solana/wallet-standard-features/lib/types/signIn.js"
import type { SolanaSignInInputWithRequiredFields } from "/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/@solana/wallet-standard-util/lib/types/signIn.js"
import type { ApiCreatePayload } from "/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/src/types/crud.js"

export interface GET {
  '/app/orgs': {
    parameters: {        path?: never;
        query: {    id: any;}
;
}
;
    responses: {    200: { id: string; name: string; owner_id: string; callback_urls: string[]; website: string | null; privacy_policy_url: string | null; terms_of_service_url: string | null; created_at: Date; updated_at: Date; modified_by_user_id: string | null; branding_id: number | null; } | null}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/api/auth/auth_requests': {
    parameters: {        path?: never;
        query: {    state: string | undefined;}
;
}
;
    responses: {    200: { id: number; uuid: string; state: string; nonce: string; uri: string; signature: string | null; provider_access_token: string | null; provider_refresh_token: string | null; provider_access_token_expires_in: number | null; provider_account_id: string | null; access_token: string | null; refresh_token: string | null; access_token_expires_in: number | null; user_id: string | null; created_at: Date; updated_at: Date; application_id: string; ip_address: string | null; provider: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.OAuthProvider; }}
;
    errors: {      400: 
                {
                    message: "Missing query params"
                }
                ;      404: 
                {
                    message: "Auth request not found"
                }
                ;}

  };
  '/api/auth/authorize': {
    parameters: {        path?: never;
}
;
    responses: {}
;
    errors?: never;
  };
  '/api/auth/session': {
    parameters: {        path?: never;
        query: {    proof: string | null;}
;
}
;
    responses: {    200: ValidatedSignatureData}
;
    errors: {      400: 
                {
                    message: "Missing session id"
                }
                ;      401: 
                {
                    message: "No access token"
                }
                 | 
                {
                    message: "Session expired"
                }
                ;      404: 
                {
                    message: "Session not found"
                }
                 | 
                {
                    message: "Auth request not found"
                }
                 | 
                {
                    message: "User not found"
                }
                 | 
                {
                    message: "Session not found"
                }
                ;}

  };
  '/api/login/discord': {
    parameters: {        path?: never;
}
;
    responses: {    200: string}
;
    errors: {      400: 
                {
                    message: "Missing app_id"
                }
                ;}

  };
  '/api/login/solana': {
    parameters: {        path?: never;
}
;
    responses: {    200: string}
;
    errors?: never;
  };
  '/api/login/url': {
    parameters: {        path?: never;
        query: {    state: string | null;}
;
}
;
    responses: {}
;
    errors: {      400: 
                {
                    message: "Missing app_id"
                }
                 | 
                {
                    message: "Missing redirect_uri"
                }
                 | 
                {
                    message: "Invalid redirect_uri"
                }
                 | 
                {
                    message: "Missing state"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                 | 
                {
                    message: "Unauthorized"
                }
                 | 
                {
                    message: "Invalid access_token"
                }
                 | 
                {
                    message: "Invalid refresh_token"
                }
                ;      404: 
                {
                    message: "Application not found"
                }
                ;}

  };
  '/api/nfts/:public_key': {
    parameters: {        path: {public_key: string}
;
        query: {    sortBy: string | undefined;}
;
}
;
    responses: {    200: DAS.GetAssetResponseList}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/api/sessions/:session_id': {
    parameters: {        path: {session_id: string}
;
}
;
    responses: {    200: { access_token_expires_in: string; active_expires: string; idle_expires: string; id: string; created_at: Date; auth_request_id: number | null; application_id: string; user_id: string; provider_account_id: string; access_token: string; refresh_token: string; impersonating_user_id: string | null; }}
;
    errors: {      404: 
                {
                    message: "Session not found"
                }
                ;}

  };
  '/api/user/:user_id': {
    parameters: {        path: {user_id: string}
;
        query: {    by: "userId" | "account_id";}
;
}
;
    responses: {    200: ({ key: { id: string; hashed_password: string | null; user_id: string; provider: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.OAuthProvider | null; account_id: string | null; additional_data: Prisma.JsonValue; }[]; } & { id: string; name: string | null; username: string | null; avatar_url: string | null; email: string | null; created_at: Date; updated_at: Date; suspended_at: Date | null; suspended_by_user_id: string | null; }) | null}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/api/auth/callback/:provider': {
    parameters: {        path: {provider: string}
;
        query: {    state: string | null;}
;
}
;
    responses: {    200: { application: { app_role: { id: number; name: string; application_id: string; default_for_new_member: boolean; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }[]; } & { id: string; name: string; description: string | null; organization_id: string; access_token_secret: string; refresh_token_secret: string; access_token_expiry: number; website: string | null; privacy_policy_url: string | null; terms_of_service_url: string | null; refresh_token_expiry: number; updated_at: Date; modified_by_user_id: string | null; created_at: Date; branding_id: number | null; }; provider_user: { id: string; username?: string | undefined; avatar?: string | undefined; discriminator?: string | undefined; public_flags?: number | undefined; flags: number; locale: string; mfa_enabled: boolean; provider: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.OAuthProvider; }; provider: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.OAuthProvider; provider_account_id: string; } | { session: any; application: { app_role: { id: number; name: string; application_id: string; default_for_new_member: boolean; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }[]; } & { id: string; name: string; description: string | null; organization_id: string; access_token_secret: string; refresh_token_secret: string; access_token_expiry: number; website: string | null; privacy_policy_url: string | null; terms_of_service_url: string | null; refresh_token_expiry: number; updated_at: Date; modified_by_user_id: string | null; created_at: Date; branding_id: number | null; }; provider_user: { id: string; username?: string | undefined; avatar?: string | undefined; discriminator?: string | undefined; public_flags?: number | undefined; flags: number; locale: string; mfa_enabled: boolean; provider: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.OAuthProvider; }; provider_account_id: string; provider: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.OAuthProvider; }}
;
    errors: {      302: null;      400: 
                {
                    message: "Invalid provider"
                }
                 | 
                {
                    message: "Missing state"
                }
                ;      401: 
                {
                    message: "You have been denied access to this application, Contact the application owner if you believe this is an error."
                }
                ;      404: 
                {
                    message: "Auth Request not found"
                }
                ;      500: 
                {
                    message: "User not found nor created"
                }
                 | 
                {
                    message: "Session not found nor created"
                }
                ;}

  };
  '/api/sessions/:session_id/member': {
    parameters: {        path: {session_id: string}
;
        query: {    access_token: string | undefined;}
;
}
;
    responses: {    200: { user: { username: string | null; avatar_url: string | null; }; assigned_permissions: ({ app_role: { name: string; } | null; permission: { resource: { key: string; }; } & { id: number; operation: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.CrudOperation; resource_id: number; description: string | null; default_for_new_role: boolean; parent_permission_id: number | null; application_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }; } & { id: number; permission_id: number; app_role_id: number | null; member_id: string | null; user_role_id: number | null; created_at: Date; updated_at: Date; modified_by_user_id: string | null; })[]; role_assignments: { app_role: { assigned_permissions: ({ permission: { resource: { key: string; }; } & { id: number; operation: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.CrudOperation; resource_id: number; description: string | null; default_for_new_role: boolean; parent_permission_id: number | null; application_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }; } & { id: number; permission_id: number; app_role_id: number | null; member_id: string | null; user_role_id: number | null; created_at: Date; updated_at: Date; modified_by_user_id: string | null; })[]; } & { id: number; name: string; application_id: string; default_for_new_member: boolean; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }; }[]; } & { id: string; user_id: string; application_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;      404: 
                {
                    message: "Session not found"
                }
                 | 
                {
                    message: "Member not found"
                }
                ;}

  };
  '/api/sessions/:session_id/refresh': {
    parameters: {        path: {session_id: string}
;
        query: {    refresh_token: string | null;}
;
}
;
    responses: {    200: { access_token_expires_in: number; }}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                 | 
                {
                    message: "Invalid refresh_token"
                }
                ;      404: 
                {
                    message: "Session not found"
                }
                ;}

  };
  '/app/orgs/:org_id/apps': {
    parameters: {        path: {org_id: string}
;
        query: {    org_id: any;}
;
}
;
    responses: {    200: { id: string; name: string; description: string | null; organization_id: string; access_token_secret: string; refresh_token_secret: string; access_token_expiry: number; website: string | null; privacy_policy_url: string | null; terms_of_service_url: string | null; refresh_token_expiry: number; updated_at: Date; modified_by_user_id: string | null; created_at: Date; branding_id: number | null; } | null}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/branding': {
    parameters: {        path: {org_id: string}
;
        query: {    id: any;}
;
}
;
    responses: {    200: { id: number; created_at: Date; logo: string | null; primary_color: string | null; primary_color_text: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.TextColor | null; secondary_color: string | null; secondary_color_text: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.TextColor | null; background_color: string | null; background_color_text: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.TextColor | null; background_image: string | null; background_image_text: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.TextColor | null; font: string | null; organization_id: string | null; application_id: string | null; updated_at: Date; modified_by_user_id: string | null; } | null}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/invites': {
    parameters: {        path: {org_id: string}
;
}
;
    responses: {    200: { id: number; from_user_id: string; application_id: string | null; organization_id: string | null; key_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }[]}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/members': {
    parameters: {        path: {org_id: string}
;
        query: {    query: any;}
;
}
;
    responses: {    200: ({ user: { key: { id: string; }[]; username: string | null; avatar_url: string | null; }; role_assignments: { id: number; app_role_id: number; member_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }[]; } & { id: string; user_id: string; application_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; })[]}
;
    errors: {      400: 
                {
                    message: "Limit cannot be greater than 100"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/api/user/:user_id/roles/:role_id': {
    parameters: {        path: {user_id: string
role_id: string}
;
}
;
    responses: {    200: { id: number; app_role_id: number; member_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; } | null}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/api/siws/message/:app_id/:public_key/generate': {
    parameters: {        path: {app_id: string
public_key: string}
;
        query: {    state: any;}
;
}
;
    responses: {    200: { legacy: string; siws: SolanaSignInInputWithRequiredFields; }}
;
    errors?: never;
  };
  '/app/orgs/:org_id/apps/:app_id/access_control': {
    parameters: {        path: {org_id: string
app_id: string}
;
}
;
    responses: {    200: { id: number; created_at: Date; application_id: string; provider: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.OAuthProvider; account_id: string; access_type: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.AccessControlType; modified_by_user_id: string | null; }[]}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/app_roles': {
    parameters: {        path: {org_id: string
app_id: string}
;
}
;
    responses: {    200: { id: number; name: string; application_id: string; default_for_new_member: boolean; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }[]}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/auth_rules': {
    parameters: {        path: {org_id: string
app_id: string}
;
}
;
    responses: {    200: { id: number; created_at: Date; application_id: string; provider: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.OAuthProvider; is_required: boolean; updated_at: Date; modified_by_user_id: string | null; }[]}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/invites': {
    parameters: {        path: {org_id: string
app_id: string}
;
}
;
    responses: {    200: { id: number; from_user_id: string; application_id: string | null; organization_id: string | null; key_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }[]}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/members': {
    parameters: {        path: {org_id: string
app_id: string}
;
        query: {    query: any;}
;
}
;
    responses: {    200: ({ user: { key: { id: string; }[]; username: string | null; avatar_url: string | null; }; role_assignments: { id: number; app_role_id: number; member_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }[]; } & { id: string; user_id: string; application_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; })[]}
;
    errors: {      400: 
                {
                    message: "Limit cannot be greater than 100"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/redirects': {
    parameters: {        path: {org_id: string
app_id: string}
;
}
;
    responses: {    200: { id: number; url: string; application_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }[]}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/resources': {
    parameters: {        path: {org_id: string
app_id: string}
;
}
;
    responses: {    200: { id: number; key: string; description: string | null; application_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }[]}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/secrets': {
    parameters: {        path: {org_id: string
app_id: string}
;
}
;
    responses: {    200: { access_token_secret: string; refresh_token_secret: string; } | null}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/sessions': {
    parameters: {        path: {org_id: string
app_id: string}
;
        query: {    sortBy: string | undefined;}
;
}
;
    responses: {    200: { id: string; created_at: Date; active_expires: bigint; idle_expires: bigint; auth_request_id: number | null; application_id: string; user_id: string; provider_account_id: string; access_token: string; refresh_token: string; access_token_expires_in: number; impersonating_user_id: string | null; }[]}
;
    errors: {      400: 
                {
                    message: "Limit cannot be greater than 100"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/members/:member_id': {
    parameters: {        path: {org_id: string
app_id: string
member_id: string}
;
}
;
    responses: {    200: { user: { key: { id: string; hashed_password: string | null; user_id: string; provider: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.OAuthProvider | null; account_id: string | null; additional_data: Prisma.JsonValue; }[]; avatar_url: string | null; } & { id: string; name: string | null; username: string | null; avatar_url: string | null; email: string | null; created_at: Date; updated_at: Date; suspended_at: Date | null; suspended_by_user_id: string | null; }; role_assignments: { id: number; app_role_id: number; member_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }[]; } & { id: string; user_id: string; application_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;      404: 
                {
                    message: "Member not found"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/resources/:resource_id': {
    parameters: {        path: {org_id: string
app_id: string
resource_id: string}
;
}
;
    responses: {    200: { id: number; operation: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.CrudOperation; resource_id: number; description: string | null; default_for_new_role: boolean; parent_permission_id: number | null; application_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }[]}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/app_roles/:app_role_id/permissions': {
    parameters: {        path: {org_id: string
app_id: string
app_role_id: string}
;
}
;
    responses: {    200: { permission: { id: number; operation: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.CrudOperation; resource_id: number; description: string | null; default_for_new_role: boolean; parent_permission_id: number | null; application_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }; } & { id: number; permission_id: number; app_role_id: number | null; member_id: string | null; user_role_id: number | null; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/members/:member_id/impersonate': {
    parameters: {        path: {org_id: string
app_id: string
member_id: string}
;
}
;
    responses: {}
;
    errors: {      302: null;      400: 
                {
                    message: "User has no accounts registered"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/members/:member_id/roles/:role_id': {
    parameters: {        path: {org_id: string
app_id: string
member_id: string
role_id: string}
;
}
;
    responses: {    200: { app_role_assignment: { id: number; app_role_id: number; member_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }[]; } & { id: number; name: string; application_id: string; default_for_new_member: boolean; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;      404: 
                {
                    message: "User not found"
                }
                ;}

  };
}

export interface POST {
  '/app/orgs': {
    parameters: {        body: Prisma.OrganizationCreateWithoutOwnerInput;
        path?: never;
}
;
    responses: {    200: { id: string; name: string; owner_id: string; callback_urls: string[]; website: string | null; privacy_policy_url: string | null; terms_of_service_url: string | null; created_at: Date; updated_at: Date; modified_by_user_id: string | null; branding_id: number | null; } | { id: string; name: string; owner_id: string; callback_urls: string[]; website: string | null; privacy_policy_url: string | null; terms_of_service_url: string | null; created_at: Date; updated_at: Date; modified_by_user_id: string | null; branding_id: number | null; }}
;
    errors: {      400: 
                {
                    message: "Missing user id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/api/siws/message/verify': {
    parameters: {        body: { input: SolanaSignInInput; output: SerializedSolanaSignInOutput; };
        path?: never;
        query: {    state: any;}
;
}
;
    responses: {    200: any | any}
;
    errors: {      400: 
                {
                    message: "Missing state"
                }
                ;      404: 
                {
                    message: "Application not found, Or Solana OAuth not enabled for this application"
                }
                ;      500: 
                {
                    message: "User not found nor created"
                }
                ;}

  };
  '/app/orgs/:org_id/apps': {
    parameters: {        body: Prisma.ApplicationCreateWithoutOrganizationInput;
        path: {org_id: string}
;
}
;
    responses: {    200: never[] | { app_role: { id: number; name: string; application_id: string; default_for_new_member: boolean; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }[]; } & { id: string; name: string; description: string | null; organization_id: string; access_token_secret: string; refresh_token_secret: string; access_token_expiry: number; website: string | null; privacy_policy_url: string | null; terms_of_service_url: string | null; refresh_token_expiry: number; updated_at: Date; modified_by_user_id: string | null; created_at: Date; branding_id: number | null; }}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
}

export interface PUT {
  '/app/orgs/:org_id/branding': {
    parameters: {        path: {org_id: string}
;
        query: {    app_id: string | null | undefined;}
;
}
;
    responses: {    200: { id: number; created_at: Date; logo: string | null; primary_color: string | null; primary_color_text: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.TextColor | null; secondary_color: string | null; secondary_color_text: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.TextColor | null; background_color: string | null; background_color_text: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.TextColor | null; background_image: string | null; background_image_text: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.TextColor | null; font: string | null; organization_id: string | null; application_id: string | null; updated_at: Date; modified_by_user_id: string | null; }}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/invites': {
    parameters: {        body: Prisma.InvitesUncheckedCreateInput;
        path: {org_id: string}
;
}
;
    responses: {    200: { username: string | null; avatar_url: string | null; }}
;
    errors: {      400: 
                {
                    message: "User does not exist"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;      500: 
                {
                    message: "Internal Server Error"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/access_control': {
    parameters: {        body: Prisma.user_access_controlCreateWithoutApplicationInput;
        path: {org_id: string
app_id: string}
;
}
;
    responses: {    200: { id: number; created_at: Date; application_id: string; provider: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.OAuthProvider; account_id: string; access_type: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.AccessControlType; modified_by_user_id: string | null; }}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/app_roles': {
    parameters: {        body: Prisma.app_roleCreateWithoutApplicationInput;
        path: {org_id: string
app_id: string}
;
}
;
    responses: {    200: { id: number; name: string; application_id: string; default_for_new_member: boolean; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/auth_rules': {
    parameters: {        body: Prisma.authentication_ruleCreateWithoutApplicationInput;
        path: {org_id: string
app_id: string}
;
}
;
    responses: {    200: { id: number; created_at: Date; application_id: string; provider: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.OAuthProvider; is_required: boolean; updated_at: Date; modified_by_user_id: string | null; }}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/invites': {
    parameters: {        body: Prisma.InvitesUncheckedCreateInput;
        path: {org_id: string
app_id: string}
;
}
;
    responses: {    200: { username: string | null; avatar_url: string | null; }}
;
    errors: {      400: 
                {
                    message: "User does not exist"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;      500: 
                {
                    message: "Internal Server Error"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/redirects': {
    parameters: {        body: ApiCreatePayload<Prisma.redirect_urlCreateWithoutApplicationInput>;
        path: {org_id: string
app_id: string}
;
}
;
    responses: {    200: { id: number; url: string; application_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/resources': {
    parameters: {        body: ApiCreatePayload<Prisma.AppResourcesCreateWithoutApplicationInput>;
        path: {org_id: string
app_id: string}
;
}
;
    responses: {    200: { id: number; key: string; description: string | null; application_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;      409: 
                {
                    message: "Duplicate resource name"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/resources/:resource_id': {
    parameters: {        body: ApiCreatePayload<Prisma.AppPermissionCreateWithoutResourceInput>;
        path: {org_id: string
app_id: string
resource_id: string}
;
}
;
    responses: {    200: { id: number; operation: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.CrudOperation; resource_id: number; description: string | null; default_for_new_role: boolean; parent_permission_id: number | null; application_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/app_roles/:app_role_id/permissions': {
    parameters: {        body: { id: number; operation: import("node_modules/.prisma/client/index").$Enums.CrudOperation; resource_id: number; description: string | null; default_for_new_role: boolean; parent_permission_id: number | null; application_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }[];
        path: {org_id: string
app_id: string
app_role_id: string}
;
}
;
    responses: {    200: { where: { app_role_id: number; permission: { operation: { in: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.CrudOperation[]; }; }; }; orderBy: { created_at: "desc"; }; } | { id: number; permission_id: number; app_role_id: number | null; member_id: string | null; user_role_id: number | null; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }[]}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;      409: 
                {
                    message: "No Changes"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/members/:member_id/roles/:role_id': {
    parameters: {        path: {org_id: string
app_id: string
member_id: string
role_id: string}
;
}
;
    responses: {    200: { id: number; app_role_id: number; member_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;      404: 
                {
                    message: "Role not found"
                }
                ;      409: 
                {
                    message: "Role already assigned"
                }
                ;}

  };
}

export interface DELETE {
  '/app/orgs': {
    parameters: {        path?: never;
        query: {    id: any;}
;
}
;
    responses: {    200: { id: string; }}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/api/sessions/:session_id': {
    parameters: {        path: {session_id: string}
;
}
;
    responses: {    200: { id: string; }}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps': {
    parameters: {        path: {org_id: string}
;
        query: {    org_id: any;}
;
}
;
    responses: {    200: { id: string; }}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/branding': {
    parameters: {        path: {org_id: string}
;
        query: {    app_id: any;}
;
}
;
    responses: {    200: { id: number; }}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/invites': {
    parameters: {        path: {org_id: string}
;
        query: {    id: any;}
;
}
;
    responses: {    200: { id: number; from_user_id: string; application_id: string | null; organization_id: string | null; key_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/access_control': {
    parameters: {        path: {org_id: string
app_id: string}
;
        query: {    id: any;}
;
}
;
    responses: {    200: { id: number; }}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/app_roles': {
    parameters: {        path: {org_id: string
app_id: string}
;
        query: {    id: any;}
;
}
;
    responses: {    200: { id: number; }}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/auth_rules': {
    parameters: {        path: {org_id: string
app_id: string}
;
        query: {    id: any;}
;
}
;
    responses: {    200: { id: number; }}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/invites': {
    parameters: {        path: {org_id: string
app_id: string}
;
        query: {    id: any;}
;
}
;
    responses: {    200: { id: number; from_user_id: string; application_id: string | null; organization_id: string | null; key_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/redirects': {
    parameters: {        path: {org_id: string
app_id: string}
;
        query: {    id: any;}
;
}
;
    responses: {    200: { id: number; }}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/resources': {
    parameters: {        path: {org_id: string
app_id: string}
;
        query: {    id: any;}
;
}
;
    responses: {    200: { id: number; }}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/resources/:resource_id': {
    parameters: {        path: {org_id: string
app_id: string
resource_id: string}
;
        query: {    id: any;}
;
}
;
    responses: {    200: { id: number; }}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/app_roles/:app_role_id/permissions': {
    parameters: {        body: number[];
        path: {org_id: string
app_id: string
app_role_id: string}
;
}
;
    responses: {    200: Prisma.BatchPayload}
;
    errors: {      400: 
                {
                    message: "Missing ids"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;      404: 
                {
                    message: "No Changes"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/app_roles/:app_role_id/permissions/:permission_id': {
    parameters: {        path: {org_id: string
app_id: string
app_role_id: string
permission_id: string}
;
}
;
    responses: {    200: { id: number; }}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/members/:member_id/roles/:role_id': {
    parameters: {        path: {org_id: string
app_id: string
member_id: string
role_id: string}
;
}
;
    responses: {    200: { id: number; app_role_id: number; member_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;      404: 
                {
                    message: "User not found"
                }
                ;}

  };
}

export interface PATCH {
  '/app/orgs': {
    parameters: {        body: Prisma.OrganizationUpdateInput;
        path?: never;
        query: {    id: any;}
;
}
;
    responses: {    200: { id: string; }}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/api/user/:user_id': {
    parameters: {        body: Partial<{ id: string; name: string | null; username: string | null; avatar_url: string | null; email: string | null; created_at: Date; updated_at: Date; suspended_at: Date | null; suspended_by_user_id: string | null; }>;
        path: {user_id: string}
;
}
;
    responses: {    200: { id: string; name: string | null; username: string | null; avatar_url: string | null; email: string | null; created_at: Date; updated_at: Date; suspended_at: Date | null; suspended_by_user_id: string | null; }}
;
    errors: {      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps': {
    parameters: {        body: Prisma.ApplicationUpdateInput;
        path: {org_id: string}
;
        query: {    org_id: any;}
;
}
;
    responses: {    200: { id: string; }}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/branding': {
    parameters: {        body: {};
        path: {org_id: string}
;
        query: {    app_id: any;}
;
}
;
    responses: {    200: { id: number; }}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/access_control': {
    parameters: {        body: { id: number; created_at: Date; application_id: string; provider: import("node_modules/.prisma/client/index").$Enums.OAuthProvider; account_id: string; access_type: import("node_modules/.prisma/client/index").$Enums.AccessControlType; modified_by_user_id: string | null; };
        path: {org_id: string
app_id: string}
;
        query: {    id: any;}
;
}
;
    responses: {    200: { id: number; created_at: Date; application_id: string; provider: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.OAuthProvider; account_id: string; access_type: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.AccessControlType; modified_by_user_id: string | null; }}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/app_roles': {
    parameters: {        body: { id: number; name: string; };
        path: {org_id: string
app_id: string}
;
        query: {    id: any;}
;
}
;
    responses: {    200: { id: number; }}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/auth_rules': {
    parameters: {        body: Partial<{ id: number; created_at: Date; application_id: string; provider: import("node_modules/.prisma/client/index").$Enums.OAuthProvider; is_required: boolean; updated_at: Date; modified_by_user_id: string | null; }>;
        path: {org_id: string
app_id: string}
;
        query: {    id: any;}
;
}
;
    responses: {    200: { id: number; created_at: Date; application_id: string; provider: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.OAuthProvider; is_required: boolean; updated_at: Date; modified_by_user_id: string | null; }}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/redirects': {
    parameters: {        body: { id: number; url: string; };
        path: {org_id: string
app_id: string}
;
        query: {    id: any;}
;
}
;
    responses: {    200: { id: number; }}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/resources': {
    parameters: {        body: { id: number; name: never; description: string | null; };
        path: {org_id: string
app_id: string}
;
        query: {    id: any;}
;
}
;
    responses: {    200: { id: number; key: string; description: string | null; application_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/secrets': {
    parameters: {        body: { refresh_token_secret?: boolean | undefined; access_token_secret?: boolean | undefined; };
        path: {org_id: string
app_id: string}
;
}
;
    responses: {    200: { access_token_secret: string | undefined; refresh_token_secret: string | undefined; }}
;
    errors: {      400: 
                {
                    message: "Missing user id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/resources/:resource_id': {
    parameters: {        body: Partial<Prisma.AppPermissionUncheckedCreateInput>;
        path: {org_id: string
app_id: string
resource_id: string}
;
        query: {    id: any;}
;
}
;
    responses: {    200: { id: number; operation: import("/home/bewinxed/Downloads/GuardianGeckoBot/templates/solana-oauth/node_modules/.prisma/client/index").$Enums.CrudOperation; resource_id: number; description: string | null; default_for_new_role: boolean; parent_permission_id: number | null; application_id: string; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
  '/app/orgs/:org_id/apps/:app_id/app_roles/:app_role_id/permissions': {
    parameters: {        body: Partial<Prisma.AppResourcesCreateInput>;
        path: {org_id: string
app_id: string
app_role_id: string}
;
        query: {    id: any;}
;
}
;
    responses: {    200: { id: number; permission_id: number; app_role_id: number | null; member_id: string | null; user_role_id: number | null; created_at: Date; updated_at: Date; modified_by_user_id: string | null; }}
;
    errors: {      400: 
                {
                    message: "Missing id"
                }
                ;      401: 
                {
                    message: "Unauthorized"
                }
                ;}

  };
}

export type APIPaths = GET & POST & PUT & DELETE & PATCH;

undefined