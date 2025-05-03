import { toast as baseToast } from 'react-hot-toast';
import './toast.css'; // We'll define styling here

type Variant = 'default' | 'destructive';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: Variant;
}

export const toast = ({ title, description, variant = 'default' }: ToastOptions) => {
  baseToast.custom((t) => (
    <div
      className={`custom-toast ${variant} ${t.visible ? 'enter' : 'exit'}`}
      onClick={() => baseToast.dismiss(t.id)}
    >
      <strong className="toast-title" > {title} </strong>
      {description && <p className="toast-description" > {description} </p>}
    </div>
  ));
};
