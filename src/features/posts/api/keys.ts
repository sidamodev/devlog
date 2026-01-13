export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'],
  list: (filter: string) => [...postKeys.lists(), { filter }],
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
};
