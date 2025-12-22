import { Editor } from '@/components/editor/dynamic-editor';
import { Separator } from '@/components/ui/separator';

const WritePage = () => {
  return (
    <div className="flex justify-center">
      <div className="flex w-80vw md:w-full flex-col gap-4">
        <section aria-label="제목 입력란">
          <label htmlFor="title" className="sr-only">
            제목
          </label>
          <input
            className="outline-hidden h-10 text-5xl max-lg:text-4xl w-full p-0 bg-transparent font-extrabold"
            placeholder="제목"
            name="title"
          />
        </section>
        <Separator />
        <section aria-label="본문 입력">
          <Editor />
        </section>
      </div>
    </div>
  );
};
export default WritePage;
