export const setLoading = async (action, commit, mutationName) => {
  try {
    commit(mutationName, true);
    await action();
  } finally {
    commit(mutationName, false);
  }
};
