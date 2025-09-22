// original code form: https://github.com/wooorm/space-separated-tokens/blob/main/index.js

export default function parse(value) {
  const input = String(value || '').trim();
  return input ? input.split(/[ \t\n\r\f]+/g) : [];
}
