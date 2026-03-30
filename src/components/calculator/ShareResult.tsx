'use client';

interface Props {
  title: string;
  result: string;
  calcUrl: string;
}

export function ShareResult({ title, result, calcUrl }: Props) {
  const shareText =
    `I calculated my ${title}: ${result}\n` +
    `Try it free at CalcPro.NP 🇳🇵\n${calcUrl}`;

  const share = (platform: string) => {
    const encoded = encodeURIComponent(shareText);
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encoded}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(calcUrl)}&quote=${encoded}`,
      twitter: `https://twitter.com/intent/tweet?text=${encoded}`,
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(calcUrl).then(() => {
      alert('Link copied!');
    });
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <p className="text-xs text-gray-500 mb-2 font-medium">
        Share your result:
      </p>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => share('whatsapp')}
          className="flex items-center gap-1.5 px-3 py-1.5
                     text-xs font-medium bg-green-50 text-green-700
                     border border-green-200 rounded-lg
                     hover:bg-green-100 transition-colors">
          WhatsApp
        </button>
        <button
          onClick={() => share('facebook')}
          className="flex items-center gap-1.5 px-3 py-1.5
                     text-xs font-medium bg-blue-50 text-blue-700
                     border border-blue-200 rounded-lg
                     hover:bg-blue-100 transition-colors">
          Facebook
        </button>
        <button
          onClick={copyLink}
          className="flex items-center gap-1.5 px-3 py-1.5
                     text-xs font-medium bg-gray-50 text-gray-700
                     border border-gray-200 rounded-lg
                     hover:bg-gray-100 transition-colors">
          Copy Link
        </button>
      </div>
    </div>
  );
}
