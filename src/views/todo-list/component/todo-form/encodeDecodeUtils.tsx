// 加密函数
export async function encrypt(plaintext: string, salt: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  const saltBuffer = hexToUint8Array(salt);

  // 生成随机加密密钥
  const key = await window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt']
  );

  // 导出密钥为二进制格式
  const keyBuffer = await window.crypto.subtle.exportKey('raw', key);
  const keyArray = new Uint8Array(keyBuffer);

  // 使用盐值增强密钥（简单异或）
  const enhancedKey = new Uint8Array(keyArray.length);
  for (let i = 0; i < keyArray.length; i++) {
    enhancedKey[i] = keyArray[i] ^ saltBuffer[i % saltBuffer.length];
  }

  // 生成随机 IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // 加密数据
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    data
  );

  // 合并 IV、增强密钥和密文
  const combined = new Uint8Array([
    // @ts-ignore
    ...iv,
    // @ts-ignore
    ...enhancedKey,
    // @ts-ignore
    ...new Uint8Array(encryptedBuffer)
  ]);

  return arrayToBase64(combined);
}

// 解密函数
export async function decrypt(ciphertext: string, salt: string) {
  const combined = base64ToArray(ciphertext);
  const saltBuffer = hexToUint8Array(salt);

  // 分离 IV、增强密钥和密文
  const iv = combined.slice(0, 12);
  const enhancedKey = combined.slice(12, 44); // 32字节密钥
  const cipherBuffer = combined.slice(44);

  // 恢复原始密钥
  const keyArray = new Uint8Array(enhancedKey.length);
  for (let i = 0; i < enhancedKey.length; i++) {
    keyArray[i] = enhancedKey[i] ^ saltBuffer[i % saltBuffer.length];
  }

  // 导入密钥
  const key = await window.crypto.subtle.importKey(
    'raw',
    keyArray,
    { name: 'AES-GCM' },
    true,
    ['decrypt']
  );

  // 解密数据
  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      cipherBuffer
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('解密失败:', error);
    return null;
  }
}

// 辅助函数（保持不变）
function arrayToBase64(array: any) {
  return btoa(String.fromCharCode.apply(null, array));
}

function base64ToArray(base64: string) {
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

function hexToUint8Array(hex: string) {
  return Uint8Array.from(
    (hex.match(/.{1,2}/g) || []).map(byte => parseInt(byte, 16))
  );
}