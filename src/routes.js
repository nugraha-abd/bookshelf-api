import {
  addBookHandler,
  getAllBooksHandler,
} from './handler.js'

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  }
]

export { routes }
