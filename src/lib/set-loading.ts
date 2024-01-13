export const setLoading = async (action, commit, mutationName: string) => {
  try {
    commit(mutationName, true);
    await action();
  } finally {
    commit(mutationName, false);
  }
};
