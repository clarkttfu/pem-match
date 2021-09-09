export interface PemMatch {
  label: string;
}
export interface PemKeyMatch extends PemMatch {
  type: 'PUBLIC' | 'PRIVATE';
}

export function matchKey(pem: string): PemKeyMatch;
export declare function matchKeyBegin(pem: string): PemKeyMatch;
export declare function matchKeyEnd(pem: string): PemKeyMatch;

export function matchX509(pem: string): PemMatch;
export declare function matchX509Begin(pem: string): PemMatch;
export declare function matchX509End(pem: string): PemMatch;

export function isPrivateKey(pem: string): string;
export function isPublicKey(pem: string): string;
export function trimLines(input: string): string;
