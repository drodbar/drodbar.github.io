require 'rubygems'
require 'rake'
require 'yaml'
require 'time'
require 'open-uri'
require 'rmagick'
require 'colorize'
require 'Digest'

POSTS = ENV['dir'] || File.join('.', '_posts')

###
# Based on jekyll-bootstrap's Rakefile.
# Thanks, @plusjade
# https://github.com/plusjade/jekyll-bootstrap
###

# Usage: rake post title='A Title' [date='2012-02-09']
desc "Begin a new post in #{POSTS}"
task :post do
  abort("[ERROR] #{POSTS} dir not found.") unless File.directory?(POSTS)
  title = ENV["title"] || "new-post"
  slug = title.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')
  rawdate = ENV['date'] ? Time.parse(ENV['date']) : Time.now
  begin
    date = rawdate.strftime('%Y-%m-%d')
  rescue Exception => _
    puts "[ERROR] Date format must be YYYY-MM-DD".red
    exit 1
  end
  filename = File.join(POSTS, "#{date}-#{slug}.md")
  if File.exist?(filename)
    print "#{filename} already exists, shall we overwrite [y/n] ".yellow
    overwrite = STDIN.gets.strip.downcase
    abort("[ERROR] File overwrite aborted") if overwrite != 'y'
  end

  puts "Creating new post: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "layout: post"
    post.puts "title: \"#{title.gsub(/-/,' ')}\""
    post.puts "category: #{ENV['category'].split(',')}" if ENV['category']
    post.puts "---"
  end
end # task :post

desc "Launch pro like env"
task :start => :build do
  system "foreman start"
end # task :preview

desc "Launch preview environment"
task :preview => :build do
  system "foreman start -f Procfile.dev"
end # task :preview

desc "Generate icons based on gravatar email"
task :icons do
  puts "Getting author email from _config.yml...".yellow
  config = YAML.load_file('_config.yml')
  author_email = config['author']['email']
  gravatar_id = Digest::MD5.hexdigest(author_email)
  base_url = "http://www.gravatar.com/avatar/#{gravatar_id}?s=150"

  origin = "images/about.png"
  File.delete origin if File.exist? origin

  puts "Downloading base image file from gravatar...".yellow
  open(origin, 'wb') do |file|
    file << open(base_url).read
  end

  name_pre = "images/apple-touch-icon-%dx%d-precomposed.png"

  puts "Deleting previous images".red
  FileList["images/favicon.ico", "images/apple-touch-ico*.png"].each do |img|
    puts "Deleting #{img}".red
    File.delete img
  end

  puts "Generating new images".yellow
  puts "Generating images/favicon.ico...".yellow
  Magick::Image::read(origin).first.resize(32, 32)
      .write("images/favicon.ico")

  [144, 114, 72, 57].each do |size|
    puts "Generating #{size}x#{size} icon...".yellow
      Magick::Image::read(origin).first.resize(size, size)
        .write(name_pre % [size, size])
  end
  puts "Cleaning up #{origin}...".red
  File.delete origin
end # task :icons

desc "Install libs required by theme"
task :build do
  #puts "Downloading and installing required javascript plugins".blue
  #system('npm install')
  #puts "Build using custom npm script 'build'".blue
  #system('npm run build')
  puts "Build site".blue
  puts `bundle exec jekyll build --incremental`
end # task :build

desc "Clean site"
task :clean do
  puts "Clean Jekyll's site".red
  system('bundle exec jekyll clean')
  puts "Remove css node_modules assets/dist".red
  system('rm -rf css node_modules assets/dist')
end # task :clean

