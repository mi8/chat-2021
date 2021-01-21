import { Configuration } from 'msal';
import { MsalAngularConfiguration } from '@azure/msal-angular';

// this checks if the app is running on IE
export const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

// B2C Policies and User Flows
export const b2cPolicies = {
  names: {
    signUpSignIn: "B2C_1_SignUpSignIn"
  },
  authorities: {
    signUpSignIn: {
      authority: "https://AuthASPAngular.b2clogin.com/AuthASPAngular.onmicrosoft.com/B2C_1_SignUpSignIn"
    }
  }
};

// Authentication Configurations
export const msalConfig: Configuration = {
  auth: {
    clientId: "52810140-36e8-4d31-a3c2-243a5aa3a389",
    authority: b2cPolicies.authorities.signUpSignIn.authority,
    redirectUri: "http://localhost:4200/",
    postLogoutRedirectUri: "http://localhost:4200/",
    navigateToLoginRequestUrl: true,
    validateAuthority: false
  },
  cache: {
    cacheLocation: "localStorage",
    // Set this to "true" to save cache in cookies
    // to address trusted zones limitations in IE
    storeAuthStateInCookie: isIE
  }
};

// Scopes Required For Login
export const loginRequest: { scopes: string[] } = {
  scopes: ['openid']
};

// MSAL Angular Configurations
// Define protected API URLs and required scopes
export const protectedResourceMap: [string, string[]][] = [];

// MSAL Angular specific configurations
export const msalAngularConfig: MsalAngularConfiguration = {
  popUp: !isIE,
  consentScopes: [
    ...loginRequest.scopes
  ],
  // API calls to these coordinates will NOT activate MSALGuard
  unprotectedResources: [],
  // API calls to these coordinates will activate MSALGuard
  protectedResourceMap,
  extraQueryParameters: {}
};
