import { FaMagic } from 'react-icons/fa';
import { Button, ButtonProps } from './ui/button';
import { cn } from '@/lib/utils';

export function PersonalizeButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      variant="outline"
      className={cn(props.className, ' text-pink-500 hover:text-pink-600')}
    >
      <FaMagic className="mr-2" />
      Personalize URL
    </Button>
  );
}
