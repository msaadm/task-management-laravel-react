import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { useEffect, useRef } from 'react';

interface CreateListDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  name: string;
  onNameChange: (name: string) => void;
}

export default function CreateListDialog({
  open,
  onClose,
  onSubmit,
  name,
  onNameChange,
}: CreateListDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      // Small delay to ensure dialog is mounted
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim()) {
      onSubmit(name);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={true}
      maxWidth="sm"
      TransitionProps={{
        onEntered: () => {
          inputRef.current?.focus();
        },
      }}
    >
      <DialogTitle>Create New Task List</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={inputRef}
          autoFocus
          margin="dense"
          label="List Name"
          fullWidth
          value={name}
          onChange={e => onNameChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSubmit(name)} variant="contained" disabled={!name.trim()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
