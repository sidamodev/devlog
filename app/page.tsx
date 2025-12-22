import PostItem from '@/components/post/post-item';
import { Separator } from '@/components/ui/separator';
import { Fragment } from 'react/jsx-runtime';

const POST_MOCK = [
  {
    id: '1',
    title: 'Como fazer dark theme com JavaScript puro',
    date: '2021-03-07',
    link: 'https://medium.com/david-fernando/como-dark-theme-com-javascript-puro-fc277377447c?source=rss-e1120fb0abef------2',
    image: 'https://cdn-images-1.medium.com/max/1024/1*pUi3vkj06Vqp_sXeiI-UbQ.jpeg',
    description: 'Um pequeno tutorial de como fazer dark theme com HTML, CSS e JavaScript puro.',
    tags: ['dark-mode', 'js-tutorial', 'javascript', 'tutorial'],
  },
  {
    id: '2',
    title: 'Como reduzir a quantidade de IFs',
    date: '2020-09-25',
    link: 'https://medium.com/david-fernando/como-reduzir-a-quantidade-de-ifs-4484fc728397?source=rss-e1120fb0abef------2',
    image: 'https://cdn-images-1.medium.com/max/1024/1*6wlQhci1Pot4BWUPDpHbfw.jpeg',
    description: 'Uma introdução ao design pattern Strategy com JavaScript',
    tags: ['strategy-design-pattern', 'ecmascript', 'javascript', 'design-patterns', 'ecmascript-6'],
  },
  {
    id: '3',
    title: 'Por que usar TypeScript?',
    date: '2020-09-24',
    link: 'https://medium.com/david-fernando/por-que-usar-typescript-ca15607eed33?source=rss-e1120fb0abef------2',
    image: 'https://cdn-images-1.medium.com/max/1024/1*ODf4X51nKEMElimXA706gQ.jpeg',
    description: 'Veja quais são os benefícios de utiliza-lo em seus projetos',
    tags: ['ecmascript-2020', 'typescript', 'ecmascript-6', 'javascript', 'ecmascript'],
  },
  {
    id: '4',
    title: 'Por que usar TypeScript?',
    date: '2020-09-24',
    link: 'https://medium.com/david-fernando/por-que-usar-typescript-ca15607eed33?source=rss-e1120fb0abef------2',
    image: 'https://cdn-images-1.medium.com/max/1024/1*ODf4X51nKEMElimXA706gQ.jpeg',
    description: 'Veja quais são os benefícios de utiliza-lo em seus projetos',
    tags: ['ecmascript-2020', 'typescript', 'ecmascript-6', 'javascript', 'ecmascript'],
  },
  {
    id: '5',
    title: 'Por que usar TypeScript?',
    date: '2020-09-24',
    link: 'https://medium.com/david-fernando/por-que-usar-typescript-ca15607eed33?source=rss-e1120fb0abef------2',
    image: 'https://cdn-images-1.medium.com/max/1024/1*ODf4X51nKEMElimXA706gQ.jpeg',
    description: 'Veja quais são os benefícios de utiliza-lo em seus projetos',
    tags: ['ecmascript-2020', 'typescript', 'ecmascript-6', 'javascript', 'ecmascript'],
  },
  {
    id: '6',
    title: 'Por que usar TypeScript?',
    date: '2020-09-24',
    link: 'https://medium.com/david-fernando/por-que-usar-typescript-ca15607eed33?source=rss-e1120fb0abef------2',
    image: 'https://cdn-images-1.medium.com/max/1024/1*ODf4X51nKEMElimXA706gQ.jpeg',
    description: 'Veja quais são os benefícios de utiliza-lo em seus projetos',
    tags: ['ecmascript-2020', 'typescript', 'ecmascript-6', 'javascript', 'ecmascript'],
  },
];

const MainPage = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-md sm:max-w-xl w-full border py-8 px-4 rounded-3xl bg-accent/60">
      <div>
        {POST_MOCK.map((post, index) => (
          <Fragment key={post.id}>
            <PostItem post={post} />
            {index !== POST_MOCK.length - 1 && <Separator className="my-4" />}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
export default MainPage;
