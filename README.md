## DeAuth.xyz: Solana-Based Web3 Drop-In OAuth Provider

![DeAuth Logo](https://www.deauth.xyz/deauth.svg)

Welcome to **DeAuth.xyz**, a revolutionary drop-in OAuth provider built atop the Solana blockchain. Our solution is crafted meticulously for developers who wish to seamlessly integrate web3 authentication into their applications, without diving deep into the intricacies of Solana message signing or ledger support.

### Features

1. **Multi-Tenancy**: Support for multiple tenants, ensuring data isolation among different users and applications (Or not, it's your choice).
   ![image](https://github.com/Bewinxed/DeAuth/assets/9145989/6c3c51bb-e1f2-43df-89c2-157fcb79380d)
   ![image](https://github.com/Bewinxed/DeAuth/assets/9145989/220d2f01-b8ec-43ed-a8eb-fb785b8f0b8a)
2. **Role and User Permission Management**: Granular control over user roles and permissions, allowing for intricate access controls tailored to your application's needs.
   . ![image](https://github.com/Bewinxed/DeAuth/assets/9145989/a9eed7d6-5763-4f7b-ac74-7b1c70747da3)
3. **User Impersonation**: Admins can impersonate users, aiding in debugging or support.
4. **Advanced Logging**: Comprehensive logs to monitor authentication actions and user activities.
5. **Branded Login Page**: Customize the login page to resonate with your brand, ensuring a coherent user experience.
   ![image](https://github.com/Bewinxed/DeAuth/assets/9145989/4b13c006-7313-40dc-8ea8-6910b8bd7a81)
6. **NFT Avatars**: Let your users showcase their unique NFT avatars during authentication.
   ![image](https://github.com/Bewinxed/DeAuth/assets/9145989/dc1acee8-55a2-4b0c-b929-8f88cbcd0e3a)
7. **Security**: Our platform mitigates the burden of ensuring secure Solana message signing.
8. **SDK Support**: We offer SDKs for **Plain JS/TS at the moment**, the rest of the major frameworks will follow soon.
9. **Drop-In Auth Components** Coming soon for React, Next.JS, Sveltekit, Vue, etc... (Pending need assessment)

### Getting Started

1. **Sign up via https://www.deauth.xyz**
2. **Create an organization**
3. **Create an application**
4. **Obtain your application's Acesss/Refresh Token, You can use these to verify the session's credentials anytime**
   ![image](https://github.com/Bewinxed/DeAuth/assets/9145989/9840bab6-28c9-4587-b421-b5fda80b57e8)
5. **Install the SDK**
   ```bash
   npm install @deauth/sdk-universal
   ```
6. **Configuration**

   ```ts
   import DeAuth from '@deauth/sdk-universal'

   export const deAuth = new DeAuth(
     '975a0a2a-b760-43a1-a42c-32d6c297cba8' //App ID
     'http://127.0.0.1',  //Redirect URI
     '****************************************', //Access Token
     '****************************************', //Refresh Token
   ```

   Catch the callback.

   ````ts
     const authorization_url = await deAuth.redirectToOAuth({
   fetchInstance: fetch
   })```
   Validate Session anytime.
   ```ts
     const session = await deAuth.handleRedirect({	proof: proof})
   ````

   Get User info

   ```ts
   const session = await deAuth.getSessionUser({
   	session_id: 'Get From Cookie'
   });
   ```

7. **Manage Your Users/Sessions/Permissions**
   Log into your deauth dashboard, you can find all your application's settings in there!
   ![image](https://github.com/Bewinxed/DeAuth/assets/9145989/7487b474-3d4a-4b1e-8804-99cffdb5419f)

### Documentation

Dive deeper into our features and functionalities by [visiting our detailed documentation](<[https://docs.deauth.xyz](https://bewinxed.gitbook.io/deauth.xyz/)>).

### Examples

Visit our [examples repository](https://github.com/DeAuth.xyz/examples) to see how **DeAuth.xyz** can be integrated into various platforms and applications.

### Roadmap

1. Implement JWT Auth for no-backend apps.
2. Build SDKs for other frameworks.
3. Build Web3 Subscription-Management into the platform.
4. Build drop-in Auth Components for major frameworks.

---

Developed with ❤️ Bewinxed **bewinxed**, [Twitter](https://x.com/deauthxyz) for updates and support.
