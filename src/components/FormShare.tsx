
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Share className="h-5 w-5" />
          <span>Share Form</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Public Link */}
        <div className="space-y-2">
          <Label>Public Link</Label>
          <div className="flex space-x-2">
            <Input
              value={publicUrl}
              readOnly
              className="flex-1"
            />
            <Button onClick={copyToClipboard} size="sm">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Anyone with this link can access and fill out your form.
          </p>
        </div>

        {/* QR Code */}
        <div className="space-y-4">
          <Label>QR Code</Label>
          <div className="flex flex-col items-center space-y-4">
            {qrCodeDataURL && (
              <div className="p-4 bg-white rounded-lg border">
                <img 
                  src={qrCodeDataURL} 
                  alt="QR Code" 
                  className="w-48 h-48"
                />
              </div>
            )}
            <div className="flex space-x-2">
              <Button onClick={downloadQRCode} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download QR Code
              </Button>
              <Button onClick={shareForm} size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center">
            Print or share this QR code for easy mobile access.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
