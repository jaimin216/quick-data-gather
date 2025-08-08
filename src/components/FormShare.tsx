
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Download, QrCode, Share } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import QRCode from 'qrcode';

interface FormShareProps {
  formId: string;
  formTitle: string;
}

export function FormShare({ formId, formTitle }: FormShareProps) {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [publicUrl, setPublicUrl] = useState('');

  useEffect(() => {
    generateQRCode();
  }, [formId]);

  const generateQRCode = async () => {
    const url = `${window.location.origin}/forms/${formId}/view`;
    setPublicUrl(url);

    try {
      const qrDataURL = await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataURL(qrDataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast({
        title: "Copied!",
        description: "Form link copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeDataURL) return;

    const link = document.createElement('a');
    link.download = `${formTitle}-qr-code.png`;
    link.href = qrCodeDataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded!",
      description: "QR code downloaded successfully.",
    });
  };

  const shareForm = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: formTitle,
          text: `Fill out this form: ${formTitle}`,
          url: publicUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      copyToClipboard();
    }
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Share className="h-4 w-4 text-primary" />
          <span>Share & QR</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Link + QR grid */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* Public Link */}
          <div className="space-y-2">
            <Label>Public link</Label>
            <div className="flex gap-2">
              <Input
                value={publicUrl}
                readOnly
                className="flex-1"
              />
              <Button onClick={copyToClipboard} size="sm" variant="secondary" aria-label="Copy form link">
                <Copy className="h-4 w-4" />
              </Button>
              <Button asChild size="sm" variant="outline">
                <a href={publicUrl} target="_blank" rel="noopener noreferrer" aria-label="Open public form">
                  <Share className="h-4 w-4" />
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Anyone with this link can open and submit the form.</p>
          </div>

          {/* QR Code */}
          <div className="space-y-2">
            <Label>QR code</Label>
            <div className="flex flex-col items-center gap-3">
              {qrCodeDataURL && (
                <div className="p-3 rounded-md border bg-card">
                  <img 
                    src={qrCodeDataURL} 
                    alt={`QR code for ${formTitle}`} 
                    loading="lazy"
                    className="w-40 h-40 md:w-48 md:h-48"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={downloadQRCode} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={shareForm} size="sm" variant="secondary">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">Scan with any device to open instantly.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
