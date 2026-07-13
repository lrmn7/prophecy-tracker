export function shortenWallet(wallet: string, chars = 4): string {
  if (wallet.length <= chars * 2 + 2) return wallet;
  return `${wallet.slice(0, chars + 2)}…${wallet.slice(-chars)}`;
}

export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(0);
}

export function formatCurrency(value: number, decimals = 2): string {
  return `$${formatNumber(value, decimals)}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function pad(n: number): string {
  return n.toString().padStart(2, '0');
}
