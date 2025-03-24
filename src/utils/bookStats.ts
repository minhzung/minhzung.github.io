interface Book {
    No: string;
    Book: string;
    Authors: string;
    Pages: string;
    Status: string;
    'Finished on': string;
  }

export function getBookStat(data: Book[], year: string): { totalPages: number; totalBooks: number } {
    let totalPages = 0;
    let totalBooks = 0;
  
    for (const book of data) {
      const finishedOn = book['Finished on'];
      const bookYear = finishedOn.split('-')[1];
  
      if (bookYear === year) {
        const pages = parseFloat(book.Pages);
        if (!isNaN(pages)) {
          totalPages += pages;
        }
        totalBooks++;
      }
    }
  
    return { totalPages, totalBooks };
  }