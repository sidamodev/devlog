import { ServerBlockNoteEditor } from '@blocknote/server-util';
import { PartialBlock } from '@blocknote/core';
import '@blocknote/react/style.css';

type PostDetailContentProps = {
  content: string;
};

const PostDetailContent = async ({ content }: PostDetailContentProps) => {
  // 2. Pass the schema to the server editor
  const editor = ServerBlockNoteEditor.create();

  const blocks = JSON.parse(content) as PartialBlock[];
  const htmlContent = await editor.blocksToFullHTML(blocks);
  return <div className="" dangerouslySetInnerHTML={{ __html: htmlContent }}></div>;
};
export default PostDetailContent;
