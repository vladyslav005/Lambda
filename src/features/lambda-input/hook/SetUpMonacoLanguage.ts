export function setUpMonacoLanguage(monaco: any) {
  monaco.languages.register({id: "lambda"});

  let keywords: string[] = ["as", "case", "of", "if", "then", "else", "inl", "inr", "nil", "isnil", "head", "tail", "cons"];
  monaco.languages.setMonarchTokensProvider("lambda", {
    keywords,
    tokenizer: {
      root: [
        [/Nat|Bool/, "builtInType"],
        [/iszero|succ|pred/, "builtInFunction"],
        [/true|false|True|False/, "constant"],

        [/\b[a-zA-z]+\b/, {
          cases: {
            '@keywords': 'keyword',
            '@default': 'variable',
          }
        }],

        [/=>/, "doubleArrow"],
        [/=/, "delimiter"],
        [/λ/, "lambda"],
        [/->/, "arrow"],
        [/:/, "semi"],
        {include: "@whitespace"},
      ],
      whitespace: [
        [/[ \t\r\n]+/, "white"],
        [/\/\/.*$/, "comment"],
      ],
    },
  });

  monaco.editor.defineTheme("lambda-theme", {
    base: 'vs', // Light base theme
    inherit: true,
    rules: [
      {token: 'keyword', foreground: '#5b8cff', fontStyle: 'bold'},
      {token: 'lambda', foreground: '#e06c75', fontStyle: 'bold'},
      {token: 'constant', foreground: '#ef9105', fontStyle: 'regular'},
      {token: 'builtInFunction', foreground: '#2ba6d3', fontStyle: 'regular'},
      {token: 'builtInType', foreground: '#f6ac1e', fontStyle: 'regular'},
      {token: 'arrow', foreground: '#98c379', fontStyle: 'bold'},
      {token: 'doubleArrow', foreground: '#6ae40d', fontStyle: 'bold'},
      {token: 'semi', foreground: '#5b8cff', fontStyle: 'bold'},
      {token: 'variable', foreground: '#333333', fontStyle: 'regular'},
      {token: 'number', foreground: '#d19a66'},
      {token: 'string', foreground: '#b5bd68'},
      {token: 'comment', foreground: '#8b8b8b', fontStyle: 'italic'},
      {token: 'delimiter', foreground: '#e06c75'},
      {token: 'type', foreground: '#a5c8ff', fontStyle: 'bold'},
      {token: 'function', foreground: '#c678dd', fontStyle: 'bold'},
      {token: 'class', foreground: '#e5c07b', fontStyle: 'bold'},
      {token: 'property', foreground: '#61afef', fontStyle: 'bold'},
    ],
    colors: {
      "editor.foreground": "#3c3c3c",
      "editor.background": "#f3edf7",
      "editorCursor.foreground": "#333333",

      "editor.lineHighlightBackground": "#E7E0EC",

      "editorLineNumber.foreground": "#7a7a7a",
      "editor.selectionBackground": "#c6d5ff",
      "editor.selectionHighlightBackground": "#d7e3fc",
      "editor.wordHighlightBackground": "#e7e7e7",
      "editor.wordHighlightStrongBackground": "#e0e0e0",
    },
  });

  monaco.editor.defineTheme("dark-lambda-theme", {
    base: 'vs-dark', // Dark base theme for better contrast
    inherit: true,
    rules: [
      {token: 'keyword', foreground: '#ffab40', fontStyle: 'bold'},
      {token: 'lambda', foreground: '#c678dd', fontStyle: 'bold'},
      {token: 'arrow', foreground: '#56b6c2', fontStyle: 'bold'},
      {token: 'doubleArrow', foreground: '#3e8309', fontStyle: 'bold'},
      {token: 'semi', foreground: '#61afef', fontStyle: 'bold'},
      {token: 'variable', foreground: '#ffffff', fontStyle: 'regular'},
      {token: 'number', foreground: '#d19a66'},
      {token: 'string', foreground: '#98c379'},
      {token: 'comment', foreground: '#7f848e', fontStyle: 'italic'},
      {token: 'delimiter', foreground: '#e06c75'},
      {token: 'type', foreground: '#c678dd', fontStyle: 'bold'},
      {token: 'function', foreground: '#61afef', fontStyle: 'bold'},
      {token: 'class', foreground: '#e5c07b', fontStyle: 'bold'},
      {token: 'property', foreground: '#d19a66', fontStyle: 'bold'},
    ],
    colors: {
      "editor.foreground": "#abb2bf",
      "editor.background": "#282c34",
      "editorCursor.foreground": "#528bff",
      "editor.lineHighlightBackground": "#3e4451",
      "editorLineNumber.foreground": "#636c76",
      "editor.selectionBackground": "#4e5562",
      "editor.selectionHighlightBackground": "#3e4451",
      "editor.wordHighlightBackground": "#3e4451",
      "editor.wordHighlightStrongBackground": "#4e5562",
    },
  });

  monaco.languages.setLanguageConfiguration("lambda", {
    comments: {
      lineComment: "//",
    },
    brackets: [["(", ")"]],
    autoClosingPairs: [
      {open: "(", close: ")"},
      {open: "-", close: ">"},
      {open: "<", close: ">"},
      {open: "[", close: "]"},
    ],
  });

  // Register the completion provider for vars, based on regex
  monaco.languages.registerCompletionItemProvider("lambda", {
    provideCompletionItems: (model: any, position: any) => {
      try {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        const variableRegex = /\b([a-zA-Z_]\w*)\b/g;
        const matches = new Set();
        let match;

        while ((match = variableRegex.exec(textUntilPosition)) !== null) {
          matches.add(match[1]);
        }

        const suggestions = Array.from(matches).map(variable => ({
          label: variable,
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: variable,
          detail: "Variable auto-completion",
        }));

        return {suggestions};
      } catch (error) {
        console.error("Error in provideCompletionItems:", error);
        return {suggestions: []};
      }
    },
  });

  monaco.languages.registerCompletionItemProvider("lambda", {
    provideCompletionItems: (model: any, position: any) => {
      const word = model.getWordUntilPosition(position);
      const wordRange = new monaco.Range(
          position.lineNumber,
          word.startColumn - 1,
          position.lineNumber,
          word.endColumn
      );

      const suggestions = [
        {
          label: '\\abstraction',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'λ x : T . (M)',
          detail: 'Abstraction',
          range: wordRange,
        },
        {
          label: '\\rightarrow',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '->',
          detail: 'Arrow',
        },
        {
          label: '\\Rightarrow',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '=>',
          detail: 'DoubleArrow',
        },

      ];
      return {suggestions};
    }
  });

  monaco.languages.registerCompletionItemProvider("lambda", {
    provideCompletionItems: (model: any, position: any) => {
      const word = model.getWordUntilPosition(position);

      const slashRange = new monaco.Range(
          position.lineNumber,
          word.startColumn - 1,
          position.lineNumber,
          word.endColumn
      );

      const suggestions = [
        {
          label: '\\alpha',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'α',
          detail: 'Alpha type',
          range: slashRange
        },
        {
          label: '\\beta',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'β',
          detail: 'Beta type',
          range: slashRange
        },
        {
          label: '\\gamma',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'γ',
          detail: 'Gamma type',
          range: slashRange
        },
        {
          label: '\\delta',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'δ',
          detail: 'Delta type',
          range: slashRange
        },
        {
          label: '\\epsilon',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'ε',
          detail: 'Epsilon type',
          range: slashRange
        },
        {
          label: '\\zeta',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'ζ',
          detail: 'Zeta type',
          range: slashRange
        },
        {
          label: '\\eta',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'η',
          detail: 'Eta type',
          range: slashRange
        },
        {
          label: '\\theta',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'θ',
          detail: 'Theta type',
          range: slashRange
        },
        {
          label: '\\iota',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'ι',
          detail: 'Iota type',
          range: slashRange
        },
        {
          label: '\\kappa',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'κ',
          detail: 'Kappa type',
          range: slashRange
        },
        {
          label: '\\lambda',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'λ',
          detail: 'Lambda type',
          range: slashRange
        },
        {
          label: '\\mu',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'μ',
          detail: 'Mu type',
          range: slashRange
        },
        {
          label: '\\nu',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'ν',
          detail: 'Nu type',
          range: slashRange
        },
        {
          label: '\\xi',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'ξ',
          detail: 'Xi type',
          range: slashRange
        },
        {
          label: '\\omicron',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'ο',
          detail: 'Omicron type',
          range: slashRange
        },
        {
          label: '\\pi',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'π',
          detail: 'Pi type',
          range: slashRange
        },
        {
          label: '\\rho',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'ρ',
          detail: 'Rho type',
          range: slashRange
        },
        {
          label: '\\sigma',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'σ',
          detail: 'Sigma type',
          range: slashRange
        },
        {
          label: '\\tau',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'τ',
          detail: 'Tau type',
          range: slashRange
        },
        {
          label: '\\upsilon',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'υ',
          detail: 'Upsilon type',
          range: slashRange
        },
        {
          label: '\\phi',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'φ',
          detail: 'Phi type',
          range: slashRange
        },
        {
          label: '\\chi',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'χ',
          detail: 'Chi type',
          range: slashRange
        },
        {
          label: '\\psi',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'ψ',
          detail: 'Psi type',
          range: slashRange
        },
        {
          label: '\\omega',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'ω',
          detail: 'Omega type',
          range: slashRange
        }
      ];

      return {suggestions};
    }
  });
}
