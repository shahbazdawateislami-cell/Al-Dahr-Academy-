export function getMapEmbedUrl(url: string | undefined): string {
  if (!url || !url.trim()) {
    return 'https://maps.google.com/maps?q=Al-Dahr+Academy,+Phulwari+Sharif,+Patna,+Bihar&t=&z=15&ie=UTF8&iwloc=&output=embed';
  }

  const trimmed = url.trim();

  // If user pasted an full iframe code, extract src URL
  if (trimmed.includes('<iframe')) {
    const match = trimmed.match(/src=["']([^"']+)["']/);
    if (match && match[1]) {
      return match[1];
    }
  }

  // If it's already an embed URL, use it directly
  if (trimmed.includes('output=embed') || trimmed.includes('/embed') || trimmed.includes('/embed?')) {
    return trimmed;
  }

  // Fallback embed query centered on Al-Dahr Academy, Phulwari Sharif, Patna
  return 'https://maps.google.com/maps?q=Al-Dahr+Academy,+Phulwari+Sharif,+Patna,+Bihar&t=&z=15&ie=UTF8&iwloc=&output=embed';
}

export function getMapDirectUrl(url: string | undefined): string {
  const defaultShortLink = 'https://maps.app.goo.gl/k8eLVpmjJw17Txmk7';
  if (!url || !url.trim()) {
    return defaultShortLink;
  }

  const trimmed = url.trim();

  // If it's a maps.app.goo.gl shortlink, return it directly
  if (trimmed.includes('maps.app.goo.gl') || trimmed.includes('goo.gl/maps') || trimmed.includes('google.com/maps')) {
    if (!trimmed.includes('output=embed')) {
      return trimmed;
    }
  }

  return defaultShortLink;
}
