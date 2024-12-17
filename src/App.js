import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { convertToRaw } from "draft-js";

const customStyleMap = {
  RED_UNDERLINE: {
    color: "red",
    fontSize: "16px",
  },
  UNDERLINE: {
    textDecoration: "underline",
    fontSize: "16px",
    color: "black",
  },
  BOLD: {
    fontWeight: "bold",
    fontSize: "16px",
  },
};

const EditorWithStyles = () => {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      const parsedContent = JSON.parse(savedContent);
      return EditorState.createWithContent(convertFromRaw(parsedContent));
    }
    return EditorState.createEmpty();
  });

  const handleBeforeInput = (chars, editorState) => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    const blockKey = selection.getStartKey();
    const block = contentState.getBlockForKey(blockKey);
    const blockText = block.getText();

    if (chars === " " && blockText === "#") {
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: 0,
          focusOffset: blockText.length + 1,
        }),
        ""
      );

      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-block-data"
      );
      setEditorState(RichUtils.toggleBlockType(newEditorState, "header-one"));
      return "handled";
    }

    if (chars === " " && blockText === "*") {
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: 0,
          focusOffset: blockText.length + 1,
        }),
        ""
      );

      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-inline-style"
      );
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, "BOLD"));
      return "handled";
    }

    if (chars === " " && blockText === "**") {
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: 0,
          focusOffset: blockText.length + 2,
        }),
        ""
      );

      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-inline-style"
      );
      setEditorState(
        RichUtils.toggleInlineStyle(newEditorState, "RED_UNDERLINE")
      );
      return "handled";
    }

    if (chars === " " && blockText === "***") {
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: 0,
          focusOffset: blockText.length + 3,
        }),
        ""
      );

      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-inline-style"
      );
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, "UNDERLINE"));
      return "handled";
    }

    return "not-handled";
  };

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const saveToLocalStorage = () => {
    const rawContent = convertToRaw(editorState.getCurrentContent());
    localStorage.setItem("editorContent", JSON.stringify(rawContent));
    alert("Content saved to localStorage!");
  };

  return (
    <div>
      <h4 style={{ textAlign: "center" }}>Demo Editor by Gauresh</h4>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          minHeight: "200px",
          margin: "40px 10px 10px 10px",
        }}
      >
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleBeforeInput={handleBeforeInput}
          handleKeyCommand={handleKeyCommand}
          customStyleMap={customStyleMap}
          placeholder="Enter text here..."
        />
      </div>
      <button
        onClick={saveToLocalStorage}
        style={{ margin: "10px 0px 0px 10px" }}
      >
        Save
      </button>
    </div>
  );
};

export default EditorWithStyles;
