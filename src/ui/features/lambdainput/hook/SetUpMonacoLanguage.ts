
export function setUpMonacoLanguage(monaco: any)   {

    monaco.languages.register({ id: "lambda" });

    let keywords : string[] = ["vlado"];
    monaco.languages.setMonarchTokensProvider("lambda", {
        keywords,
        tokenizer: {
            root: [
                [/[a-zA-z]\w*/, {
                    cases: {
                        '@keywords': 'keyword',
                        '@default': 'variable',
                    }
                }],
                [/[A-Z][\w$]*/, "type.identifier"],
                [/[=]/, "delimiter"],
                [/λ/, "lambda"],
                [/->/, "arrow"],
                [/:/, "semi"],
                { include: "@whitespace" },
            ],
            whitespace: [
                [/[ \t\r\n]+/, "white"],
                [/\/\/.*$/, "comment"],
            ],
        },
    });

    monaco.editor.defineTheme("lambda-theme", {
        base: 'vs',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '#FF6600', fontStyle: 'bold' },
            { token: 'comment', foreground: '#999999' },
            { token: 'string', foreground: '#009966' },
            { token: 'variable', foreground: '#ea0e6b' },
            { token: 'delimiter', foreground: '#f6ac1e' },

        ],
        colors: {
            "editor.foreground": "#000000", // text color
            "editor.background": "#ffffff",  // Background color for editor
            "editorCursor.foreground": "#7a7671",  // Cursor color
            "editor.lineHighlightBackground": "#ebfb63",  // Highlight for the active line
            "editorLineNumber.foreground": "#008800",  // Line number color
        },
    });

    monaco.languages.setLanguageConfiguration("lambda", {
        comments: {
            lineComment: "//",
        },
        brackets: [["(", ")"]],
        autoClosingPairs: [
            { open: "(", close: ")" },
        ],
    });

    monaco.languages.registerCompletionItemProvider("lambda", {
        provideCompletionItems: (model : any, position : any) => {
            const word = model.getWordUntilPosition(position);
            const range = new monaco.Range(
                position.lineNumber,
                word.startColumn,
                position.lineNumber,
                word.endColumn
            );

            const suggestions = [
                {
                    label: 'func',
                    kind: monaco.languages.CompletionItemKind.Text,
                    insertText: 'λ x : T . (M)',
                    detail: 'Lambda keyword',
                    range: range,
                },
                {
                    label: 'alpha',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'α',
                    detail: 'Alpha type',
                    range: range,

                },
            ];
            return { suggestions };
        }
    });
}
