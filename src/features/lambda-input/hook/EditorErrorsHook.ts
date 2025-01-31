import {useContext} from "react";
import {EditorContext} from "../context/EditorContext";
import {SyntaxError, TypeError} from "../../../core/errorhandling/customErrors";


export function useEditorErrorsHook() {

  const editorContext = useContext(EditorContext);

  // UNDERLINE ERRORS IN EDITOR
  function setEditorErrors(errors: Error[] | undefined) {
    const model = editorContext.editor.getModel();
    const markers: any[] = [];

    editorContext.monaco.editor.setModelMarkers(model, 'lambda-errors', []);

    errors?.forEach((error) => {

      if (error instanceof SyntaxError || error instanceof TypeError) {

        markers.push({
          startLineNumber: error.startLine,
          startColumn: error.startColumn,
          endLineNumber: error.endLine,
          endColumn: error.endColumn + 1,
          message: error.message,
          severity: editorContext.monaco.MarkerSeverity.Error,
        });
      }

    });

    editorContext.monaco.editor.setModelMarkers(model, 'lambda-errors', markers);
  }


    return {setEditorErrors};
}