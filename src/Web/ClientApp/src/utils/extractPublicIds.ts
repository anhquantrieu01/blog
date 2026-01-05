export default function extractPublicIds(html: string): string[] {
  const regex = /data-public-id="([^"]+)"/g;
  const result: string[] = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    result.push(match[1]);
  }
  return result;
}