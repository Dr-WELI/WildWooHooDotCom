require 'webrick'
root = '/Users/u6181388/Documents/05-Business/Websites/WildWooHooDotCom'
Dir.chdir(root)
server = WEBrick::HTTPServer.new(Port: 4173, DocumentRoot: root, BindAddress: '127.0.0.1')
trap('INT') { server.shutdown }
server.start
