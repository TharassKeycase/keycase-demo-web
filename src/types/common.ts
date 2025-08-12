import { ProjectSchema } from './project';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  message: string;
  onConfirm: () => void;
}

export interface ErrorMessage {
  show: boolean;
  message: string;
}

export interface ValidateTextBoxProps {
  visible: boolean;
  message?: string;
}

export interface MenuProps {
  top: number;
  left: number;
  open: boolean;
  options: Array<string>;
  selectedIndex: number;
}

export interface SearchTextFieldProps {
  error: boolean;
  onInputChange: (name: string, value: string) => void;
  value: string;
  name: string;
}

export interface ProjectCardProps {
  project: ProjectSchema;
  onDelete: (id: number) => void;
  onEdit: () => void;
}

export type DialogTypes = "add" | "edit" | "delete" | "view";
