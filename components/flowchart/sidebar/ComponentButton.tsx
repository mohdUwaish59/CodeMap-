import { Button } from '@/components/ui/button';
import { ComponentConfig } from '../../types/flowchart.types';

interface ComponentButtonProps {
  component: ComponentConfig;
  onAdd: (type: string, icon: any, description: string) => void;
}

export const ComponentButton = ({ component, onAdd }: ComponentButtonProps) => (
  <Button
    variant="outline"
    className="w-full justify-start"
    onClick={() => onAdd(component.type, component.icon, component.description)}
  >
    <component.icon className="mr-2 h-4 w-4" />
    {component.type}
  </Button>
);