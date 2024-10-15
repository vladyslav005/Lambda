declare module "react-katex" {
  import * as React from 'react';

  interface KatexProps {
    children: string;
    errorColor?: string;
    renderError?: (error: Error) => React.ReactNode;
    math?: string;
  }

  export class InlineMath extends React.Component<KatexProps, any> {}
  export class BlockMath extends React.Component<KatexProps, any> {}
}
