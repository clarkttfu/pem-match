export type PemKeyType = 'PUBLIC' | 'PRIVATE'
export type PemX509Type = 'CERTIFICATE' | 'REQUEST' | 'CRL'

export interface PemMatch {
  label: string;
  type : PemKeyType | PemX509Type;
}

export function matchKey(pem: string): PemKeyMatch;
export declare function matchKeyBegin(pem: string): PemKeyMatch;
export declare function matchKeyEnd(pem: string): PemKeyMatch;

export function matchX509(pem: string): PemMatch;
export declare function matchX509Begin(pem: string): PemMatch;
export declare function matchX509End(pem: string): PemMatch;

export function isPrivateKey(pem: string): string;
export function isPublicKey(pem: string): string;
export function isX509Cert(pem: string): string;
export function isX509Request(pem: string): string;
export function isX509CRL(pem: string): string;
export function trimLines(input: string): string;
