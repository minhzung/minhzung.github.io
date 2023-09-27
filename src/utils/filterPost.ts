export const filterPost = (posts: any[], {
    filterOutDrafts = true,
    filterOutFuturePosts = true,
    sortDescending = true,
    limit = undefined,
  } = {}) => {
    const filteredPosts = posts.reduce((acc: any[], post: any) => {
      const { pubDate, draft } = post.frontmatter;
      // filterOutDrafts if true
      if (filterOutDrafts && draft) return acc;
  
      // filterOutFuturePosts if true
      if (filterOutFuturePosts && new Date(pubDate) > new Date()) return acc;
  
      // add post to acc
      acc.push(post);
  
      return acc;
    }, []);
  
    // sortDescending or Ascending
    if (sortDescending) {
      filteredPosts.sort((a: any, b: any) => new Date(b.frontmatter.pubDate) - new Date(a.frontmatter.pubDate));
    } else {
      filteredPosts.sort((a: any, b: any) => new Date(a.frontmatter.pubDate) - new Date(b.frontmatter.pubDate));
    }
  
    // limit if number is passed
    if (typeof limit === "number") {
      return filteredPosts.slice(0, limit);
    }
    return filteredPosts;
};
  