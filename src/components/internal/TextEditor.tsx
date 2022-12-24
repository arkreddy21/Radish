import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
// import Highlight from '@tiptap/extension-highlight';
// import Underline from '@tiptap/extension-underline';
// import TextAlign from '@tiptap/extension-text-align';
// import Superscript from '@tiptap/extension-superscript';
// import SubScript from '@tiptap/extension-subscript';
import { closeAllModals } from "@mantine/modals";
import { Button } from "@mantine/core";
import { useGlobalContext } from "../../context";
import { useState } from "react";
import TurndownService from "turndown";
import { postComment } from "../../utils/RedditAPI";

interface rteProps {
  thing_id: string;
  content?: string;
}

function TextEditor({ thing_id, content }: rteProps) {
  const turndownService = new TurndownService();
  const { tokens } = useGlobalContext();
  const [text, setText] = useState("");
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: content || "",
    onUpdate: ({ editor }) => {
      setText(editor.getHTML());
    },
  });

  return (
    <>
      {editor && (
        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content />
        </RichTextEditor>
      )}
      <Button
        onClick={() => {
          const mdtext = turndownService.turndown(text);
          // TODO: verify and show the comment
          postComment(tokens.access, thing_id, mdtext);
          closeAllModals();
        }}
        mt="md"
      >
        Submit
      </Button>
    </>
  );
}

export default TextEditor;
