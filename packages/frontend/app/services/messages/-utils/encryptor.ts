import { encryptFor } from 'emberclear/utils/nacl/utils';
import { toUint8Array, toBase64 } from 'emberclear/utils/string-encoding';
import { PublicKey } from 'emberclear/models/identity';
import { KeyPair } from 'emberclear/models/user';

export async function encryptForSocket(payload: RelayJson, to: PublicKey, from: KeyPair) {
  const payloadString = JSON.stringify(payload);
  const payloadBytes = toUint8Array(payloadString);

  const encryptedMessage = await encryptFor(payloadBytes, to.publicKey!, from.privateKey!);

  return await toBase64(encryptedMessage);
}
