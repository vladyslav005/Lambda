export function setUpMonacoLanguage(monaco: any) {
  monaco.languages.register({id: "lambda"});

  let keywords: string[] = [
    "as", "case", "of", "if", "then", "else", "inl", "inr", "nil",
    "isnil", "head", "tail", "cons", "typedef", "fix"
  ];
  monaco.languages.setMonarchTokensProvider("lambda", {
    keywords,
    tokenizer: {
      root: [
        [/Nat|Bool|Unit/, "builtInType"],
        [/iszero|succ|pred/, "builtInFunction"],
        [/true|false|True|False|Unit|unit/, "constant"],

        [/(\b)\w+(\b)/, {
          cases: {
            '@keywords': 'keyword',
            '@default': 'variable',
          }
        }],
        [/=>|⇒/, "doubleArrow"],
        [/→/, "arrow"],

        [/>=/, "geq"],
        [/<=/, "leq"],
        [/==/, "eq"],
        [/\^/, "pow"],
        [/\+/, "plus"],
        [/-/, "minus"],
        [/=/, "delimiter"],

        [/λ/, "lambda"],
        [/\*/, "times"],
        [/</, "langle"],
        [/>/, "rangle"],
        [/]/, "rb"],
        [/\[/, "lb"],
        [/\./, "dot"],
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
      {token: 'arrow', foreground: '#82bd52', fontStyle: 'bold'},

      {token: 'geq', foreground: '#e06c75', fontStyle: 'bold'},
      {token: 'leq', foreground: '#e06c75', fontStyle: 'bold'},
      {token: 'eq', foreground: '#e06c75', fontStyle: 'bold'},
      {token: 'plus', foreground: '#e06c75', fontStyle: 'bold'},
      {token: 'minus', foreground: '#e06c75', fontStyle: 'bold'},
      {token: 'pow', foreground: '#e06c75', fontStyle: 'bold'},
      {token: 'times', foreground: '#e06c75', fontStyle: 'bold'},

      {token: 'lb', foreground: '#807d7d', fontStyle: 'bold'},
      {token: 'rb', foreground: '#807d7d', fontStyle: 'bold'},
      {token: 'langle', foreground: '#e06c75', fontStyle: 'bold'},
      {token: 'rangle', foreground: '#e06c75', fontStyle: 'bold'},
      {token: 'dot', foreground: '#807d7d', fontStyle: 'bold'},
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
      "editor.background": "#F8F8F8",
      "editorCursor.foreground": "#333333",

      "editor.lineHighlightBackground": "#eae8f1",

      "editorLineNumber.foreground": "#7a7a7a",
      "editor.selectionBackground": "#c6d5ff",
      "editor.selectionHighlightBackground": "#d7e3fc",
      "editor.wordHighlightBackground": "#e7e7e7",
      "editor.wordHighlightStrongBackground": "#e0e0e0",
    },
  });

  monaco.editor.defineTheme("lambda-theme-dark", {
    base: 'vs-dark', // Dark base theme
    inherit: true,
    rules: [
      {token: 'keyword', foreground: '#5b8cff', fontStyle: 'bold'},
      {token: 'lambda', foreground: '#e06c75', fontStyle: 'bold'},
      {token: 'constant', foreground: '#ef9105', fontStyle: 'regular'},
      {token: 'builtInFunction', foreground: '#2ba6d3', fontStyle: 'regular'},
      {token: 'builtInType', foreground: '#f6ac1e', fontStyle: 'regular'},
      {token: 'arrow', foreground: '#82bd52', fontStyle: 'bold'},

      {token: 'geq', foreground: '#e06c75', fontStyle: 'bold'},
      {token: 'leq', foreground: '#e06c75', fontStyle: 'bold'},
      {token: 'eq', foreground: '#e06c75', fontStyle: 'bold'},
      {token: 'plus', foreground: '#e06c75', fontStyle: 'bold'},
      {token: 'minus', foreground: '#e06c75', fontStyle: 'bold'},
      {token: 'pow', foreground: '#e06c75', fontStyle: 'bold'},
      {token: 'times', foreground: '#e06c75', fontStyle: 'bold'},

      {token: 'lb', foreground: '#a8a8a8', fontStyle: 'bold'},
      {token: 'rb', foreground: '#a8a8a8', fontStyle: 'bold'},
      {token: 'langle', foreground: '#e06c75', fontStyle: 'bold'},
      {token: 'rangle', foreground: '#e06c75', fontStyle: 'bold'},
      {token: 'dot', foreground: '#a8a8a8', fontStyle: 'bold'},
      {token: 'doubleArrow', foreground: '#6ae40d', fontStyle: 'bold'},
      {token: 'semi', foreground: '#5b8cff', fontStyle: 'bold'},
      {token: 'variable', foreground: '#dcdcdc', fontStyle: 'regular'},
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
      "editor.foreground": "#dcdcdc",
      "editor.background": "#2D2D2D",
      "editorCursor.foreground": "#dcdcdc",

      "editor.lineHighlightBackground": "#3e3e3e",

      "editorLineNumber.foreground": "#7a7a7a",
      "editor.selectionBackground": "#474545",
      "editor.selectionHighlightBackground": "#2e2d2d",
      "editor.wordHighlightBackground": "#3a3a3a",
      "editor.wordHighlightStrongBackground": "#818080",
    },
  });

  monaco.languages.setLanguageConfiguration("lambda", {
    comments: {
      lineComment: "//",
    },
    brackets: [["(", ")"]],
    autoClosingPairs: [
      {open: "(", close: ")"},
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
          word.startColumn,
          position.lineNumber,
          word.endColumn
      );

      const slashRange = new monaco.Range(
          position.lineNumber,
          word.startColumn - 1,
          position.lineNumber,
          word.endColumn
      );

      const suggestions = [
        {
          label: 'typedef',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'typedef ',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'typedef',
          range: wordRange,
        },
        {
          label: 'true',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'true',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'true',
          range: wordRange,
        },
        {
          label: 'false',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'false',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'false',
          range: wordRange,
        },
        {
          label: 'unit',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'unit',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'unit',
          range: wordRange,
        },
        {
          label: 'Unit',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'Unit',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Unit type',
          range: wordRange,
        },
        {
          label: 'nil',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'nil[$1]',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'nil',
          range: wordRange,
        },
        {
          label: 'head',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'head[$1]',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'head',
          range: wordRange,
        },
        {
          label: 'cons',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'cons[$1]',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'cons',
          range: wordRange,
        },
        {
          label: 'tail',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'tail[$1]',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'tail',
          range: wordRange,
        },
        {
          label: 'isnil',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'isnil[$1]',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'isnil',
          range: wordRange,
        },
        {
          label: '\\abstraction',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'λ x : T . (M) : T -> T',
          detail: 'Abstraction',
          range: slashRange,
        },
        {
          label: '\\to',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '->',
          detail: 'Arrow',
          range: slashRange
        },
        {
          label: '\\Rightarrow',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '=>',
          detail: 'DoubleArrow',
          range: slashRange
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
