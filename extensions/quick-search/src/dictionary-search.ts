import { Clipboard, closeMainWindow, getSelectedText, open, showHUD, showToast, Toast } from "@raycast/api";

export default async function DictionarySearchCommand() {
  try {
    let text = "";

    // Try to get selected text first, fallback to clipboard
    try {
      text = await getSelectedText();
    } catch {
      const clipboardText = await Clipboard.readText();
      text = clipboardText || "";
    }

    if (!text.trim()) {
      await showToast({
        style: Toast.Style.Failure,
        title: "No text found",
        message: "Please select some text or copy a word to clipboard",
      });
      return;
    }

    const trimmedText = text.trim();

    // Open the dictionary API directly in browser
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(trimmedText)}`;

    await closeMainWindow();
    await open(url);

    await showHUD(`Looking up "${trimmedText}" in dictionary`);
  } catch (error) {
    console.error("Dictionary search error:", error);
    await showToast({
      style: Toast.Style.Failure,
      title: "Dictionary lookup failed",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}
