import { normalizeImageUrl } from "@/utils/image-utils";

interface PostComponentProps {
  component: any;
}

// Component to render a section title
const PostSectionTitle = ({ component }: PostComponentProps) => (
  <h2 className="text-2xl font-bold text-gray-900 my-6">{component.text}</h2>
);

// Component to render a paragraph
const PostParagraph = ({ component }: PostComponentProps) => (
  <p className="text-gray-700 mb-6 leading-relaxed">{component.text}</p>
);

// Component to render an image
const PostImage = ({ component }: PostComponentProps) => (
  <div className="my-8 rounded-lg overflow-hidden shadow-md">
    <img 
      src={normalizeImageUrl(component.image)} 
      alt="Post image" 
      className="w-full h-auto"
    />
  </div>
);

// Component to render a list
const PostList = ({ component }: PostComponentProps) => {
  const items = component.items.split(',').map(item => item.trim());
  
  return (
    <ul className="list-disc pl-6 mb-6 space-y-2">
      {items.map((item: string, index: number) => (
        <li key={index} className="text-gray-700">
          {item.replace(/^\d+\.\s*/, '')} {/* Remove numbering if present */}
        </li>
      ))}
    </ul>
  );
};

// Component to render a quote
const PostQuote = ({ component }: PostComponentProps) => (
  <blockquote className="border-l-4 border-primary pl-4 italic my-6 py-2 text-gray-700">
    <p className="mb-2">{component.quote}</p>
    {component.author && (
      <footer className="text-sm text-gray-600">— {component.author}</footer>
    )}
  </blockquote>
);

// Map component types to their respective components
const componentMap: Record<string, React.FC<PostComponentProps>> = {
  PostSectionTitle,
  PostParagraph,
  PostImage,
  PostList,
  PostQuote,
};

interface PostContentProps {
  components: any[];
}

export default function PostContent({ components }: PostContentProps) {
  if (!components || components.length === 0) {
    return (
      <div className="prose max-w-none">
        <p className="text-gray-700 mb-6">This post has no content yet.</p>
      </div>
    );
  }
  
  // Sort components by index to ensure correct order
  const sortedComponents = [...components].sort((a, b) => a.index - b.index);
  
  return (
    <div className="prose max-w-none">
      {sortedComponents.map((component, idx) => {
        const ComponentToRender = componentMap[component.component_type];
        
        if (ComponentToRender) {
          return <ComponentToRender key={`${component.id}-${idx}`} component={component} />;
        }
        
        // Fallback for unknown component types
        return (
          <div key={`${component.id}-${idx}`} className="my-4 p-4 bg-gray-100 rounded-md">
            <p className="text-gray-500">Unknown component type: {component.component_type}</p>
          </div>
        );
      })}
    </div>
  );
}
