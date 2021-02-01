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
    print "#{filename} already exists, shall we overwrite [y/n] ".blue
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


desc "Launch in devel mode"
task :devel do
  system "JEKYLL_ENV=development bundle exec jekyll serve --watch --drafts --incremental"
end # task :devel


desc "Launch in preview mode"
task :preview do
  system " bundle exec jekyll serve --watch --incremental"
end # task :preview


desc "Generate icons based on gravatar email"
task :icons do
  puts "Getting author email from _config.yml...".blue
  config = YAML.load_file('_config.yml')
  author_email = config['author']['email']
  gravatar_id = Digest::MD5.hexdigest(author_email)
  base_url = "http://www.gravatar.com/avatar/#{gravatar_id}?s=150"

  origin = "images/about.png"
  File.delete origin if File.exist? origin

  puts "Downloading base image file from gravatar...".blue
  open(origin, 'wb') do |file|
    file << open(base_url).read
  end

  name_pre = "images/apple-touch-icon-%dx%d-precomposed.png"

  puts "Deleting previous images".red
  FileList["favicon.ico", "images/apple-touch-ico*.png"].each do |img|
    if File.exist? img
      puts "Deleting #{img}".red
      File.delete img
    end
  end

  puts "Generating favicon.ico...".blue
  Magick::Image::read(origin).first.resize(32, 32)
      .write("favicon.ico")

  [144, 114, 72, 57].each do |size|
    img_name = name_pre % [size, size]
    puts "Generating #{img_name} icon...".blue
      Magick::Image::read(origin).first.resize(size, size)
        .write(img_name)
  end
  puts "Cleaning up #{origin}...".red
  File.delete origin if File.exist? origin
end # task :icons


desc "Install npm dependencies"
task :npm do
  system("npm install")
end # task :npm


desc "Install libs required by theme"
task :js do
  jquery_js = "node_modules/jquery/dist/jquery.min.js"
  bootstrap_js = "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
  bootstrap_js_map = "#{bootstrap_js}.map"
  puts "Downloading and installing required javascript plugins".blue
  [jquery_js, bootstrap_js, bootstrap_js_map].each do |js_lib|
     abort "[ERRROR #{js_lib} not found! Try running rake npm]" \
       unless File.exists? js_lib
     FileUtils.cp js_lib, 'js', :verbose => true
   end
end # task :js


desc "Install theme's third party css"
task :css do
  bootstrap_src = 'node_modules/bootstrap/scss'
  bootstrap_dst = '_sass/bootstrap'
  abort "[ERROR] #{bootstrap_src} not found! Try running rake npm".red \
    unless Dir.exists? bootstrap_src
  puts "Copy bootstrap scss to _sass folder".blue
  FileUtils.mkdir_p bootstrap_dst
  FileUtils.cp_r bootstrap_src, bootstrap_dst, :verbose => true
end # task :ccs


desc "Prepare repository (icons + js)"
task :prepare => [:icons, :js, :css]


desc "Clean site"
task :clean do
  puts "Clean Jekyll's site".red
  system('bundle exec jekyll clean')
  FileUtils.rm_rf "node_modules", :verbose => true
end # task :clean

desc "Purge site"
task :purge => :clean do
  puts "Purge Jekyll's site".red
  system('rm -vrf favicon.ico images/apple-touch-ico*')
end # task :purge

