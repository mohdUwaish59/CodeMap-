# Architecture Flow Designer

A powerful web application for designing system architectures through an intuitive flowchart interface with AI-powered code generation capabilities.

![Architecture Flow Designer](https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=1200&h=600)

## Features

- **Interactive Flowchart Editor**
  - Drag-and-drop interface for system components
  - Real-time node editing and customization
  - Automatic edge connections with arrow indicators
  - Resizable nodes for better visualization

- **Component Library**
  - Frontend components (Client, CDN, UI Components)
  - Backend services (API Gateway, Load Balancer, Microservices)
  - Data storage solutions (Database, Queue, Storage)
  - Infrastructure components (Cloud, Security, Auth)

- **AI-Powered Code Generation**
  - Converts architecture diagrams to implementation code
  - Uses OpenAI's GPT-4 for intelligent code suggestions
  - Supports multiple programming languages and frameworks
  - Generates production-ready code with best practices

- **JSON Export**
  - Export architecture as structured JSON
  - Detailed system documentation
  - Component relationships and dependencies
  - Easy version control and sharing

## Tech Stack

- **Frontend Framework**: Next.js 13 with App Router
- **UI Components**: shadcn/ui + Tailwind CSS
- **Flowchart Engine**: React Flow
- **Icons**: Lucide React
- **AI Integration**: OpenAI GPT-4
- **Type Safety**: TypeScript

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/architecture-flow-designer.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Creating a System Architecture

1. Select components from the sidebar
2. Drag them onto the canvas
3. Connect components by dragging between connection points
4. Edit node properties by clicking on them
5. Arrange and resize nodes as needed

### Generating Code

1. Design your system architecture using the flowchart editor
2. Switch to the "Generated Code" tab
3. Click "Generate Code" to get AI-generated implementation
4. Copy the generated code or export it

### Exporting Architecture

- Use the "Download JSON" button to export your architecture
- The JSON file includes:
  - Component details and properties
  - Connection information
  - System hierarchy and relationships
  - Component descriptions

## Project Structure

```
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── flowchart/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── ui/
├── lib/
└── public/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React Flow](https://reactflow.dev/) for the flowchart functionality
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [OpenAI](https://openai.com/) for the AI-powered code generation
- [Lucide](https://lucide.dev/) for the icon set

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Built with ❤️ using Next.js and OpenAI
