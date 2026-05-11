export async function images_books({ book_title, book_author }: any) {

    const splitAuthor = book_author.split(",");
    const useAuthor = splitAuthor[0] ?? book_author;

    try {

        // Using API with authors and without Authors
        const openLibraryTitle = await $fetch(`https://openlibrary.org/search.json?q=${book_title}?author=${useAuthor}&limit=5`);
        const openLibraryAllTitles = await $fetch(`https://openlibrary.org/search.json?q=${book_title}&limit=5`);

        const useOpenLibraryTitle = await openLibraryTitle;
        const useOpenLibraryAllTitles = await openLibraryAllTitles;

        // Filtering all titles api and finding the author name within
        const filterTitles = useOpenLibraryAllTitles?.docs.filter((item: any) => item?.author_name?.includes(useAuthor) ?? '');

        // Image URL used for the books
        // https://covers.openlibrary.org/a/id/8441376.jpg

        const useCovers = filterTitles.length > 0 ? filterTitles : useOpenLibraryTitle?.docs;
        const findCover = useCovers.find((item: any) => item?.cover_i);

        return findCover?.cover_i ? `https://covers.openlibrary.org/a/id/${findCover?.cover_i}.jpg` : `/images/thumbnail_none.png`;
    }
    catch (error) {
        console.log(error);
        return error;
    }
};
