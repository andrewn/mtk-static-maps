require 'rubygems'
require 'sinatra'

require 'net/http'
require 'uri'

require 'cgi' # to parse query string

puts File.dirname(__FILE__) + '/../src'

set :public, File.dirname(__FILE__) + '/../src'

#mime 'js', 'text/javascript'
#mime :html, 'text/html'

get "/static/map?" do
  puts request.url
  query_string = query_string_to_hash( request.query_string )
  map_url = 'http://mesa.welcomebackstage.com/staticmaps/html/staticmap.html?' + request.query_string
puts "***"
puts request.query_string
puts map_url
  #map_url = CGI::escape( map_url )
  map_url.gsub!( '?', '%3F')
puts map_url

  screenshot_url = 'http://mesa.welcomebackstage.com/screenshot/site/pause:5/' + map_url

puts screenshot_url

# Net::HTTP.get URI.parse( map_url )
 
  image_data = Net::HTTP.get URI.parse( screenshot_url )
  headers["Content-Type"] = "image/png"

  image_data
  # TODO: specify image format
end

def query_string_to_hash( qs )
  CGI.parse( qs )
end

def request_remote_url()
  
end
