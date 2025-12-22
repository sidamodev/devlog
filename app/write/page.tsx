import { Editor } from '@/components/editor/dynamic-editor';
import { Separator } from '@/components/ui/separator';

const WritePage = () => {
  return (
    <div className="flex max-w-sm sm:max-w-xl justify-center">
      <div className="flex w-full flex-col gap-4 pt-8 px-4 max-w-3xl">
        <section aria-label="제목 입력란">
          <label htmlFor="title" className="sr-only">
            제목
          </label>
          <input
            className="outline-hidden h-10 text-5xl max-lg:text-4xl p-0 bg-transparent font-extrabold"
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
