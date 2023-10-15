"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  DeAuth: () => DeAuth
});
module.exports = __toCommonJS(src_exports);
var dev = false;
var DeAuth = class {
  APP_ID;
  REDIRECT_URI;
  ACCESS_SECRET;
  REFRESH_SECRET;
  constructor(appId, redirectUri, accessSecret, refreshSecret) {
    this.APP_ID = appId;
    this.REDIRECT_URI = redirectUri;
    this.ACCESS_SECRET = accessSecret;
    this.REFRESH_SECRET = refreshSecret;
  }
  async getOAuthURL(fetchInstance) {
    const baseURL = dev ? "http://127.0.0.1:5173/api/login/url" : "https://www.deauth.xyz/api/login/url";
    const params = new URLSearchParams({
      app_id: this.APP_ID,
      redirect_uri: this.REDIRECT_URI,
      access_token: this.ACCESS_SECRET,
      refresh_token: this.REFRESH_SECRET,
      state: crypto.getRandomValues(new Uint32Array(1))[0].toString()
    });
    const redirect_uri = await (fetchInstance || fetch)(`${baseURL}?${params}`, {
      // cors headers
      mode: "cors"
    }).then(async (res) => {
      if (res.ok) {
        return await res.text();
      } else {
        console.error(res.status, res.statusText);
        throw new Error("Error getting OAuth URL.");
      }
    }).catch((err) => {
      throw err;
    });
    console.debug(redirect_uri);
    return redirect_uri;
  }
  async redirectToOAuth({ fetchInstance }) {
    if (window && typeof window !== "undefined") {
      window.location.href = await this.getOAuthURL(fetchInstance);
    } else {
      throw new Error("Cannot redirect in a non-browser environment.");
    }
  }
  async getSessionUser({
    session_id,
    access_token,
    fetchInstance
  }) {
    const baseURL = dev ? `http://127.0.0.1:5173/api/sessions/${session_id}/member` : `https://www.deauth.xyz/api/sessions/${session_id}/member`;
    const params = new URLSearchParams();
    if (!session_id) {
      throw new Error("No user ID or session ID provided.");
    }
    if (!access_token) {
      throw new Error("No access token provided.");
    }
    params.append("access_token", access_token);
    return (fetchInstance || fetch)(`${baseURL}?${params}`, {
      // cors headers
      mode: "cors"
    }).then(async (res) => {
      if (res.ok) {
        return await res.json();
      } else if ([401, 403, 404].includes(res.status)) {
        return null;
      } else {
        console.error(res.status, res.statusText);
        throw new Error("Error getting user.");
      }
    }).catch((err) => {
      throw err;
    });
  }
  async getSession({
    session_id,
    fetchInstance
  }) {
    const baseURL = dev ? `http://127.0.0.1:5173/api/sessions/${session_id}` : `https://www.deauth.xyz/api/sessions/${session_id}`;
    return (fetchInstance || fetch)(baseURL, {
      // cors headers
      mode: "cors"
    }).then(async (res) => {
      if (res.ok) {
        return await res.json();
      } else if ([401, 403, 404].includes(res.status)) {
        return null;
      } else {
        console.error(res.status, res.statusText);
        throw new Error("Error getting session.");
      }
    }).catch((err) => {
      throw err;
    });
  }
  async exchangeProofForSession({
    session_id,
    proof,
    fetchInstance
  }) {
    const baseURL = dev ? "http://127.0.0.1:5173/api/auth/session" : "https://www.deauth.xyz/api/auth/session";
    if (!session_id && !proof) {
      throw new Error("No session ID or proof provided.");
    }
    const params = new URLSearchParams();
    if (session_id) {
      params.append("session_id", session_id);
    }
    if (proof) {
      params.append("proof", proof);
    }
    return (fetchInstance || fetch)(`${baseURL}?${params}`, {
      // cors headers
      mode: "cors"
    }).then(async (res) => {
      if (res.ok) {
        const response = await res.json();
        if (response.length === 0) {
          return null;
        }
        return response[0];
      } else {
        console.error(res.status, res.statusText);
        throw new Error("Error getting session.");
      }
    }).catch((err) => {
      throw err;
    });
  }
  async refreshSession({
    session_id,
    fetchInstance
  }) {
    const baseURL = dev ? `http://127.0.0.1/api/auth/session/${session_id}/refresh` : `https://www.deauth.xyz/api/auth/session/${session_id}/refresh`;
    return (fetchInstance || fetch)(baseURL, {
      // cors headers
      mode: "cors"
    }).then(async (res) => {
      if (res.ok) {
        return (await res.json()).access_token_expires_in;
      } else if ([401, 403, 404].includes(res.status)) {
        return null;
      } else {
        console.error(res.status, res.statusText);
        throw new Error("Error refreshing session.");
      }
    }).catch((err) => {
      throw err;
    });
  }
  async validateSession({
    session_id,
    fetchInstance
  }) {
    const session = await this.getSession({
      session_id
    });
    if (!session) {
      return null;
    }
    let active_period_expires_at = new Date(Number(session.active_expires));
    let idle_period_expires_at = new Date(Number(session.idle_expires));
    if (Date.now() > idle_period_expires_at.getTime()) {
      console.error("Session expired.");
      return null;
    }
    if (Date.now() > active_period_expires_at.getTime()) {
      await this.refreshSession({
        fetchInstance,
        session_id
      }).then((expires_in) => {
        if (!expires_in) {
          return null;
        }
        if (expires_in) {
          active_period_expires_at = new Date(Date.now() + 24 * 60 * 60 * 1e3);
          idle_period_expires_at = new Date(Date.now() + 24 * 60 * 60 * 1e3 * 7);
        }
      });
    }
    return {
      ...session,
      access_token_expires_in: active_period_expires_at.getTime()
    };
  }
  async handleRedirect({
    session_id,
    proof,
    fetchInstance
  }) {
    if (!(session_id || proof)) {
      throw new Error("No session ID found in the redirect URL.");
    }
    return await this.exchangeProofForSession({
      session_id,
      proof,
      fetchInstance
    }).then(async (session) => {
      if (!session) {
        throw new Error("Session validation failed.");
      }
      return session;
    }).catch((err) => {
      throw err;
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeAuth
});
//# sourceMappingURL=index.js.map