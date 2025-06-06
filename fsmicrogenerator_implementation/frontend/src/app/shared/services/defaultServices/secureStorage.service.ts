import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecureStorageService {
  private secretKey = environment.secretKey;

  constructor() {}

  // --- Encrypt and store data ---
  setItem(key: string, value: any, useSession: boolean = false): void {
    const data = JSON.stringify(value);
    const encrypted = CryptoJS.AES.encrypt(data, this.secretKey).toString();
    const hash = CryptoJS.HmacSHA256(data, this.secretKey).toString();

    const storage = useSession ? sessionStorage : localStorage;
    storage.setItem(key, encrypted);
    storage.setItem(`${key}_hash`, hash);
  }

  // --- Retrieve and decrypt data with integrity check ---
  getItem<T = any>(key: string, useSession: boolean = false): T | null {
    const storage = useSession ? sessionStorage : localStorage;
    const encrypted = storage.getItem(key);
    const hash = storage.getItem(`${key}_hash`);

    if (!encrypted || !hash) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, this.secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      const computedHash = CryptoJS.HmacSHA256(decrypted, this.secretKey).toString();

      if (computedHash !== hash) {
        console.warn('⚠️ Data tampering detected for key:', key);
        return null;
      }

      return JSON.parse(decrypted);
    } catch (e) {
      console.error('Decryption error:', e);
      return null;
    }
  }

  // --- Remove data and hash ---
  removeItem(key: string, useSession: boolean = false): void {
    const storage = useSession ? sessionStorage : localStorage;
    storage.removeItem(key);
    storage.removeItem(`${key}_hash`);
  }

  // --- Clear all data ---
  clear(useSession: boolean = false): void {
    const storage = useSession ? sessionStorage : localStorage;
    storage.clear();
  }
}
