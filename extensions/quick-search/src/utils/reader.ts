import { getSelectedText, Clipboard } from "@raycast/api";

export async function resolveText(text?: string): Promise<string | null> {
  try {
    const sources = [
      () => Promise.resolve(text),
      () => getSelectedText(),
      // () => Clipboard.readText()
    ];

    for (const source of sources) {
      const trimmed = (await source())?.trim();
      if (trimmed) return trimmed;
    }

    return null;
  } catch {
    return null;
  }
}
