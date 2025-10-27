import React from 'react';

interface ProjectInfoProps {
  title: string;
  content: React.ReactNode;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ title, content }) => {
  return (
    <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-li:text-gray-300">
      <h2 className="text-2xl font-semibold mb-4 text-green-400 border-b-2 border-green-800/50 pb-2">{title}</h2>
      {content}
    </div>
  );
};

export default ProjectInfo;