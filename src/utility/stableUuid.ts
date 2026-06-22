function padHex(value: number) {
  return value.toString(16).padStart(8, "0");
}

export function createStableUuid(input: string) {
  let hashA = 0x811c9dc5;
  let hashB = 0x01000193;
  let hashC = 0x9e3779b9;
  let hashD = 0x7f4a7c15;

  for (let index = 0; index < input.length; index += 1) {
    const code = input.charCodeAt(index);
    hashA = Math.imul(hashA ^ code, 0x01000193);
    hashB = Math.imul(hashB ^ code, 0x85ebca6b);
    hashC = Math.imul(hashC ^ code, 0xc2b2ae35);
    hashD = Math.imul(hashD ^ code, 0x27d4eb2f);
  }

  const combined = `${padHex(hashA >>> 0)}${padHex(hashB >>> 0)}${padHex(
    hashC >>> 0,
  )}${padHex(hashD >>> 0)}`.slice(0, 32);

  const versioned =
    combined.slice(0, 12) +
    "5" +
    combined.slice(13, 16) +
    ((parseInt(combined.slice(16, 17), 16) & 0x3) | 0x8).toString(16) +
    combined.slice(17);

  return `${versioned.slice(0, 8)}-${versioned.slice(8, 12)}-${versioned.slice(
    12,
    16,
  )}-${versioned.slice(16, 20)}-${versioned.slice(20, 32)}`;
}
