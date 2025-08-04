
import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  unansweredCount: number;
  isSubmitting: boolean;
}

export function ConfirmSubmitModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  unansweredCount,
  isSubmitting
}: ConfirmSubmitModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Confirm Submission
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone once you submit your exam.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-gray-700 mb-4">
            Are you sure you want to submit your exam? This action cannot be undone.
          </p>
          
          {unansweredCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-amber-800 text-sm">
                <strong>Warning:</strong> You have {unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''}. 
                These will be marked as incorrect.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Exam'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
