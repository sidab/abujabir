routes = [
    {
        path: '/books',
        componentUrl: 'pages/books/index.html'
    },
    {
        path: '/book/:id',
        componentUrl: 'pages/books/book.html',
        options: {
            transition: 'f7-dive'
        }
    }
]