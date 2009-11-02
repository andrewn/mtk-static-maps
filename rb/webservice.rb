require 'rubygems'
require 'sinatra'

require 'net/http'
require 'uri'

require 'cgi' # to parse query string

puts File.dirname(__FILE__) + '/../src'

set :public, File.dirname(__FILE__) + '/../src'


get "/map?" do
  query_string = query_string_to_hash( request.query_string )
  map_url = 'http://mesa.welcomebackstage.com/staticmaps/html/staticmap.html?' + request.query_string
  screenshot_url = 'http://mesa.welcomebackstage.com/screenshot/site/' + map_url
  
  Net::HTTP.get URI.parse( screenshot_url )
  # TODO: specify image format
end

def query_string_to_hash( qs )
  CGI.parse( qs )
end

def request_remote_url()
  
end