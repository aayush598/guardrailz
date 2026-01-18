'use client';

import { useState } from 'react';
import { Twitter, Linkedin, Share2, Check } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export function BlogShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareTwitter = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(title);
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    }
  };

  const shareLinkedIn = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" className="justify-start gap-2" onClick={shareTwitter}>
        <Twitter className="h-4 w-4" /> Twitter
      </Button>
      <Button variant="outline" className="justify-start gap-2" onClick={shareLinkedIn}>
        <Linkedin className="h-4 w-4" /> LinkedIn
      </Button>
      <Button variant="outline" className="justify-start gap-2" onClick={handleCopy}>
        {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        {copied ? 'Copied!' : 'Copy Link'}
      </Button>
    </div>
  );
}

interface HubShareButtonProps {
  className?: string;
  variant?: 'outline' | 'default' | 'ghost' | 'secondary';
}

export function HubShareButton({ className, variant = 'outline' }: HubShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button variant={variant} className={className} onClick={handleCopy}>
      {copied ? <Check className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />}
      {copied ? 'Copied Link' : 'Share'}
    </Button>
  );
}
