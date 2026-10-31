import mimetypes, http.server

mimetypes.add_type('text/javascript', '.js')
mimetypes.add_type('text/javascript', '.mjs')

http.server.test(
    HandlerClass=http.server.SimpleHTTPRequestHandler,
    port=8000,
    bind='127.0.0.1',
)