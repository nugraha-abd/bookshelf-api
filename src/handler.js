import { nanoid } from 'nanoid'
import { books } from './books.js'

// Handler for add book
const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  }

  // Response if name property is not filled
  if(name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    })
    response.code(400)
    return response
  }
  // Response if readPage value is more than pageCount
  if(readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    })
    response.code(400)
    return response
  }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if(isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  })
  response.code(500)
  return response
}

// Handler for show all books or sorted by certain condition
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query

  // sort books based on book name
  if(name) {
    return {
      status: 'success',
      data: {
        books: books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())).map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }
  }
  // sort books based on read status
  if(reading) {
    const isReading = reading === '1'
    return {
      status: 'success',
      data: {
        books: books.filter((book) => book.reading === isReading).map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }
  }
  // sort books based on finish status
  if(finished) {
    const isFinished = finished === '1'
    return {
      status: 'success',
      data: {
        books: books.filter((book) => book.finished === isFinished).map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    }
  }
  // show all books
  return {
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  }
}

// Handler for show certain book based on book id
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((book) => book.id === bookId)[0]

  if(book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  })
  response.code(404)
  return response
}

// Handler for edit certain book based on book id
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()

  // Response if name property is not filled
  if(name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    })
    response.code(400)
    return response
  }
  // Response if readPage value is more than pageCount
  if(readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    })
    response.code(400)
    return response
  }

  const index = books.findIndex((book) => book.id === bookId)

  if(index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  })
  response.code(404)
  return response
}

// Handler for delete certain book based on book id
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  })
  response.code(404)
  return response
}

export {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
}
