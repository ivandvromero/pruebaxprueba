import { BadRequestException } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';

export const decryptAES256 = async (encrypt, key) => {
  try {
    const bytes = await CryptoJS.AES.decrypt(encrypt, key, {
      keySize: 256 / 8,
    });
    const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedMessage);
  } catch (error) {
    throw new BadRequestException(error);
  }
};
export const encryptAES256 = async (
  message: string,
  key: string,
  keySize: number,
) => {
  try {
    const ciphertext = CryptoJS.AES.encrypt(message, key, {
      keySize,
    }).toString();
    return ciphertext;
  } catch (error) {
    throw new BadRequestException(error);
  }
};
