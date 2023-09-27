// slugify
export const slugify = (content: string) => {
  if (!content) return null;

  return content
  .toString()
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^\w-]+/g, '')
  .replace(/--+/g, '-')
  .replace(/^-+/, '')
  .replace(/-+$/, '');
};

// convert dateTime to readable format
export const formatDate = (date: string | Date) => {
  return date = new Date(date).toLocaleDateString('en-US', {
    timeZone: "UTC", year: 'numeric', month: 'short', day: 'numeric'
  })
};

// returns the first x words of a string

export const firstWords = (inputString: string, x: number): string => {
  // Split the input string into words using whitespace as a delimiter
  const words = inputString.split(/\s+/);
  
  // Take the first 'x' words and join them back into a string
  const result = words.slice(0, x).join(' ');
  
  return result + ' ...';
};

