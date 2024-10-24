import  crypto,{randomBytes } from "crypto";

export const generateReferral = (length: number): string => {
  if (length <= 0) {
    throw new Error("Length must be a positive number.");
  }
  const byteLength = Math.ceil(length / 2);
  const randomBuffer = randomBytes(byteLength);
  const referralCode = randomBuffer.toString("hex").slice(0, length);

  return referralCode;
};

export const hashWalletAddress = (walletAddress: string): string => {
  return crypto.createHash('sha256').update(walletAddress).digest('hex');
};