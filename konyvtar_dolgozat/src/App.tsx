import React, { useState, useEffect } from 'react';


interface Book {
  id: number;
  author: string;
  title: string;
  year: number;
  genre: string;
  pages: number;
  available: boolean;
}

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>('title');
  const [order, setOrder] = useState<string>('asc');
  const [loading, setLoading] = useState<boolean>(false);
  const [newBook, setNewBook] = useState({
    author: '',
    title: '',
    year: '',
    genre: '',
    pages: '',
    available: true,
  });

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/books?page=${currentPage}&sortBy=${sortBy}&order=${order}`
      );
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage, sortBy, order]);


  const handleAddBook = async () => {
    const bookData = {
      author: newBook.author,
      title: newBook.title,
      year: parseInt(newBook.year),
      genre: newBook.genre,
      pages: parseInt(newBook.pages),
      available: newBook.available,
    };

    try {
      const response = await fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        setNewBook({
          author: '',
          title: '',
          year: '',
          genre: '',
          pages: '',
          available: true,
        });
        fetchBooks(); 
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };


  const handleDeleteBook = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await fetch(`http://localhost:3000/books/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchBooks();
        }
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  return (
    <div>
      <h1>Book Library</h1>

      <div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="year">Year</option>
        </select>
        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="book-list">
        {loading ? (
          <p>Loading...</p>
        ) : (
          books.map((book) => (
            <div key={book.id} className="book-card">
              <h2>{book.author} - {book.title}</h2>
              <p>Year: {book.year}</p>
              <p>Genre: {book.genre}</p>
              <p>Pages: {book.pages}</p>
              <p>Available: {book.available ? 'Yes' : 'No'}</p>
              <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
            </div>
          ))
        )}
      </div>

      <div>
        <h2>Add New Book</h2>
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        <input
          type="number"
          placeholder="Year"
          value={newBook.year}
          onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
        />
        <input
          type="text"
          placeholder="Genre"
          value={newBook.genre}
          onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
        />
        <input
          type="number"
          placeholder="Pages"
          value={newBook.pages}
          onChange={(e) => setNewBook({ ...newBook, pages: e.target.value })}
        />
        <label>
          Available:
          <input
            type="checkbox"
            checked={newBook.available}
            onChange={(e) => setNewBook({ ...newBook, available: e.target.checked })}
          />
        </label>
        <button onClick={handleAddBook}>Add Book</button>
      </div>

      <div>
        <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
        <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      </div>
    </div>
  );
};

export default App;

