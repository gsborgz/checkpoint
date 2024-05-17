export default function buildTranslationJson(key: string, args?: Record<string, any>): string {
  return JSON.stringify({ key, args });
}
