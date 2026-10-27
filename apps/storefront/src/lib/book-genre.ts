import type{StoryBookData}from"./books-data"
export function bookGenre(book:StoryBookData){if(book.genre)return book.genre;const text=`${book.title} ${book.description}`;return /تاريخ|بغداد|أندلس/.test(text)?"historical":/غموض|خرائط|أرشيف/.test(text)?"mystery":"classics"}
