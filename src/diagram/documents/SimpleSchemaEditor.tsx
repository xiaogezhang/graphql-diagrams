import React from 'react';
import Editor from '@monaco-editor/react';

export default function SimpleSchemaEditor(props: {
  disabled?: boolean;
  sdl: string;
}) {
  const {disabled, sdl} = props;
  const [code, setCode] = React.useState<string>(sdl);
  return (
    <Editor
      height="90vh"
      width="100%"
      value={code}
      options={{
        automaticLayout: true,
        readOnly: true, 
        minimap: {
          enabled: true,
        },
        lineNumbers: 'on',
        lineDecorationsWidth: 4,
        wordWrap: 'off',
        folding: true,
        formatOnType: true,
        scrollBeyondLastLine: false,

        scrollbar: {
          vertical: 'auto',
          horizontal: 'auto',
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
          alwaysConsumeMouseWheel: false,
        },
      }}
      language="graphql"
      defaultLanguage="graphql"
    />
  );
}
