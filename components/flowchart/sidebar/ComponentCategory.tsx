import { ComponentCategory as CategoryType } from '../../types/flowchart.types';
import { ComponentButton } from './ComponentButton';

interface ComponentCategoryProps {
  category: CategoryType;
  onAddNode: (type: string, icon: any, description: string) => void;
}

export const ComponentCategory = ({ category, onAddNode }: ComponentCategoryProps) => (
  <div className="space-y-2">
    <h3 className="text-sm font-medium text-muted-foreground mb-2">
      {category.title}
    </h3>
    {category.components.map((component) => (
      <ComponentButton
        key={component.type}
        component={component}
        onAdd={onAddNode}
      />
    ))}
  </div>
);